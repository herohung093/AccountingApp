import * as React from "react"
import { Form, Button } from "react-bootstrap"
import { useState } from "react"
interface componentProps {
    handleLogin: (email: string, password: string) => void
}
interface authType {
    user: string;
    password: string;
}
const initAuthForm = {
    user: "",
    password: ""
}
const Login: React.FC<componentProps> = ({ handleLogin }) => {
    const [auForms, setAuthForms] = useState<authType>(initAuthForm)

    const handleAuthFormchange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;
        setAuthForms({ ...auForms, [name]: value });
    }

    return (
        <Form onSubmit={(e: any) => {
            e.preventDefault()
            handleLogin(auForms.user, auForms.password)
        }}>
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
    )
}
export default Login;