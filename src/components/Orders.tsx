import * as React from "react"
import { Table, Spinner } from "react-bootstrap"
import OrderType from "../Types/OrderType"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"
import { useState } from "react"
import styled from "styled-components"

interface TableProps {
    data: OrderType[];
    loading: boolean;
    headers: string[];
    handleHeaderClick: (value: string) => void;
    handleSelectedItem: (value: OrderType) => void;
}


const StyledOrders = styled.div<{ isLoading: boolean }>`
    position: ${props => props.isLoading && 'absolute'};
    left: ${props => props.isLoading && '50%'};
    top: ${props => props.isLoading && '50%'};

    height: ${props => props.isLoading ? '100%' : '80vh'};
    
    overflow: auto;

`

const Orders: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, handleSelectedItem }) => {
    const [selectedItem, setSelectedItem] = useState<number>(-1)


    return (
        <StyledOrders isLoading={loading}>
            {loading ? <Spinner animation="grow" /> :
                <Table striped bordered hover size="sm" >
                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                    <tbody>
                        {data.map(item => {
                            return (

                                <tr key={item.id} style={{ background: item.id === selectedItem ? '#00afec' : '', color: item.id === selectedItem ? 'white' : '' }} onClick={() => {
                                    setSelectedItem(item.id)
                                    handleSelectedItem(item)
                                }} >
                                    <td >{item.id} </td>
                                    <td>{item.customer}</td>
                                    <td>{item.createAt}</td>
                                    <td>{moneyFormat(item.paid.toString())}</td>
                                    <td>{item.note}</td>
                                </tr>)
                        })}
                    </tbody>
                </Table>}
        </StyledOrders>
    )
}
export default Orders
