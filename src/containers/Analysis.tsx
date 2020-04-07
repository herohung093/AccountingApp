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
import baseUrl from "../common/baseUrl"
interface graphType {
    month: string;
    income: number;
    expense: number;
    revenue: number;
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
        const getLast12MonthExpenseDataTask = getLast12MonthExpenseData();
        getBestSellersData(fromDate, toDate)
        getTopCustomerData(fromDate, toDate)
        setupMonthLabels()
        Promise.all<AxiosResponse<number[]>, AxiosResponse<number[]>, AxiosResponse<number[]>>([getLast12MonthDataTask, getTop5customerIncomeDataTask, getLast12MonthExpenseDataTask])
            .then((data) => {
                let revenue = calculateRevenue(data[0].data, data[2].data)
                prepareDataTotalIncome({ last12MonthData: data[0].data, top5CustomerIncomeData: data[1].data, last12MonthExpenseData: data[2].data, laste12MonthRevenue: revenue })
            })
    }, [])

    const calculateRevenue = (income: number[], expenses: number[]): number[] => {
        let revenue = new Array()
        for (let i = 0; i < last12MonthLabels.length; i++) {
            revenue.push(income[i] - expenses[i])
        }
        return revenue
    }

    const getLast12MonthData = (): Promise<AxiosResponse<number[]>> => {
        return axios
            .get(baseUrl.base + "analysis/income/time")
    };

    const getTop5CustomerIncomeData = (): Promise<AxiosResponse<number[]>> => {
        return axios
            .get(baseUrl.base + "analysis/top5customer/income")

    };

    const getLast12MonthExpenseData = (): Promise<AxiosResponse<number[]>> => {
        return axios
            .get(baseUrl.base + "expense/time")
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
    const prepareDataTotalIncome = (params: { last12MonthData: number[], top5CustomerIncomeData: number[], last12MonthExpenseData: number[], laste12MonthRevenue: number[] }) => {
        const { last12MonthData, last12MonthExpenseData, top5CustomerIncomeData, laste12MonthRevenue } = params;
        let buff = [...last12Month]
        for (let i = 0; i <= 12 + currentDate.getMonth(); i++) {
            if (last12MonthData[0] !== undefined && top5CustomerIncomeData[0] !== undefined && last12MonthExpenseData[0] !== undefined)
                buff.push({ month: last12MonthLabels[i], income: last12MonthData[i], expense: last12MonthExpenseData[i], revenue: laste12MonthRevenue[i], customersTotal: top5CustomerIncomeData[i] })
        }
        setLast12Month(buff)
    }
    const getBestSellersData = async (fromDate: Date, toDate: Date) => {
        let to = toDate?.toLocaleDateString();
        let from = fromDate?.toLocaleDateString();

        await axios
            .get(baseUrl.base + "analysis/bestseller?startDate=" + from + "&endDate=" + to)
            .then(response => {
                setBestSellers(response.data)
            })
            .catch(error => console.log(error))
    }

    const getTopCustomerData = async (fromDate: Date, toDate: Date) => {
        let to = toDate?.toLocaleDateString();
        let from = fromDate?.toLocaleDateString();

        await axios
            .get(baseUrl.base + "analysis/topcustomer?startDate=" + from + "&endDate=" + to)
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
                                <h2>Total income, revenue over Top 5 customers</h2>
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
                                    <Line type="monotone" dataKey="expense" stroke="#c92ade" fontWeight="bold" />
                                    <Line type="monotone" dataKey="revenue" stroke="#eb4034" fontWeight="bold" />
                                    <Line type="monotone" dataKey="customersTotal" stroke="#d89f84" fontWeight="bold" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Alert>
                    </Row>
                    <Row style={{ marginLeft: "5%" }}>
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
                                            if (date !== null) {
                                                setFromDate(date)
                                                getBestSellersData(date, toDate)
                                                getTopCustomerData(date, toDate)
                                            }

                                        }}
                                    />
                                </Col>
                                <Col lg="6">
                                    <DatePicker placeholderText={"To date "}
                                        selected={toDate}
                                        onSelect={date => { setToDate(date) }}
                                        dateFormat={"dd/MM/yyyy"}
                                        onChange={date => {
                                            if (date !== null) {
                                                setToDate(date)
                                                getBestSellersData(fromDate, date);
                                                getTopCustomerData(fromDate, date);
                                            }

                                        }} />
                                </Col>
                            </Row>
                        </Alert>
                    </Row>
                    <Row>
                        <CustomerDebt startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()} />
                    </Row>
                    <Row>
                        <TopCustomer rawData={topCustomer} startDate={fromDate.toLocaleDateString()} endDate={toDate.toLocaleDateString()} headerClick={processTopCustomerHeaderClick} />
                    </Row>
                </Col>
            </Row>

        </div>
    )
}
export default Analysis;