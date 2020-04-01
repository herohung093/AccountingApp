import * as React from "react"
import { Table, Spinner, Row } from "react-bootstrap"
import OrderType from "../Types/OrderType"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"
import { useState } from "react"
import ExpenseType from "../Types/ExpenseType"
import { Alert, Badge } from "react-bootstrap"
interface TableProps {
    data: ExpenseType[];
    handleHeaderClick: (value: string) => void;
    handleSelectedItem: (value: OrderType) => void;
}
const headers = ["Id", "Category", "Amount", "Date", "Note", "createAt"]
const Expenses: React.FC<TableProps> = ({ data, handleHeaderClick, handleSelectedItem }) => {
    const [selectedItem, setSelectedItem] = useState<number>(-1)
    const calculateTotal = (): number => {
        let total = 0;
        data.forEach(item => { total += item.amount })
        return total;
    }
    return (
        <div>
            <Table striped bordered hover size="sm" >
                <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                <tbody>
                    {data.map(item => {
                        return (

                            <tr key={item.id} style={{ background: item.id === selectedItem ? '#00afec' : '', color: item.id === selectedItem ? 'white' : '' }} onClick={() => {
                                setSelectedItem(item.id)

                            }} >
                                <td >{item.id} </td>
                                <td>{item.category}</td>
                                <td>{moneyFormat(item.amount.toString())}</td>
                                <td>{item.date}</td>
                                <td style={{ width: "30%" }}>{item.note}</td>
                                <td>{item.createAt}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
            <Alert variant="success" style={{ width: "40%" }}>
                <Row>
                    <h5>Total: </h5>
                    <h5><Badge pill variant="warning">{moneyFormat(calculateTotal().toString())}</Badge></h5>
                </Row>
            </Alert>
        </div>
    )
}
export default Expenses;