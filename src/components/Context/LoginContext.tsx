import React, { createContext, useState } from 'react'
export const LoginContext = createContext({
    isAuth: false,
    login: () => { }
});
const AuthContextProvider: React.FC<{}> = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const loginHandler = () => {
        setIsAuthenticated(!isAuthenticated)
    }
    return (

        <LoginContext.Provider value={{ login: loginHandler, isAuth: isAuthenticated }}>
            {props.children}
        </LoginContext.Provider>
    )
}
export default AuthContextProvider;