import * as React from "react"
import TableHeader from "./TableHeader"
import { Table, Spinner } from "react-bootstrap"
import CustomerType from "../Types/CustomerType"

import { useState } from "react"
interface TableProps {
    data: CustomerType[];
    loading: boolean;
    headers: string[];
    handleHeaderClick: (value: string) => void;
    handleSelectedItem: (id: number) => void;
    getSelectedCustomer: (value: CustomerType) => void;
    tableHeight: string
    tablewidth: string
}

const Customer: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, handleSelectedItem, getSelectedCustomer, tableHeight, tablewidth }) => {
    const [selectedItem, setSelectedItem] = useState<number>(-1)
    let style = {
        height: tableHeight,
        width: tablewidth,
        overflow: "auto",
    }
    return (
        <div style={style} >
            {loading ? <Spinner animation="grow" /> :
                <Table striped bordered hover size="sm"  >
                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                    {headers.length === 1 ? <tbody>
                        {data.map(item => {
                            return (
                                <tr key={item.name} style={{ background: item.id === selectedItem ? '#00afec' : '', color: item.id === selectedItem ? 'white' : '' }} onClick={() => {
                                    setSelectedItem(item.id)
                                    handleSelectedItem(item.id)
                                    getSelectedCustomer(item)
                                }}>
                                    <td >{item.name} </td>
                                </tr>)
                        })}
                    </tbody> : <tbody>
                            {data.map(item => {
                                return (
                                    <tr key={item.name} style={{ background: item.id === selectedItem ? '#00afec' : '', color: item.id === selectedItem ? 'white' : '' }} onClick={() => {
                                        setSelectedItem(item.id)
                                        handleSelectedItem(item.id)
                                        getSelectedCustomer(item)
                                    }}>
                                        <td >{item.id} </td>
                                        <td >{item.name}</td>
                                        <td >{item.address} </td>
                                        <td >{item.phone} </td>
                                    </tr>)
                            })}
                        </tbody>}
                </Table>}
        </div>
    );
}
export default Customer;