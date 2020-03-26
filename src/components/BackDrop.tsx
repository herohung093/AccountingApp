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
interface BackDropProps {
    show: boolean;
    handleClick: (e: any) => void;
}
const BackDrop: React.FC<BackDropProps> = ({ show, handleClick }) => {

    return (
        <Div onClick={handleClick}>
        </Div>
    )
}
export default BackDrop;