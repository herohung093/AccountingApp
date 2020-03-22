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
    getSelectedCustomerName: (value: string) => void;
}

const Customer: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, handleSelectedItem, getSelectedCustomerName }) => {
    const [selectedItem, setSelectedItem] = useState<number>(-1)
    return (
        <div style={{ height: "30vh", overflow: "auto", width: "22vh" }}>
            {loading ? <Spinner animation="grow" /> :
                <Table striped bordered hover size="sm"  >
                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                    <tbody>
                        {data.map(item => {
                            return (
                                <tr key={item.name} style={{ background: item.id === selectedItem ? '#00afec' : '', color: item.id === selectedItem ? 'white' : '' }} onClick={() => {
                                    setSelectedItem(item.id)
                                    handleSelectedItem(item.id)
                                    getSelectedCustomerName(item.name)
                                }}>
                                    <td >{item.name} </td>
                                </tr>)
                        })}
                    </tbody>
                </Table>}
        </div>
    );
}
export default Customer;