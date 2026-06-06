const backend = "http://localhost:3000"

async function handleformsubmit(event){
    event.preventDefault()

    const roomDetails = {
        roomId: document.getElementById("roomId").value,
        password: document.getElementById("password").value
    }
    const token = localStorage.getItem("Token")
    await axios.post(`${backend}/room/verifyRoom`,roomDetails,{headers:{authentication: token}})
    .then(res=>{
        console.log(res)
        alert("Joined room")
        console.log(res)
        localStorage.setItem("roomToken",res.data.roomToken)
        window.location.href = "./room.html"
    }).catch(err=>{
        console.log(err)
        alert("Something went wrong")
    })
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
    verify()
})