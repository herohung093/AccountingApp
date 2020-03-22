import * as React from "react";
import OrderType from "../Types/OrderType";
import OrderDetailType from "../Types/OrderDetailType"
import CustomerType from "../Types/CustomerType"
import axios from "axios";
import { useEffect, useState } from "react";
import Orders from "../components/Orders";
import OrderDetail from "../components/OrderDetail"
import SearchInput from "../components/SearchInput";
import Suggestions from "../components/Suggestions"
import styled from "styled-components";

import removeSpecialCharacter from "../common/handleVietnamese";
import { Container, Row, Col, Form, Button, Badge, Alert } from "react-bootstrap"
import moneyFormat from "../common/moneyFormat"
const OrderList = styled.div`
  width:100%;
  max-height: 90vh;
  margin-top: 1%;
  overflow: auto;
  display: block;
  position: relative;
  height: 100%;
`;
let initOrder = [
    {
        id: 0,
        customer: "",
        createAt: "",
        updateAt: "",
        paid: 0,
        note: "",
        installment: false,
        staff: ""
    }
];
let initOrderDetail = [{
    product: {
        code: "",
        name: "",
        price: 0,
        unit: "",
    },
    quantity: 0,
    price: 0,
    discount: 0,
    totalPrice: 0,
    id: 0,
    order: "string"
}];
const orderHeaders = ["Id", "Customer", "Create At", "Paid", "Note"];
const orderDetailheaders = ["Product", "Quantity", "Price", "Discount", "Total Price"];
let selectedCustomer: CustomerType;
const ProcessOrder: React.FC<{}> = props => {
    const formRef = React.useRef<HTMLInputElement>()
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [orderLoading, setOrderLoading] = useState<boolean>(false);
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    const [orderDetail, setOrderDetail] = useState<OrderDetailType[]>([]);
    const [remainingCredit, setRemainingCredit] = useState<number>(0);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | undefined>(undefined)
    const [searchResults, setSearchResults] = useState<CustomerType[]>([])
    const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false)
    // useEffect(() => {

    //     getOrdersData();
    // }, []);
    // const getOrdersData = async () => {
    //     await axios
    //         .get("https://stormy-ridge-84291.herokuapp.com/order/")
    //         .then(response => {
    //             setOrders(response.data);
    //             setOrderLoading(false);
    //             initOrder.length = 0;
    //             initOrder = response.data;
    //         })
    //         .catch(error => console.log(error))
    // };

    const handleSearchCustomer = (value: string) => {
        // let filteredData = [...initOrder];
        // filteredData.length = 0;
        // if (value === "" || value === null) {
        //     setOrders(initOrder);
        // } else if (value !== "") {
        //     filteredData = initOrder.filter(item => {
        //         return removeSpecialCharacter(item.customer.toLowerCase()).includes(
        //             removeSpecialCharacter(value.toLowerCase())
        //         );
        //     });
        //     setOrders(filteredData);
        // }
        const getCustomers = async () => {
            await axios
                .get<CustomerType[]>("https://stormy-ridge-84291.herokuapp.com/customer/all/?namePatten=" + value)
                .then(response => {
                    setSearchResults(response.data)
                })
                .catch(error => console.log(error))
        };
        if (value.length > 1) {
            if (value.length % 2 === 0) {
                setShowSearchSuggestions(true)
                getCustomers();
            }
        }

    };
    const processOrderHeaderClick = (value: string) => {
        let sortedData: OrderType[]
        if (revertOrder) {
            sortedData = [...orders].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(false)
        } else {
            sortedData = [...orders].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(true)
        }
        setOrders(sortedData)
    };
    const processOrderDetailHeaderClick = (value: string) => {
        let sortedData: OrderDetailType[]
        if (revertOrder) {
            sortedData = [...orderDetail].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(false)
        } else {
            sortedData = [...orderDetail].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(true)
        }
        setOrderDetail(sortedData)
    }
    const processItemClick = (item: OrderType) => {
        const getOrderDetail = async () => {
            await axios
                .get<OrderDetailType[]>("https://stormy-ridge-84291.herokuapp.com/order/" + item.id.toString() + "/items")
                .then(response => {
                    initOrderDetail.length = 0;
                    initOrderDetail = response.data;
                    setOrderDetail([])
                    setOrderDetail(response.data);
                })
                .catch(error => console.log(error))
        };
        getOrderDetail();
        setSelectedOrder(item)
    }
    const handleSetCredit = (e: React.FormEvent) => {
        e.preventDefault()

        const element = formRef.current;
        if (element) {

            setRemainingCredit(Number(element.value))
        }

    }

    const handlePayOrder = () => {

        if (selectedOrder !== undefined) {
            let amount = 0;
            const totalPrice = calculateTotalPrice()
            const payForOrder = async () => {
                await axios.put("https://stormy-ridge-84291.herokuapp.com/order/amount/?id=" + selectedOrder.id + "&amount=" + amount)
                    .then(response => {

                        processSuggestionSelect(selectedCustomer);
                    })
                    .catch(error => console.log(error))
            }

            if (selectedOrder.paid < totalPrice) {
                if (remainingCredit > (totalPrice - selectedOrder.paid)) {
                    amount = totalPrice - selectedOrder.paid;
                    setRemainingCredit(remainingCredit - amount)
                    payForOrder();
                }
                if (remainingCredit < (totalPrice - selectedOrder.paid)) {
                    amount = remainingCredit;
                    setRemainingCredit(0)
                    payForOrder();
                }
            }


        }

    }
    function calculateTotalPrice(): number {
        let price = 0;
        orderDetail.forEach(item => {
            price = price + item.totalPrice
        })
        return price
    }
    const processSuggestionSelect = (item: CustomerType) => {
        selectedCustomer = item;
        setOrderDetail([])
        setShowSearchSuggestions(false)
        setOrderLoading(true);
        const getCustomerOrdersData = async () => {
            await axios
                .get("https://stormy-ridge-84291.herokuapp.com/order/customer/" + item.id)
                .then(response => {
                    setOrders(response.data);
                    setOrderLoading(false);
                    initOrder.length = 0;
                    initOrder = response.data;
                })
                .catch(error => console.log(error))
        };
        getCustomerOrdersData();
    }

    return (
        <div>

            <Container style={{ margin: "0px" }}>
                <Row style={{ height: "50%" }}>
                    <Col>
                        <OrderList>
                            <div style={{ margin: "1%" }}>
                                <SearchInput
                                    holderText={"Search order by customer name ..."}
                                    handleSearchChange={handleSearchCustomer}
                                />
                                <Suggestions data={searchResults} showSuggestions={showSearchSuggestions} handleSelectedItem={processSuggestionSelect} />
                            </div>
                            <Orders
                                data={orders}
                                loading={orderLoading}
                                headers={orderHeaders}
                                handleHeaderClick={processOrderHeaderClick}
                                handleSelectedItem={processItemClick}
                            ></Orders>
                        </OrderList>
                    </Col>
                    <Col style={{ marginTop: "65px" }}><OrderDetail data={orderDetail}
                        headers={orderDetailheaders}
                        loading={false}
                        handleSelectedItem={() => { }}
                        handleHeaderClick={processOrderDetailHeaderClick}></OrderDetail>
                        <Row style={{ marginLeft: "2px" }}>

                            <Alert variant="success" style={{ width: "25vh", marginTop: "10px" }}>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <Form onSubmit={handleSetCredit}>
                                        <Form.Group>
                                            <Form.Label>Total amount received</Form.Label>
                                            <Form.Control
                                                type="number"
                                                required
                                                ref={formRef as any}
                                                style={{ width: "20vh" }}
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" style={{ width: "20vh", marginBottom: "5px" }} className={(Number(formRef.current?.value) === 0) ? "disabled" : "active"}>Set credit</Button>
                                    </Form>
                                </Col>
                                <Col style={{ paddingLeft: "0px" }}>
                                    <div>Remaining credit: <Badge pill variant="success"
                                        style={{ fontSize: "85%", marginBottom: "5px" }}>
                                        {moneyFormat(remainingCredit.toString())}
                                    </Badge>
                                    </div>
                                    <div><Button variant="primary"
                                        style={{ width: "20vh", marginBottom: "5px", }}
                                        className={(selectedOrder === undefined) ? "disabled" : "active"}
                                        onClick={handlePayOrder}
                                    >Pay For Order</Button>
                                    </div>
                                </Col>
                            </Alert>
                        </Row>
                    </Col>

                </Row>
            </Container >

        </div >
    );
};
export default ProcessOrder;
