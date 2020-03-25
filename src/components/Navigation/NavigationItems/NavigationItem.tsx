import * as React from "react"
import styled from "styled-components"
import { NavLink } from "react-router-dom"
const Li = styled.li`
    display: inline-block;
    margin: 20px;

    a { 
        transition: all 0.3s;
        &:hover {
            transform: scale(1.1)
        }
    }
`
const styledLink = {
    display: "block",
    width: "100%",
    height: "100%",
    padding: ".25rem 1.5rem",
    clear: 'both',
    fontWeight: 400,
    color: "#212529",
    textAlign: 'inherit',
    whiteSpace: 'nowrap',
    backgroundColor: "transparent",
    border: "0",
} as React.CSSProperties;

const NavigationItem: React.FC<{ children: string, link: string }> = props => {
    return (
        <div style={{
            margin: "0",
            boxSizing: "border-box",
            display: "flex",
            height: "4vh",
            alignItems: "center"
        }}><Li>
                <NavLink to={props.link} exact activeStyle={{
                    color: "#fa923f",
                    textDecoration: "underline"
                }}
                    style={styledLink}
                >{props.children}</NavLink></Li>


        </div>
    );
}
export default NavigationItem
