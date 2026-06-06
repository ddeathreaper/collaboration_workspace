    // const backend = "http://localhost:3000"
    const backend = "https://collab-backend-app.onrender.com"
    const socket = io(backend)

    let autoSaveTimeout = null
    let codeSaveTimeout = null
    let canvasInit = false
    let currCanvas = null



    function userDropdown(){
        const dropdown = document.getElementById("userDropdown")

        if(dropdown){
            dropdown.addEventListener("click",e=>{
                e.stopPropagation()
                dropdown.classList.toggle("open")
            })
        }
        window.addEventListener("click",()=>{
            dropdown.classList.remove("open")
        })
    }

    function stickyNoteData(){
        const stickyNotes = []
        const notes = document.querySelectorAll(".sticky-note")

        notes.forEach(note=>{
            const textArea = note.querySelector("textarea")
            stickyNotes.push({
                text: textArea.value,
                left: note.style.left,
                top: note.style.top,
                zIndex: parseInt(note.style.zIndex) || 1
            })
        })
        return stickyNotes
    }

    function autoSave(){
        try {
            clearTimeout(autoSaveTimeout)


            autoSaveTimeout = setTimeout(async()=>{
                const canvas = document.getElementById("whiteboard-canvas")
                console.log("Data saving started")
                
                const canvasMemory = canvas.toDataURL("image/png")

                const stickyNotes = stickyNoteData()
                
                const roomToken = localStorage.getItem("roomToken")
                const token = localStorage.getItem("Token")
        
                await axios.post(`${backend}/room/saveWhiteboard`,{
                    canvasMemory:canvasMemory, stickyNotes:stickyNotes
                },{
                    headers:{authorization: roomToken,authentication: token}
                }
                )

                console.log("Data saved")
            },500)
        } catch (error) {
            console.log(error)
        }
    }

    function autoSaveCode(){
        try {
            clearTimeout(codeSaveTimeout)
            codeSaveTimeout = setTimeout(async()=>{
                const roomToken = localStorage.getItem("roomToken")
                const codeArea = document.getElementById("code-editor")

                const codeContent = codeArea.value
                const language = document.getElementById("language-select").value
                const token = localStorage.getItem("Token")

                await axios.post(`${backend}/room/saveCode`,{codeContent,language},{
                    headers:{ authorization: roomToken,authentication: token}
                })

                console.log("Code saved successfully")
            },500)
        } catch (error) {
            console.log(error)
        }
    }


    function stickyNote(){
        const stickyBtn = document.getElementById("tool-sticky")
        stickyBtn.addEventListener("click",()=>{
            createNote()
            socket.emit("sendNotes",{roomId:window.roomId, stickyNotes:stickyNoteData()})
        })
    }

    function createNote(savedNote = null, remoteUpdate = false){
        const container = document.getElementById("canvas-container")
        const note = document.createElement("div")
        note.classList.add("sticky-note")

        if(savedNote){
            note.style.left = savedNote.left
            note.style.top = savedNote.top
            note.style.zIndex = savedNote.zIndex || 1
        }else{
        note.style.left = `${container.clientWidth /2 -50}px`
        note.style.top = `${container.clientHeight /2 - 50}px`
        }


        const deleteBtn = document.createElement("button")
        deleteBtn.classList.add("sticky-close-btn")
        deleteBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>"
        note.appendChild(deleteBtn)


        const textArea = document.createElement("textarea")
        textArea.placeholder = "Type something..."
        if(savedNote){
            textArea.value = savedNote.text
        }
        note.append(textArea)


        container.appendChild(note)

        if(!savedNote && !remoteUpdate){
            autoSave()
        }

        deleteBtn.addEventListener("click",(e)=>{
            if(confirm("Are you sure you want to delete note?")){
                note.remove()
                socket.emit("sendNotes",{roomId:window.roomId, stickyNotes:stickyNoteData()})
                autoSave()
            }
        })
        
        textArea.addEventListener("input",()=>{
            autoSave()
            socket.emit("sendNotes",{roomId:window.roomId,stickyNotes:stickyNoteData()})
        })

        let dragging = false
        let changedX = 0
        let changedY = 0

        note.addEventListener("mousedown",(e)=>{
            if(e.target == textArea || e.target == deleteBtn){
                return
            }

            dragging = true
            changedX = e.clientX - note.offsetLeft
            changedY = e.clientY - note.offsetTop
            
            document.querySelectorAll(".sticky-note").forEach(note=>{
                note.style.zIndex = 1
            })
            note.style.zIndex = 10
        })

        window.addEventListener("mousemove",(e)=>{
            if(!dragging){
                return
            }

            let x = e.clientX - changedX
            let y = e.clientY - changedY

            note.style.left = `${x}px`
            note.style.top = `${y}px`

            socket.emit("sendNotes",{roomId:window.roomId, stickyNotes:stickyNoteData()})
        })

        window.addEventListener("mouseup",()=>{
            if(dragging){
                dragging = false
                autoSave()
            }
        })
    }

    function tabChange(){
        document.getElementById("tab-code").addEventListener("click",()=>{
            document.getElementById("whiteboard-view").className = "workspace-panel inactive"
            document.getElementById("code-view").className = "workspace-panel active"
            document.getElementById("tab-whiteboard").classList.remove("active")
            document.getElementById("tab-code").classList.add("active")
        })
        document.getElementById("tab-whiteboard").addEventListener("click",()=>{
            document.getElementById("code-view").className = "workspace-panel inactive"
            document.getElementById("whiteboard-view").className = "workspace-panel active"
            document.getElementById("tab-code").classList.remove("active")
            document.getElementById("tab-whiteboard").classList.add("active")
        })
    }

    function setupWhiteboard(){
        let startX = 0
        let startY = 0
        let memory = null

        const canvas = document.getElementById("whiteboard-canvas")
        const ctx = canvas.getContext("2d")

        const container = document.getElementById("canvas-container")
        const brushSize = document.getElementById("brush-size")
        const colorPicker = document.getElementById("color-picker")
        const toolBtns = document.querySelectorAll(".tool-btn")
        const clearBtn = document.getElementById("tool-clear")
        let drawing = false
        let currentTool = "pencil"
        
        function resizeCanvas(){
            const tempCanvas = document.createElement("canvas")
            tempCanvas.width = canvas.width
            tempCanvas.height = canvas.height
            const tempCtx = tempCanvas.getContext("2d")
            tempCtx.drawImage(canvas,0,0)


            canvas.width = container.clientWidth
            canvas.height = container.clientHeight

            ctx.lineCap = "round"
            ctx.lineJoin = "round"

            if(currCanvas){
            ctx.drawImage(currCanvas,0,0)
            }else{
                ctx.drawImage(tempCanvas,0,0)
            }
            if(!canvasInit){
                canvasInit = true
                getRoomId()
            }
        }
        resizeCanvas()
        window.addEventListener("resize",resizeCanvas)

        toolBtns.forEach(btn=>{
            btn.addEventListener("click",()=>{
                if (btn.id == "tool-clear") return
                document.querySelector(".tool-btn.active").classList.remove("active")
                btn.classList.add("active")

                if (btn.id == "tool-pencil"){
                    currentTool = "pencil"
                }
                if (btn.id == "tool-rectangle"){
                    currentTool = "rectangle"
                }
                if (btn.id == "tool-circle"){
                    currentTool = "circle"
                }
            })
        })

        function startDrawing(e){
            drawing = true

            const rect = canvas.getBoundingClientRect()
            startX = e.clientX - rect.left
            startY = e.clientY - rect.top
            
            ctx.beginPath()

            ctx.moveTo(startX, startY)

            ctx.strokeStyle = colorPicker.value
            ctx.lineWidth = brushSize.value

            memory = ctx.getImageData(0, 0, canvas.width, canvas.height)
        }

        function draw(e){
            if (!drawing) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            if (currentTool === "pencil"){
            ctx.lineTo(x, y)
            ctx.stroke()
            }else{
                ctx.putImageData(memory,0,0)
                ctx.strokeStyle = colorPicker.value
                ctx.lineWidth = brushSize.value
                ctx.lineCap = "round"
                ctx.lineJoin = "round"
                if(currentTool === "rectangle"){
                    drawRectangle(x,y)
                }else if(currentTool === "circle"){
                    drawCircle(x, y)
                }
            }
            const canvasMemory = canvas.toDataURL("image/png")
            socket.emit("sendCanvas",{roomId:window.roomId, canvasMemory:canvasMemory})
        }

        function stopDrawing(){
            if (drawing){
                ctx.closePath()
                drawing = false
                autoSave()
            }
        }

        function drawRectangle(currX, currY){
            const width = currX - startX
            const height = currY - startY
            ctx.strokeRect(startX,startY,width,height)
        }

        function drawCircle(currX, currY){
            ctx.beginPath()
            const radius = Math.sqrt(Math.pow(currX - startX, 2) + Math.pow(currY - startY,2))
            ctx.arc(startX, startY, radius, 0, 2*Math.PI)
            ctx.stroke()
        }

        canvas.addEventListener("mousedown", startDrawing)
        canvas.addEventListener("mouseup", stopDrawing)
        canvas.addEventListener("mousemove", draw)
        canvas.addEventListener("mouseout", stopDrawing)

        clearBtn.addEventListener("click", ()=>{
            if (confirm("Are you sure you want to clear out the canvas?")){
                ctx.clearRect(0,0,canvas.width,canvas.height)
                autoSave()
            }
        })
    }



    async function loadWhiteboard(){
        try {
            const roomToken = localStorage.getItem("roomToken")
            const canvas = document.getElementById("whiteboard-canvas")
            const ctx = canvas.getContext("2d")
            const token = localStorage.getItem("Token")

            const res = await axios.get(`${backend}/room/loadWhiteboard`,{
                headers: {authorization:  roomToken,authentication: token}
            })

            const whiteboard = res.data.whiteboard

            const {canvasMemory,stickyNotes} = whiteboard

            if(canvasMemory){
                const img = new Image()
                img.src = canvasMemory
                img.onload = ()=>{
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                    ctx.drawImage(img,0,0)
                    currCanvas = img
                }
            }

            if(stickyNotes){
                stickyNotes.forEach(noteData=>{
                    createNote(noteData)
                })
            }

            console.log("Data saved successfully")
        } catch (error) {
            console.log(error)
        }
    }

    async function getRoomId(){
        try {
            const roomToken = localStorage.getItem("roomToken")
            const userName = localStorage.getItem("userName")

            if(!roomToken || !userName){
                window.location.href = "./signinRoom.html"
                return
            }


            const token = localStorage.getItem("Token")
            const res = await axios.get(`${backend}/room/getRoomId`,{headers: {authorization: roomToken,authentication: token}})
            // console.log(res)
            window.roomId = res.data.roomId
            socket.emit("joinRoom",{roomId: window.roomId,userName:userName})
            loadWhiteboard()
            loadCode()
            const roomIdDisplay = document.getElementById("room-id-display")
            roomIdDisplay.textContent = `Room: ${window.roomId}`
            const copyBtn = document.getElementById("copy-btn")
            copyBtn.addEventListener("click",()=>{
                navigator.clipboard.writeText(window.roomId)
                .then(()=>{
                    const origText = roomIdDisplay.textContent
                    roomIdDisplay.textContent = "Copied to clipboard!"
                    setTimeout(()=>{
                        roomIdDisplay.textContent = origText
                    },1000)
                })
            })
        } catch (error) {
            console.log(error)
        }
    }

    function renderUsers(users){
        const usersList = document.getElementById("usersList")
        const dropdown = document.querySelector("#userDropdown h3")

        usersList.innerHTML = ""

        dropdown.innerHTML = `Active Users: ${users.length}`

        users.forEach(user=>{
            const li = document.createElement("li")
            li.classList.add("user")

            li.innerHTML = `<i class="fa-regular fa-user"></i> ${user}`
            usersList.appendChild(li)
        })
    }



    async function leaveRoom(){
        const roomToken = localStorage.getItem("roomToken")
        if (!roomToken){
            window.location.href = "./signinRoom.html"
        }

        const leaveBtn = document.getElementById("leave-btn")

        leaveBtn.addEventListener("click",()=>{
            localStorage.removeItem("roomToken")
            window.location.href = "./signinRoom.html"
            socket.emit("disconnect")
        })
    }

    function renderCanvas(memory){
        const canvas = document.getElementById("whiteboard-canvas")
        const ctx = canvas.getContext("2d")

        if(!memory){
            return
        }
        const img = new Image()
        img.src = memory
        img.onload = ()=>{
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(img,0,0)
        }
    }




    socket.on("receiveCanvas",canvasMemory=>{
        renderCanvas(canvasMemory)
    })

    socket.on("receiveNotes",stickyNotes=>{
        const notes = document.querySelectorAll(".sticky-note")
        notes.forEach(note=>{
            note.remove()
        })

        stickyNotes.forEach(noteData=>{
            createNote(noteData,true)
        })
    })

    socket.on("receiveCode",code=>{
        const codeArea = document.getElementById("code-editor")
        const selectionStart = codeArea.selectionStart
        const selectionEnd = codeArea.selectionEnd
        codeArea.value = code

        if(document.activeElement == codeArea){
            codeArea.setSelectionRange(selectionStart,selectionEnd)
        }
    })


    socket.on("roomUsers",(activeUsers)=>{
        renderUsers(activeUsers)
    })





    function saveCode(){
        const codeArea = document.getElementById("code-editor")

        codeArea.addEventListener("input",(event)=>{
            const code = event.target.value
            socket.emit("sendCode",{roomId:window.roomId, code:code})
            autoSaveCode()
        })
    }

    async function loadCode(){
        const codeArea = document.getElementById("code-editor")
        const roomToken = localStorage.getItem("roomToken")
        const token = localStorage.getItem("Token")
        const res = await axios.get(`${backend}/room/loadCode`,{
            headers:{authorization: roomToken,authentication:token}
        })

        const code = res.data.codeContent

        codeArea.value = code
    }

    async function verify(){
        const token = localStorage.getItem("Token")
        if(!token){
            window.location.href = "./login.html"
        }
    
        await axios.get(`${backend}/user/permit`,{headers:{authentication:token}}).then(()=>{
            console.log("User verified")
        }).catch(err=>{
            console.log(error)
            localStorage.clear()
            window.location.href = "./login.html"
        })
    }
    window.addEventListener("DOMContentLoaded",()=>{
        verify(),
        userDropdown(),
        leaveRoom(),
        tabChange(),
        stickyNote(),
        setupWhiteboard(),
        saveCode()
    })