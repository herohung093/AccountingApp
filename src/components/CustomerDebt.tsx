import * as React from "react"
import axios from "axios"
import { Table } from "react-bootstrap"
import processHeaderClick from "../common/processHeaderClick"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"
import { useState, useEffect } from "react"
import CustomerDebtType from "../Types/CustomerDebtType"
interface TableProps {
    startDate: string;
    endDate: string;
}

const headers = ["Customer", "OrderId", "Date", "Total", "Paid"]
const CustomerDebt: React.FC<TableProps> = ({ startDate, endDate }) => {
    const [data, setData] = useState<CustomerDebtType[]>([])
    const [revertOrder, setRevertOrder] = useState<boolean>(false);

    useEffect(() => {
        getData();
    }, [startDate, endDate])
    const handleHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, data, setRevertOrder, setData)
    }
    const getData = async () => {
        if (startDate.length === 9) {
            startDate = "0" + startDate
        }
        if (endDate.length === 9) {
            endDate = "0" + endDate
        }
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/dept?startDate=" + startDate + "&endDate=" + endDate)
            .then(response => {
                setData(response.data)
            })
            .catch(error => console.log(error))
    };

    return (<div style={{ overflow: "auto", height: "50vh", width: "100%" }}>
        <Table striped bordered hover size="sm" >
            <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
            <tbody>
                {data.map((item: CustomerDebtType) => {
                    if (item.total > item.paid)
                        return (
                            <tr key={item.orderId} >
                                <td >{item.customer} </td>
                                <td>{item.orderId}</td>
                                <td>{item.date}</td>
                                <td>{moneyFormat(item.total.toString())}</td>
                                <td>{moneyFormat(item.paid.toString())}</td>
                            </tr>)
                })}
            </tbody>
        </Table>
    </div>)
}
export default CustomerDebt;