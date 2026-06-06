// const backend = "http://localhost:3000"
const backend = "https://collab-backend-app.onrender.com"

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


function handleformsubmit(event){
    event.preventDefault()

    const roomDetails = {
        roomId: document.getElementById("roomId").value,
        password: document.getElementById("password").value,
        language: document.getElementById("language").value
    }
    const token = localStorage.getItem("Token")
    axios.post(`${backend}/room/createRoom`, roomDetails,{
        headers:{authentication:token}
    })
    .then(res=>{
        console.log(res)
        localStorage.setItem("roomToken", res.data.roomToken)
        window.location.href = "./room.html"
    }).catch(err=>{
        console.log(err)
        alert("Something went wrong")
    })
}


window.addEventListener("DOMContentLoaded",()=>{
    verify()
})