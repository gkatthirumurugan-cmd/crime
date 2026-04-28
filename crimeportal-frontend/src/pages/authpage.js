import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import { useGoogleLogin } from "@react-oauth/google";

function AuthPage(){

const [isRegister,setIsRegister] = useState(false)

const [username,setUsername] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")


// GOOGLE LOGIN
const googleLogin = useGoogleLogin({

onSuccess: (tokenResponse) => {

console.log(tokenResponse)

alert("Google Login Success")

},

onError: () => {

alert("Google Login Failed")

}

})


// LOGIN
const handleLogin = async (e) => {

e.preventDefault()

if(!username || !password){
alert("Enter username and password")
return
}

try{

const res = await axios.post("http://127.0.0.1:8001/login",{

email:username,
password:password

})

alert(res.data.message)

window.location.href="/dashboard"

}catch(err){

alert(err.response?.data?.detail || "Login failed")

}

}


// REGISTER
const handleRegister = async (e) => {

e.preventDefault()

if(!username || !email || !password){
alert("Fill all fields")
return
}

try{

const res = await axios.post("http://127.0.0.1:8001/register",{

name:username,
email:email,
password:password

})

alert(res.data.message)

setIsRegister(false)

}catch(err){

alert(err.response?.data?.detail || "Register failed")

}

}

return(

<div className={`container ${isRegister ? "active" : ""}`}>

    

{/* LOGIN FORM */}


<div className="form-box login">

<form onSubmit={handleLogin}>

<h1>Login</h1>

<div className="input-box">
<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>
<i className='bx bxs-user'></i>
</div>

<div className="input-box">
<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>
<i className='bx bxs-lock-alt'></i>
</div>

<div className="forgot-link">
<a href="/">Forgot Password?</a>
</div>

<button type="submit" className="btn">Login</button>

<p>or login with social platform</p>


<div className="social-icons">
    
<button onClick={googleLogin} className="social-btn">
<i className='bx bxl-google'> login with google</i>
</button>


</div>


</form>

</div>


{/* REGISTER FORM */}


<div className="form-box register">

<form onSubmit={handleRegister}>

<h1>Registration</h1>

<div className="input-box">
<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>
<i className='bx bxs-user'></i>
</div>

<div className="input-box">
<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>
<i className='bx bxs-envelope'></i>
</div>

<div className="input-box">
<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>
<i className='bx bxsf-lock-alt'></i>
</div>

<button type="submit" className="btn">Register</button>

<p>or register with social platform</p>

<div className="social-icons">
<button onClick={googleLogin} className="social-btn">
<i className='bx bxl-google'> login with google</i>
</button>

</div>

</form>

</div>


{/* TOGGLE PANEL */}

<div className="toggle-box">

<div className="toggle-panel toggle-left">

<h1>Hello, Welcome!</h1>

<p>Don't have an account?</p>

<button
className="btn register-btn"
onClick={()=>setIsRegister(true)}
>
Register
</button>

</div>


<div className="toggle-panel toggle-right">

<h1>Welcome Back!</h1>

<p>Already have an account?</p>

<button
className="btn login-btn"
onClick={()=>setIsRegister(false)}
>
Login
</button>

</div>

</div>

</div>


)

}

export default AuthPage