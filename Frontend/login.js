const backend = "http://localhost:3000"

function handleformsubmit(event){
    event.preventDefault()
    const loginDetails = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    axios.post(`${backend}/user/verifyUser`,loginDetails)
    .then((res)=>{
        console.log(res)
        alert("User logged in successfully")
        localStorage.setItem("Token", res.data.token)
        localStorage.setItem("userName",res.data.userName)
        window.location.href = "./createRoom.html"
    }).catch(err=>{
        console.log(err)
        alert("Something went wrong")
    })
}