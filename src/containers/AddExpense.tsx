import * as React from "react"
import axios from "axios"
import { Col, Button, Form, Dropdown, Row, Alert, Badge } from "react-bootstrap"
import { useState, useEffect } from "react"
import MessageModal from "../components/Modal/MessageModal"
import DatePicker from "react-datepicker";
import ExpenseType from "../Types/ExpenseType"
import Expenses from "../components/Expenses"
import processHeaderClick from "../common/processHeaderClick"
import baseUrl from "../common/baseUrl"
interface expenseInputType {
    category: string;
    date: string;
    note: string;
    amount: number;
}
const initExpenseInput = {
    category: "",
    date: "",
    note: "",
    amount: 0,
}
const category = ["House Renting", "Staff wage", "Accountant", "Decoration", "Other", "Stock", "Tax", "Transportation"].sort()

const AddExpense: React.FC<{}> = props => {
    const [expenseInput, setExpenseInput] = useState<expenseInputType>(initExpenseInput);
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");
    const [dropdownLable, setDropDownLabel] = React.useState<string>(category[0])
    const [date, setDate] = useState<Date>(new Date())
    const [expensesData, setExpensesData] = useState<ExpenseType[]>([])
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    const [selectedExpense, setSelectedExpense] = useState<ExpenseType | undefined>(undefined)
    useEffect(() => {
        getExpensesData(date)
    }, [])

    const calculateStringMonth = (newDate: Date): string => {
        let month = (newDate.getMonth() + 1).toString();
        if (month.length < 2)
            month = "0" + month
        return (month + "/" + newDate.getUTCFullYear())
    }
    const getExpensesData = async (newDate: Date) => {

        await axios.get(baseUrl.base + "expense/month?month=" + calculateStringMonth(newDate))
            .then(response => {
                console.log(response.data)
                setExpensesData(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const handleProductInputChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;
        setExpenseInput({ ...expenseInput, [name]: value });

    }
    const handleSubmit = (e: any) => {
        e.preventDefault()
        let dateString = date?.toLocaleDateString();
        if (dateString.charAt(1) === '/')
            dateString = "0" + dateString
        if (dateString.charAt(4) === '/')
            dateString = dateString.substring(0, 3) + "0" + dateString.substring(3);
        console.log(dateString)
        const sentData = {
            category: dropdownLable,
            amount: expenseInput.amount,
            note: expenseInput.note,
            date: dateString
        }
        sendNewExpense(sentData)
    }
    const sendNewExpense = async (expense: expenseInputType) => {
        await axios
            .post(baseUrl.base + "expense/", expense)
            .then(response => {
                setShowMessageModal(true)
                setModalMessage("Success")
                getExpensesData(date)
            })
            .catch(error => {
                setShowMessageModal(true)
                setModalMessage(error.toString())
                console.log(error)
            })
    }
    const processInventoryHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, expensesData, setRevertOrder, setExpensesData)
    };

    const handleDeleteExpense = async (id: number) => {
        if (selectedExpense !== undefined) {
            //perform delete
            await axios
                .delete(baseUrl.base + "expense/" + id)
                .then(response => {
                    getExpensesData(date)
                    console.log("delete success for expense number: " + id)
                })
                .catch(error => console.log(error))
        }
    }
    const processSelectedItem = (item: ExpenseType) => {
        setSelectedExpense(item)
    }
    return (
        <Row style={{ height: "100vh" }}>
            <Col lg="3" md="4" sm="10" xs="12" style={{ margin: "1%" }}>
                <MessageModal
                    show={showmessageModal}
                    handleClose={() => {
                        setShowMessageModal(false)
                        setExpenseInput(initExpenseInput)
                    }} message={modalMessage} title="Add New Expense" />
                <Dropdown style={{ width: "10%" }}>
                    <Form.Label>Category</Form.Label>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {dropdownLable}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {category.map(result => {
                            return (
                                <Dropdown.Item key={result} onClick={() => {
                                    setDropDownLabel(result)
                                }}>{result}</Dropdown.Item>)
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Label>Date</Form.Label>
                <div>

                    <DatePicker placeholderText={"From date "}
                        selected={date}
                        onSelect={date => { setDate(date) }}
                        dateFormat={"dd/MM/yyyy"}
                        onChange={(value) => {
                            if (value !== null)
                                getExpensesData(value)
                        }}
                    /></div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            required={(expenseInput.amount.toString() === "0" || expenseInput.amount.toString() === "") ? true : false}
                            onChange={handleProductInputChange}
                            value={expenseInput.amount.toString()}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows="2"
                            placeholder="Description ..."
                            name="note"
                            required={dropdownLable === "Other" ? true : false}
                            onChange={handleProductInputChange}
                            value={expenseInput.note}
                        />
                    </Form.Group>
                    <Button type="submit">Submit Expense</Button>
                </Form>

            </Col>
            <Col lg="6" md="6" sm="12">

                <Alert variant="warning">Expenses for <Badge pill variant="info">{calculateStringMonth(date)}</Badge> </Alert>
                <Expenses data={expensesData} handleHeaderClick={processInventoryHeaderClick} handleSelectedItem={processSelectedItem} />
                <Button
                    style={{}}
                    variant="danger"
                    disabled={(selectedExpense === undefined)}
                    onClick={() => {
                        if (selectedExpense !== undefined)
                            handleDeleteExpense(selectedExpense?.id);
                    }}
                >Delete Expense</Button>

            </Col>
        </Row>
    )
}
export default AddExpense;