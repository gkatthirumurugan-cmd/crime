import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AuthPage from "./pages/authpage";
import DashboardPage from "./pages/dashboardpage";
import CrimeManager from "./pages/CrimeManager";

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<AuthPage/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/register" element={<Register/>}/>

<Route path="/dashboardpage" element={<DashboardPage />}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/crime-manager" element={<CrimeManager />} />

</Routes>

</BrowserRouter>

)

}

export default App;

