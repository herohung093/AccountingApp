import * as React from "react"
import ProfuctQuantityType from "../Types/ProductQuantityType"
import { Alert, Col, Row, Table } from "react-bootstrap"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"
interface TableProps {
    data: ProfuctQuantityType[];
    headerClick: (value: string) => void;
}
const headers = ["Product", "Quantity", "Customer", "Order"]
let style = {
    height: "40vh",
    overflow: "auto",
    marginTop: "50px"
}
const ProductQuantity: React.FC<TableProps> = ({ data, headerClick }) => {

    return (<div>
        <Row>
            <Col>
                <div style={style}>
                    <Table striped bordered hover size="sm"  >
                        <TableHeader listOfHeader={headers} handleClick={headerClick}></TableHeader>
                        <tbody >
                            {data.map(item => {
                                return (
                                    <tr key={item.productCode + item.orderId + item.quantity} >
                                        <td >{item.productCode} </td>
                                        <td >{moneyFormat(item.quantity.toString())} </td>
                                        <td >{item.customer} </td>
                                        <td >{item.orderId} </td>
                                    </tr>)
                            })}
                        </tbody>
                    </Table>

                </div>
            </Col>
        </Row>
    </div>)
}
export default ProductQuantity;