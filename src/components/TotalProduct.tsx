import * as React from "react"
import TotalProductType from "../Types/TotalProductType"
import CustomerSoldType from "../Types/CustomerSoldType"
import CustomerSold from "./CustomerSold"
import { useEffect } from "react"
import { Table, Alert } from "react-bootstrap"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"

interface TableProps {
    rawData: TotalProductType[];

}

const TotalProduct: React.FC<TableProps> = ({ rawData }) => {


    return (
        <div style={{ marginTop: "1vh" }}>
            <Alert variant="info" style={{ paddingBottom: "0px", marginBottom: "0px" }}><h6>Group of Products</h6></Alert>
            <Table striped bordered hover size="sm"  >
                <TableHeader listOfHeader={["Product", "Quantity"]} handleClick={() => { }}></TableHeader>
                <tbody>
                    {rawData.map((item: any) => {
                        return (
                            <tr key={item.name}>
                                <td >{item.name} </td>
                                <td>{moneyFormat(item.amount)}</td>
                            </tr>)
                    })}
                </tbody>
            </Table>
        </div>
    )
}
export default TotalProduct;
