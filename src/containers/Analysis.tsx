import * as React from "react"
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import { Row, Col, Alert } from "react-bootstrap";
import CustomerDebt from "../components/CustomerDebt"
import DatePicker from "react-datepicker";
import BestSellers from "../components/BestSellers";
import BestsellerType from "../Types/BestSellerType";
import moneyFormat from "../common/moneyFormat";
import TopCustomerType from "../Types/TopCustomerType";
import TopCustomer from "../components/TopCustomer";
import processHeaderClick from "../common/processHeaderClick"
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
    const [bestSellers, setBestSellers] = useState<BestsellerType[]>([])
    const [topCustomer, setTopCustomer] = useState<TopCustomerType[]>([])
    const [revertTopCustomer, setRevertTopCustomer] = useState<boolean>(false);

    const currentDate = new Date();
    let last12MonthLabels = new Array()

    useEffect(() => {

        const getTop5customerIncomeDataTask = getTop5CustomerIncomeData();
        const getLast12MonthDataTask = getLast12MonthData();
        getBestSellersData()
        getTopCustomerData()
        setupMonthLabels()
        Promise.all<AxiosResponse<number[]>, AxiosResponse<number[]>>([getLast12MonthDataTask, getTop5customerIncomeDataTask])
            .then((data) => {

                prepareDataTotalIncome({ last12MonthData: data[0].data, top5CustomerIncomeData: data[1].data })
            })
    }, [])

    const getLast12MonthData = (): Promise<AxiosResponse<number[]>> => {
        return axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/income/time")
    };

    const getTop5CustomerIncomeData = (): Promise<AxiosResponse<number[]>> => {
        return axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/top5customer/income")

    };

    const setupMonthLabels = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
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
    const prepareDataTotalIncome = (params: { last12MonthData: number[], top5CustomerIncomeData: number[] }) => {
        const { last12MonthData, top5CustomerIncomeData } = params;
        let buff = [...last12Month]
        for (let i = 0; i <= 12 + currentDate.getMonth(); i++) {
            if (last12MonthData[0] !== undefined && top5CustomerIncomeData[0] !== undefined)
                buff.push({ month: last12MonthLabels[i], income: last12MonthData[i], customersTotal: top5CustomerIncomeData[i] })
        }
        setLast12Month(buff)
    }
    const getBestSellersData = async () => {
        let to = toDate?.toLocaleDateString();
        let from = fromDate?.toLocaleDateString();
        if (to.length === 9) {
            to = "0" + to
        }
        if (from.length === 9) {
            from = "0" + from
        }
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/bestseller?startDate=" + from + "&endDate=" + to)
            .then(response => {
                setBestSellers(response.data)
            })
            .catch(error => console.log(error))
    }

    const getTopCustomerData = async () => {
        let to = toDate?.toLocaleDateString();
        let from = fromDate?.toLocaleDateString();
        if (to.length === 9) {
            to = "0" + to
        }
        if (from.length === 9) {
            from = "0" + from
        }
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/analysis/topcustomer?startDate=" + from + "&endDate=" + to)
            .then(response => {
                setTopCustomer(response.data)
            })
            .catch(error => console.log(error))
    }

    const processTopCustomerHeaderClick = (value: string) => {
        processHeaderClick(value, revertTopCustomer, topCustomer, setRevertTopCustomer, setTopCustomer)
    };
    return (
        <div>
            <Row>
                <Col lg="6" style={{ marginLeft: "1%" }}>
                    <Row>
                        <Alert variant="warning" style={{ width: "100%", marginLeft: "1%" }}>
                            <header>
                                <h2>Total income over Top 5 customers</h2>
                            </header>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart
                                    data={last12Month}
                                    margin={{ top: 5, left: 60, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={tick => {
                                        return tick.toLocaleString();
                                    }} />
                                    <Tooltip formatter={function (value, name) {
                                        return `${moneyFormat(value.toString())}`;
                                    }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#8884d8" fontWeight="bold" />
                                    <Line type="monotone" dataKey="customersTotal" stroke="#d89f84" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Alert>
                    </Row>
                    <Row>
                        <BestSellers data={bestSellers} startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()} ></BestSellers>
                    </Row>
                </Col>
                <Col lg="5" style={{ marginLeft: "2%" }}>
                    <Row >
                        <Alert variant="info" style={{ width: "100%", justifyContent: "center" }}>
                            <Row>                        <header>
                                <h5 style={{ paddingLeft: "20px" }}>Unpaid Orders</h5>
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
                    <Row>
                        <CustomerDebt startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()} />
                    </Row>
                    <Row><TopCustomer rawData={topCustomer} startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()} headerClick={processTopCustomerHeaderClick} /></Row>

                </Col>
            </Row>

        </div>
    )
}
export default Analysis;