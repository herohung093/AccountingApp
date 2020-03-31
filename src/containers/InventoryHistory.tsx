import * as React from "react"
import axios from "axios"
import { Row, Col, Button, Spinner, Table } from "react-bootstrap"
import TableHeader from "../components/TableHeader"
import SearchInput from "../components/SearchInput"
import { useState, useEffect } from "react"
import styled from "styled-components"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import processHeaderClick from "../common/processHeaderClick"
const StyledOrders = styled.div<{ isLoading: boolean }>`
    position: ${props => props.isLoading && 'absolute'};
    left: ${props => props.isLoading && '50%'};
    top: ${props => props.isLoading && '50%'};
    height: ${props => props.isLoading ? '100%' : '85vh'};
    overflow: auto;
`
interface InventoryHistoryType {
    product: {
        code: string;
        name: string;
        price: number;
        unit: string;
    };
    description: string;
    quantity: number;
    id: number;
    createAt: string;
    updateAt: string;
    operator: {
        name: string;
        mobilePhone: string;
        address: string;
    };
}
let initIventory = [{
    product: {
        code: "",
        name: "",
        price: 0,
        unit: "",
    },
    description: "",
    quantity: 0,
    id: 0,
    createAt: "",
    updateAt: "",
    operator: {
        name: "Mai Thi Vu",
        mobilePhone: "",
        address: "",
    }

}]
const date = new Date()
const headers = ["Product", "Quantity", "Date", "Note", "Id"]
const InventoryHistory: React.FC<{}> = props => {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<InventoryHistoryType[]>(initIventory)
    const [fromDate, setFromDate] = useState<Date>(new Date(date.getFullYear(), date.getMonth(), 1))
    const [toDate, setToDate] = useState<Date>(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    const [revertOrder, setRevertOrder] = useState<boolean>(false);

    useEffect(() => {
        handleQueryByData()
    }, [])
    const handleHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, data, setRevertOrder, setData)

    }
    const handleSearchProduct = (value: string) => {
        let filteredData = [...initIventory];
        filteredData.length = 0;
        if (value === "" || value === null) {
            setData(initIventory);
        } else if (value !== "") {
            filteredData = initIventory.filter(item => {
                if (value.includes("-")) {

                    if (item.product.code.substr(item.product.code.indexOf("-") + 1).toLowerCase().includes(value.substr(value.indexOf("-")).toLowerCase())) {
                        console.log(item.product.code.substr(item.product.code.indexOf("-") + 1).toLowerCase())
                        console.log((value.substr(value.indexOf("-") + 1).toLowerCase()))
                        return item;
                    }
                }
                return item.product.code.toLowerCase().includes(
                    value.toLowerCase()
                );

            });
            setData(filteredData);
        }
    }
    const handleQueryByData = () => {
        if (fromDate !== undefined && toDate !== undefined) {
            setLoading(true)
            loadInventoryHistoryData(fromDate?.toLocaleDateString(), toDate?.toLocaleDateString())
        }

    }
    const loadInventoryHistoryData = async (from: string, to: string) => {

        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/productinput/date/between?startDate=" + from + "&endDate=" + to)
            .then(response => {
                setData(response.data);
                initIventory.length = 0;
                initIventory = response.data;
                setLoading(false)
            })
            .catch(error => console.log(error))
    }
    return (
        <div>
            <Col>
                <Row style={{ width: "70%" }}>
                    <Col lg="3" md="4">
                        <div style={{ marginTop: "3px", width: "100%" }}>
                            <SearchInput
                                holderText={"Search product ..."}
                                handleSearchChange={handleSearchProduct}
                            />
                        </div>

                    </Col>
                    <Col lg="2" md="3">
                        <DatePicker placeholderText={"From date "}
                            selected={fromDate}
                            onSelect={date => { setFromDate(date) }}
                            dateFormat={"dd/MM/yyyy"}
                            onChange={() => { }}
                        />
                    </Col>
                    <Col lg="2" md="3">
                        <DatePicker placeholderText={"To date "}
                            selected={toDate}
                            onSelect={date => { setToDate(date) }}
                            dateFormat={"dd/MM/yyyy"}
                            onChange={() => { }} />
                    </Col>
                    <Col md="4"><Button
                        disabled={(fromDate === undefined || toDate === undefined || fromDate > toDate)}
                        style={{ marginTop: "5px", marginBottom: "5px" }} onClick={handleQueryByData}>Search by Date</Button>

                    </Col>
                </Row>
                <Row>
                    <Col lg="6">
                        <StyledOrders isLoading={loading}>
                            {loading ? <Spinner animation="grow" /> :
                                <Table striped bordered hover size="sm" >
                                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                                    <tbody>
                                        {data.map(item => {
                                            if (item.product.code !== "") {
                                                return (
                                                    <tr key={item.id} >
                                                        <td >{item.product.code} </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.createAt}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.id}</td>
                                                    </tr>)
                                            }

                                        })}
                                    </tbody>
                                </Table>}
                        </StyledOrders>
                    </Col>
                </Row>

            </Col>
        </div>
    )
}
export default InventoryHistory;