import * as React from "react"
import TableHeader from "./TableHeader"
import { Table, Spinner } from "react-bootstrap"
import CustomerSoldType from "../Types/CustomerSoldType"
interface TableProps {
    data: CustomerSoldType[];
    loading: boolean;
    headers: string[];
    handleHeaderClick: (value: string) => void;
    tableHeight: string
    tablewidth: string
}
const CustomerSold: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, tableHeight, tablewidth }) => {
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
                    <tbody>
                        {data.map(item => {
                            return (
                                <tr key={item.product}>
                                    <td >{item.product} </td>
                                    <td>{item.quantity}</td>
                                </tr>)
                        })}
                    </tbody>
                </Table>}
        </div>
    )
}
export default CustomerSold;