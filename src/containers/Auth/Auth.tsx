import * as React from "react"
import { Form, Button, Col } from "react-bootstrap"
import { useState, useEffect, useContext } from "react"
import { Redirect } from "react-router-dom"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { LoginContext } from "../../components/Context/LoginContext"
import axios from "axios"

interface authType {
    user: string;
    password: string;
}
const initAuthForm = {
    user: "",
    password: ""
}
const Auth: React.FC<RouteComponentProps> = props => {
    const [auForms, setAuthForms] = useState<authType>(initAuthForm)
    const authContext = useContext(LoginContext)
    useEffect(() => {
        if (props.match.path.includes("logout")) {
            localStorage.clear();
            authContext.login();
        }
    })
    const handleAuthFormchange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;
        setAuthForms({ ...auForms, [name]: value });
    }

    const handleLogin = (e: any) => {
        e.preventDefault();
        sendLoginRequest();
    }
    const sendLoginRequest = async () => {
        const authData = {
            email: auForms.user,
            password: auForms.password,
            returnSecureToken: true
        }
        await axios
            .post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAN69UXfzYZyZKiskcOoKs-_iWyGhXYAfo", authData)
            .then(response => {
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("userId", response.data.localId);
                localStorage.setItem("expiresIn", response.data.expiresIn)
                authContext.login();
            })
            .catch(error => {
                console.log(error)

                // fail actions go here
            }

            )
    }
    return (

        <Col lg="3" md="6" style={{ height: "100vh" }}>
            <Form onSubmit={handleLogin}>
                <Form.Group controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email"
                        placeholder="Enter email"
                        required
                        name="user"
                        onChange={handleAuthFormchange}
                        value={auForms.user} />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password"
                        placeholder="Password"
                        required
                        name="password"
                        onChange={handleAuthFormchange}
                        value={auForms.password} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Sign in
                </Button>
            </Form>
            {authContext.isAuth ? <Redirect to="/" /> : <></>}
        </Col>

    )
}

export default withRouter(Auth)