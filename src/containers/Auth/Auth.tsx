import * as React from "react"
import { useState, useEffect, useContext } from "react"
import { Redirect } from "react-router-dom"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { LoginContext } from "../../components/Context/LoginContext"
import axios from "axios"
import styled from "styled-components"
import LoginBackground from "../../assess/Login_Background.png"
import Login from "../../components/Login"
import baseUrl from "../../common/baseUrl"
const Div = styled.div`
width: 100%;
margin-Top: 5vh;
height: 100vh;
padding-left: 1%;
padding-right: 1%;
@media(min-width: 500px){
    width: 50%;
    margin-Left: 25%;
}
@media(min-width: 769px){
    width: 20%;
    margin-Left: 40%;
}
`
const Auth: React.FC<RouteComponentProps> = props => {

    const authContext = useContext(LoginContext)
    const [loginMessage, setLoginMessage] = useState<string>("")
    useEffect(() => {
        kickStartBackendServer();
        if (props.match.path.includes("logout")) {
            localStorage.clear();
            authContext.login();
        }
    })

    const kickStartBackendServer = async () => {
        await axios
            .get(baseUrl.base + "customer/")
            .then(response => {
                console.log("Backend server started")
            })
            .catch(error => console.log(error))
    };

    const sendLoginRequest = async (email: string, password: string) => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        await axios
            .post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAN69UXfzYZyZKiskcOoKs-_iWyGhXYAfo", authData)
            .then(response => {
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("expiresIn", response.data.expiresIn)
                authContext.login();
                setLoginMessage("")
            })
            .catch(error => {
                console.log(error)
                setLoginMessage(error.message)
                // fail actions go here
            }
            )
    }

    return (
        <div style={{ width: "100%", height: "100vh", backgroundImage: `url(${LoginBackground})` }}>
            <Div>
                <Login handleLogin={sendLoginRequest} />
                <div>{loginMessage}</div>
                {authContext.isAuth ? <Redirect to="/" /> : <></>}
            </Div>
        </div>
    )
}

export default withRouter(Auth)