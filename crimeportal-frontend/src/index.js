import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'animate.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
<GoogleOAuthProvider clientId="518808022568-hmn21s5jso9c94cgf0nssbg28ltq7pep.apps.googleusercontent.com">
<App/>
</GoogleOAuthProvider>
);