import * as React from "react"
import axios from "axios"
import { Row, Col, Button, Form, Alert, Badge } from "react-bootstrap"
import SearchInput from "../components/SearchInput"
import { useState, useEffect } from "react"
import CustomerType from "../Types/CustomerType"
import removeSpecialCharacter from "../common/handleVietnamese";
import moneyFormat from "../common/moneyFormat"
import Customer from "../components/Customer"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomerSold from "../components/CustomerSold";
import CustomerSoldType from "../Types/CustomerSoldType";
import { Link } from "react-router-dom"
let initCustomer = [{
    id: 0,
    name: "",
    phone: "",
    address: "",
    contactPerson: "",
    note: ""
}]

const customerHeaders = ["Id", "Name", "Address", "Phone"]
const Customers: React.FC<{}> = props => {
    const [customers, setCustomers] = useState<CustomerType[]>(initCustomer);
    const [customerSoldData, setCustomerSoldData] = useState<CustomerSoldType[]>([])
    const [revertCustomer, setRevertCustomer] = useState<boolean>(false);
    const [revertCustomerSold, setRevertCustomerSold] = useState<boolean>(false);
    const [customerLoading, setCustomerLoading] = useState<boolean>(true);
    const [customerSoldLoading, setCustomerSoldLoading] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | undefined>(undefined);
    const [customerDebt, setCustomerDebt] = useState<number>(0);
    //init with first day of the year
    const [fromDate, setFromDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1))
    //init with last day of the year
    const [toDate, setToDate] = useState<Date>(new Date(new Date().getFullYear(), 11, 31))
    useEffect(() => {
        const getData = async () => {
            await axios
                .get("https://stormy-ridge-84291.herokuapp.com/customer/")
                .then(response => {
                    setCustomers(response.data);
                    initCustomer.length = 0;
                    initCustomer = response.data;
                    setCustomerLoading(false)
                })
                .catch(error => console.log(error))
        };

        getData();

    }, [])
    const getCustomerSoldData = async () => {
        const to = toDate?.toLocaleDateString();
        const from = fromDate?.toLocaleDateString()
        setCustomerSoldLoading(true)
        await axios
            // eslint-disable-next-line no-useless-concat
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/" + "customersold?id=" + selectedCustomer?.id + "&startDate=" + from + "&endDate=" + to)
            .then(response => {
                setCustomerSoldData(response.data)
                setCustomerSoldLoading(false)

            })
            .catch(error => console.log(error))
    }
    const getCustomerDebt = async () => {


        await axios
            // eslint-disable-next-line no-useless-concat
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/" + "dept/" + selectedCustomer?.id)
            .then(response => {
                setCustomerDebt(response.data)
            })
            .catch(error => console.log(error))
    }
    const processCustomerHeaderClick = (value: string) => {
        let sortedData: CustomerType[]
        if (revertCustomer) {
            sortedData = [...customers].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertCustomer(false)
        } else {
            sortedData = [...customers].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertCustomer(true)
        }
        setCustomers(sortedData)
    }
    const handleSearchCustomer = (value: string) => {
        let filteredData = [...initCustomer];
        filteredData.length = 0;
        if (value === "" || value === null) {
            setCustomers(initCustomer);
        } else if (value !== "") {
            filteredData = initCustomer.filter(item => {
                return removeSpecialCharacter(item.name.toLowerCase()).includes(
                    removeSpecialCharacter(value.toLowerCase())
                );
            });
            setCustomers(filteredData);
        }
    };
    const handleSelectedCustomer = (customer: CustomerType) => {
        if (customer !== undefined) {
            setSelectedCustomer(customer)

        }
        if (selectedCustomer !== undefined) {
            getCustomerSoldData()
            getCustomerDebt()
        }


    }
    const handleDateChange = () => {
        if (fromDate === undefined || toDate === undefined || fromDate > toDate) { return; }

        getCustomerSoldData()
    }
    const processCustomerSoldHeaderClick = (value: string) => {
        let sortedData: CustomerSoldType[]
        if (revertCustomerSold) {
            sortedData = [...customerSoldData].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertCustomerSold(false)
        } else {
            sortedData = [...customerSoldData].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertCustomerSold(true)
        }
        setCustomerSoldData(sortedData)
    }
    return (<div>
        <Row >
            <Col lg="5" md="6" sm="12" style={{ margin: "2%" }}>
                <Row>
                    <div style={{ marginTop: "3px", width: "22vh", marginBottom: "0px" }}>
                        <SearchInput
                            holderText={"Search Customer ..."}
                            handleSearchChange={handleSearchCustomer}
                        />
                    </div>
                    <div style={{ margin: "3px", width: "22vh", marginBottom: "5px" }}>
                        <Link to={"/updatecustomer/" + selectedCustomer?.name}>
                            <Button
                                disabled={selectedCustomer === undefined}
                                style={{ width: "100%" }}>Update Customer</Button>
                        </Link>

                    </div>
                </Row>
                <Row>
                    <Customer data={customers}
                        tableHeight="80vh"
                        tablewidth="100%"
                        headers={customerHeaders}
                        loading={customerLoading}
                        handleHeaderClick={processCustomerHeaderClick}
                        handleSelectedItem={() => { }}
                        getSelectedCustomer={handleSelectedCustomer} />
                </Row>
            </Col>
            <Col lg="4" style={{ margin: "5px" }}>

                <Row>
                    <Alert variant="warning" style={{ marginTop: "0px", width: "100%", alignContent: "center" }}>
                        <Row>
                            <h4 style={{ marginLeft: "5%" }}>Get Customer favorite products by time</h4>
                        </Row>
                        <Row style={{ marginLeft: "3%" }}>
                            <Col>
                                <h6>From date: </h6>
                                <DatePicker placeholderText={"From date "}
                                    selected={fromDate}
                                    onSelect={date => { setFromDate(date) }}
                                    dateFormat={"dd/MM/yyyy"}
                                    onChange={handleDateChange}
                                />
                            </Col>
                            <Col>
                                <h6>To date: </h6>
                                <DatePicker placeholderText={"To date "}
                                    selected={toDate}
                                    onSelect={date => { setToDate(date) }}
                                    dateFormat={"dd/MM/yyyy"}
                                    onChange={handleDateChange} />
                            </Col>
                        </Row>

                    </Alert>
                    <CustomerSold
                        data={customerSoldData}
                        loading={customerSoldLoading}
                        headers={["Product", "Quantity"]}
                        handleHeaderClick={processCustomerSoldHeaderClick}
                        tablewidth="100%"
                        tableHeight="69vh"
                    >

                    </CustomerSold>
                </Row>
            </Col>
            <Col style={{ margin: "5px" }}>
                <Alert variant="info"><h5>
                    <div>Customer debt: </div>
                    <Badge pill variant="warning">{moneyFormat(customerDebt.toString())}</Badge></h5>
                </Alert>
            </Col>
        </Row>

    </div>)
}
export default Customers;