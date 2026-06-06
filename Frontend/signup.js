backend = "http://localhost:3000"

function handleformsubmit(event){
    event.preventDefault()
    const userDetails = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value 
    }

    axios.post(`${backend}/user/addUser`,userDetails)
    .then(()=>{
        alert("User created")
        window.location.href = "./login.html"
    }).catch(err=>{
        console.log(err)
        alert("Something went wrong")
    })
}

