import * as React from "react"
import styled from "styled-components"
import Logo from "../../Logo"
import NavigationItems from "../NavigationItems/NavigationItems"
import { Nav } from "react-bootstrap"

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
            <Logo logoHeight={"100%"} />
            <Nav>
                <NavigationItems />

            </Nav>
        </Header>


    );
}
export default ToolBar;