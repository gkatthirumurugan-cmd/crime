import axios from "axios"
import {useState} from "react"
import {useNavigate} from "react-router-dom"

function VerifyOTP(){

const nav = useNavigate()

const [otp,setOtp] = useState("")

const email = localStorage.getItem("email")

const verify = async()=>{

const res = await axios.post(
"http://127.0.0.1:8000/verify-otp",
{
email,
otp
}
)

if(res.data.message==="Verified"){

nav("/dashboard")

}

}

return(

<div>

<h2>Enter OTP</h2>

<input
placeholder="Enter OTP"
onChange={(e)=>setOtp(e.target.value)}
/>

<button onClick={verify}>
Verify
</button>

</div>

)

}

export default VerifyOTP