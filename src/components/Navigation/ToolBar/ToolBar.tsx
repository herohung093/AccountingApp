import * as React from "react"
import styled from "styled-components"
import Logo from "../../Logo"
import NavigationItems from "../NavigationItems/NavigationItems"
import { Navbar, NavDropdown, Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"
// const Ul = styled.ul`
// list-style: none;
// margin: 0;
// padding: 0`
// const Li = styled.li`
// display: inline-block;
// margin: 20px`
// const A = styled.a`
// text-decoration: none;
// color: black
// &:hover, &:active {
//   color: #fa923f;
// }`
const Header = styled.header`
height: 56px;
width: 100%;
position: fixed;
top: 0;
left: 0;
background-color: #f8edfa;
display: flex;
align-content: center;
padding: 0 20px;
box-sizing: border-box;
z-index: 90;
`
const ToolBar: React.FC<{}> = props => {
    return (
        <Header>
            <Logo />
            <Nav>


                <NavigationItems />

            </Nav>
        </Header>


    );
}
export default ToolBar;