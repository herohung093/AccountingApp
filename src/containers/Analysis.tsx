import * as React from "react"
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart, Area, Bar, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react"
import axios from "axios"
import { Row, Col, Alert, Container } from "react-bootstrap";
import CustomerDebt from "../components/CustomerDebt"
import DatePicker from "react-datepicker";

interface graphType {
    month: string;
    income: number;
    customersTotal: number;
}
const currentDate = new Date()
const initFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
const initToDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
const Analysis: React.FC<{}> = props => {
    const [last12Month, setLast12Month] = useState<graphType[]>([])
    const [fromDate, setFromDate] = useState<Date>(initFromDate)
    const [toDate, setToDate] = useState<Date>(initToDate)
    let totalIncome: number[]
    let top5CustomerIncome: number[]
    const currentDate = new Date();
    let last12MonthLabels = new Array()
    useEffect(() => {
        setupMonthLabels()
        getTop5CustomerIncomeData();
        getLast12MonthData();

    }, [])

    const getLast12MonthData = async () => {
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/income/time")
            .then(response => {
                totalIncome = response.data
            })
            .catch(error => console.log(error))
    };
    const getTop5CustomerIncomeData = async () => {
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/top5customer/income")
            .then(response => {
                top5CustomerIncome = response.data
                prepareDataTotalIncome()
            })
            .catch(error => console.log(error))
    };
    const setupMonthLabels = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        console.log(currentMonth + "/" + currentYear)
        for (let i = 1; i <= 12 + currentMonth; i++) {
            let monthString = ""
            let index = i;
            if (i <= 12) {
                monthString = "" + index
            } else index = (i - 12)

            if (index < 10)
                monthString = "0" + index

            let year = currentYear;
            if (i <= 12)
                year = currentYear - 1
            last12MonthLabels[i - 1] = monthString + "/" + year


        }

    }
    const prepareDataTotalIncome = () => {
        let buff = [...last12Month]
        for (let i = 0; i <= 12 + currentDate.getMonth(); i++) {

            buff.push({ month: last12MonthLabels[i], income: totalIncome[i], customersTotal: top5CustomerIncome[i] })
        }
        setLast12Month(buff)
    }

    return (


        <Container>
            <Row>
                <Col lg="8" style={{ paddingLeft: "0%" }}>
                    <Alert variant="warning" style={{ width: "100%", marginLeft: "1%" }}>
                        <header>
                            <h2>Total income over Top 5 customers</h2>
                        </header>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart

                                data={last12Month}
                                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={tick => {
                                    return tick.toLocaleString();
                                }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#8884d8" fontWeight="bold" />
                                <Line type="monotone" dataKey="customersTotal" stroke="#d89f84" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Alert>
                </Col>
                <Col lg="5" style={{ paddingLeft: "0%" }}>
                    <Row >
                        <Alert variant="info" style={{ width: "100%", justifyContent: "center" }}>
                            <Row>                        <header>
                                <h2>Unpaid Orders</h2>
                            </header></Row>
                            <Row>
                                <Col lg="6">
                                    <DatePicker placeholderText={"From date "}
                                        selected={fromDate}
                                        onSelect={date => { setFromDate(date) }}
                                        dateFormat={"dd/MM/yyyy"}
                                        onChange={date => {
                                            if (date !== null)
                                                setFromDate(date)
                                        }}
                                    />
                                </Col>
                                <Col lg="6">
                                    <DatePicker placeholderText={"To date "}
                                        selected={toDate}
                                        onSelect={date => { setToDate(date) }}
                                        dateFormat={"dd/MM/yyyy"}
                                        onChange={date => {
                                            if (date !== null)
                                                setToDate(date)
                                        }} />
                                </Col>
                            </Row>
                        </Alert>
                    </Row>
                    <CustomerDebt startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()}>
                    </CustomerDebt>
                </Col>
            </Row>
        </Container>
    )
}
export default Analysis;