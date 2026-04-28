import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register(){

const nav = useNavigate()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const registerUser = async ()=>{

await axios.post("http://127.0.0.1:8000/register",{

name,
email,
password

})

alert("Account Created")

nav("/")

}

return(

<div className="auth-container">

<h1>Start Building</h1>

<p>Create free account</p>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={registerUser}>
Create Account
</button>

</div>

)

}

export default Register