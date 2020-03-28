import * as React from "react"
import TableHeader from "./TableHeader"
import { Table, Alert, Row, Col } from "react-bootstrap"

import BestsellerType from "../Types/BestSellerType"
import moneyFormat from "../common/moneyFormat"
import TotalProduct from "./TotalProduct"
import convertTotalProductData from "../common/convertTotalProductData"

interface TableProps {
    data: BestsellerType[];
    startDate: string;
    endDate: string;
}
const bestSellerHeaders = ["Product", "Amount"]
const BestSellers: React.FC<TableProps> = ({ data, startDate, endDate }) => {
    let style = {
        height: "40vh",
        overflow: "auto",
        marginTop: "50px"
    }
    return (
        <div>
            <Alert variant="success">BestSeller products from {startDate} to {endDate}</Alert>
            <Row>
                <Col>
                    <div style={style}>
                        <Table striped bordered hover size="sm"  >
                            <TableHeader listOfHeader={bestSellerHeaders} handleClick={() => { }}></TableHeader>
                            <tbody >
                                {data.map(item => {
                                    return (
                                        <tr key={item.productCode} >
                                            <td >{item.productCode} </td>
                                            <td >{moneyFormat(item.totalSold.toString())} </td>
                                        </tr>)
                                })}
                            </tbody>
                        </Table>

                    </div>
                </Col>
                <Col>
                    <TotalProduct rawData={convertTotalProductData([], [], [], [], data)}></TotalProduct>
                </Col>
            </Row>

        </div>
    );
}
export default BestSellers;