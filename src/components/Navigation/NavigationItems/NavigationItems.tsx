import * as React from "react"
import NavigationItem from "./NavigationItem"
import styled from "styled-components"
import { NavDropdown } from "react-bootstrap"
import { useEffect, useState, useContext } from "react"
import { LoginContext } from "../../Context/LoginContext"
const Ul = styled.ul`
margin: 0;
padding: 0;
list-style: none;
display: flex;
flex-flow: row;
align-items: center;
height: 100%;

`

const NavigationItems: React.FC<{}> = props => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const authContext = useContext(LoginContext).isAuth

    useEffect(() => {
        if (authContext) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    })
    window.onstorage = () => {
        setIsAuth(localStorage.getItem("token") == null ? false : true)
        console.log(" storage changes")
    }
    return (
        <Ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", alignItems: "center", height: "100%" }}>



            {!isAuth ? <NavigationItem link="/auth" children="Sign In" /> : <><NavDropdown title="Order" id="collasible-nav-dropdown">
                <NavDropdown.Item ><NavigationItem link="/processingorder" children="Processing Order" /></NavDropdown.Item>
                <NavDropdown.Item ><NavigationItem link="/createorder" children="Create Order" /></NavDropdown.Item>
            </NavDropdown>
                <NavDropdown title="Customer" id="collasible-nav-dropdown">
                    <NavDropdown.Item ><NavigationItem link="/customers" children="Customers" /></NavDropdown.Item>
                    <NavDropdown.Item ><NavigationItem link="/createcustomer" children="Create Customer" /></NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Inventory" id="collasible-nav-dropdown">
                    <NavDropdown.Item ><NavigationItem link="/inventory" children="Inventory" /></NavDropdown.Item>
                    <NavDropdown.Item > <NavigationItem link="/inventoryhistory" children="Inventory History" /></NavDropdown.Item>
                    <NavDropdown.Item ><NavigationItem link="/powdermixing" children="Powder Mixing" /></NavDropdown.Item>
                    <NavDropdown.Item ><NavigationItem link="/createproduct" children="Create Product" /></NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Analysis" id="collasible-nav-dropdown">
                    <NavigationItem link="/" children="Analysis" />
                </NavDropdown>
                <NavigationItem link="/logout" children="Logout" />
            </>}

        </Ul>
    );
}
export default NavigationItems