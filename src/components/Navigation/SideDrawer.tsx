import * as React from "react"
import Logo from "../Logo"
import NavigationItems from "../Navigation/NavigationItems/NavigationItems"
import styled from "styled-components"
import BackDrop from "../BackDrop"
const Div = styled.div`
    position: fixed;
    width: 280px;
    max-width: 70%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 200;
    background-color: white;
    padding: 32px 16px;
    box-sizing: border-box;
    transition: transform 0.3s ease-out;
    @media (min-width: 500px) {
        display: none;
    }
    &.open{
        transform: translateX(0);
    }
    &.closed{
        transform: translateX(-100%)
    }
`
const SideDrawer: React.FC<{}> = props => {
    return (
        <div>
            <BackDrop show={true} handleClick={() => { }} />
            <Div>
                <Logo logoHeight={"11%"} />
                <nav>
                    <NavigationItems></NavigationItems>
                </nav>
            </Div>
        </div>
    )
}
export default SideDrawer;