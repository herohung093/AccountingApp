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

const NavigationItem: React.FC<{ children: string, link: string }> = props => {
    return (
        <div style={{ margin: "0", boxSizing: "border-box", display: "flex", height: "100%", alignItems: "center" }}><Li>
            <NavLink to={props.link} exact activeStyle={{
                color: "#fa923f",
                textDecoration: "underline"
            }}
                style={{ color: "white", textDecoration: "none", height: "100%", padding: "16px 10px", borderBottom: "4px solid transparent", boxSizing: "border-box", display: "block" }}
            >{props.children}</NavLink></Li>

            {/* <a style={{color: "white", textDecoration: "none", height: "100%", padding: "16px 10px", borderBottom: "4px solid transparent", boxSizing: "border-box", display: "block"}}></a> */}

        </div>
    );
}
export default NavigationItem