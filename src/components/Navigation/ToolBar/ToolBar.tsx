import * as React from "react"
import styled from "styled-components"
import Logo from "../../Logo"
import NavigationItems from "../NavigationItems/NavigationItems"
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
background-color: #5c3d57;
display: flex;
justtify-content: space-between;
alight-items: center;
padding: 0 20px;
box-sizing: border-box;
z-index: 90
`;
const Nav = styled.nav`
height: 100%;

`
const ToolBar: React.FC<{}> = props => {
    return (
        <Header>
            <Logo />
            <Nav>
                {/* 
                <Ul>
                    <Li><NavLink to="/" exact activeStyle={{
                        color: "#fa923f",
                        textDecoration: "underline"
                    }}>Processing Order</NavLink></Li>
                    <Li><NavLink to="/createorder" activeStyle={{
                        color: "#fa923f",
                        textDecoration: "underline"
                    }}>Create Order</NavLink></Li>
                </Ul> */}

                <NavigationItems />
            </Nav>
        </Header>

    );
}
export default ToolBar;