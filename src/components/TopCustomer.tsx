import * as React from "react"
import TopCustomerType from "../Types/TopCustomerType"
import { Table, Alert } from "react-bootstrap"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"

interface TableProps {
    rawData: TopCustomerType[];
    startDate: string;
    endDate: string;
    headerClick: (value: string) => void;
}

const TotalProduct: React.FC<TableProps> = ({ rawData, startDate, endDate, headerClick }) => {
    let style = {
        height: "35vh",
        overflow: "auto",
        marginTop: "50px",
        width: "100%"
    }

    return (
        <div style={style}>
            <Alert variant="info" style={{ paddingBottom: "0px", marginBottom: "0px", width: "100%" }}>
                <h6>Top Customer</h6>
                <div>from {startDate} to {endDate}</div>
            </Alert>
            <Table striped bordered hover size="sm"  >
                <TableHeader listOfHeader={["Customer", "Total Transaction"]} handleClick={headerClick}></TableHeader>
                <tbody>
                    {rawData.map((item: any) => {
                        return (
                            <tr key={item.customerName}>
                                <td >{item.customerName} </td>
                                <td>{moneyFormat(item.totalPaid)}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
        </div>
    )
}
export default TotalProduct;
