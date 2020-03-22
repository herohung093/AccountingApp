import * as React from "react"
import CustomerType from "../Types/CustomerType"
import styled from "styled-components";
interface TableProps {
    data: CustomerType[];
    showSuggestions: boolean;
    handleSelectedItem: (item: CustomerType) => void;
}
const Ul = styled.ul`
    list-style: none;
    height:max-content;
    overflow: auto;
    width:98%;
    background: #e0b1ce;
    z-index: 10;
    position: absolute;
    padding-left: 4px;
    border-radius: 5px;
&:hover{
    
}`
const Li = styled.li`
padding-left: 2px;
&:hover{
    overflow: overLay;
    background: #b1c1e0;
    border-radius: 2px;
}
`
const Suggestions: React.FC<TableProps> = ({ data, handleSelectedItem, showSuggestions }) => {
    const display = data.map(r => (
        <Li key={r.id} onClick={() => {
            handleSelectedItem(r)
        }}>
            {r.name}
        </Li>
    ))
    return (<div>
        {showSuggestions ? <Ul>{display}</Ul> : <></>}</div>
    )
}
export default Suggestions;