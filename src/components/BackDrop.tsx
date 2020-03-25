import * as React from "react"
import styled from "styled-components"

const Div = styled.div`
width: 100%;
height: 100%;
position: fixed;
z-index: 100;
left: 0;
top: 0;
background-color: rgba(0,0,0,0.5)
`
const BackDrop: React.FC<{}> = props => {

    return (
        <Div>

        </Div>
    )
}
export default BackDrop;