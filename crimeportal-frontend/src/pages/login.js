import axios from "axios"
import {useState} from "react"
import {useNavigate} from "react-router-dom"

function Login(){

const nav = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const login = async()=>{

const res = await axios.post(
"http://127.0.0.1:8000/login",
{email,password}
)

if(res.data.message==="OTP sent"){

localStorage.setItem("email",email)

nav("/verify")

}

}

return(

<div>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

</div>

)

}

export default Login

