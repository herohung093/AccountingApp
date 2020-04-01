import * as React from "react";
import OrderType from "../Types/OrderType";
import OrderDetailType from "../Types/OrderDetailType"
import CustomerType from "../Types/CustomerType"
import axios from "axios";
import { useState } from "react";
import Orders from "../components/Orders";
import OrderDetail from "../components/OrderDetail"
import SearchInput from "../components/SearchInput";
import Suggestions from "../components/Suggestions"
import styled from "styled-components";
import { Row, Col, Form, Button, Badge, Alert } from "react-bootstrap"
import moneyFormat from "../common/moneyFormat"
import { Link } from "react-router-dom"
import DeleteOrder from "../components/Modal/DeleteOrder"
import MessageModal from "../components/Modal/MessageModal"
import { withRouter } from "react-router-dom"
import processHeaderClick from "../common/processHeaderClick"
import TotalProduct from "../components/TotalProduct"
import convertTotalProductData from "../common/convertTotalProductData"
const OrderList = styled.div`
  width:100%;
  max-height: 90vh;
  margin-top: 1%;
  display: block;
  position: relative;
  height: 100%;
`;

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
    const [orderDetail, setOrderDetail] = useState<OrderDetailType[]>(initOrderDetail);
    const [remainingCredit, setRemainingCredit] = useState<number>(0);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | undefined>(undefined)
    const [searchResults, setSearchResults] = useState<CustomerType[]>([])
    const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false)
    const [monthlyInvoice, setMonthlyInvoice] = useState<OrderType[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showMessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setMessageModal] = useState<string>("");
    const [modalMessageTitle, setMessageModalTitle] = useState<string>("");

    const getOrdersData = async () => {
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/order/")
            .then(response => {
                setOrders(response.data);
                setOrderLoading(false);
            })
            .catch(error => console.log(error))
    };

    const handleSearchCustomer = (value: string) => {

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
                console.log(value)
                setShowSearchSuggestions(true)
                getCustomers();
            }
        }
    };
    const processOrderHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, orders, setRevertOrder, setOrders)

    };
    const processOrderDetailHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, orderDetail, setRevertOrder, setOrderDetail)

    }
    const processItemClick = (item: OrderType) => {
        setSelectedOrder(item)
        const getOrderDetail = async () => {
            await axios
                .get<OrderDetailType[]>("https://stormy-ridge-84291.herokuapp.com/order/" + item.id.toString() + "/items")
                .then(response => {
                    setOrderDetail(response.data);


                })
                .catch(error => console.log(error))
        };
        //Add to Monthly Invoice List if double click if item is pre-selected
        if (item.id === selectedOrder?.id) {
            addOrderToInvoiceList()
        } else {
            getOrderDetail();
            setSelectedOrder(item)
        }
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
                        console.log(response.data)
                        setMessageModal(response.data)
                        setMessageModalTitle("Pay for order")
                        setShowMessageModal(true)
                        //getCustomerOrdersData(selectedCustomer.id)
                    })
                    .catch(error => console.log(error))
            }
            if (selectedOrder.paid < totalPrice) {

                if (remainingCredit > (totalPrice - selectedOrder.paid)) {
                    amount = totalPrice - selectedOrder.paid;
                    setRemainingCredit(remainingCredit - amount)
                    payForOrder();
                }
                if (remainingCredit <= (totalPrice - selectedOrder.paid)) {
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
        setSelectedOrder(undefined)
        selectedCustomer = item;
        setOrderDetail([])
        setShowSearchSuggestions(false)
        setOrderLoading(true);
        getCustomerOrdersData(item.id);
    }
    const getCustomerOrdersData = async (id: number) => {
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/order/customer/" + id)
            .then(response => {
                setOrders(response.data);
                setOrderLoading(false);

            })
            .catch(error => console.log(error))
    };
    const addOrderToInvoiceList = () => {
        if (monthlyInvoice.some(order => order.id === selectedOrder?.id)) {
            return;
        }
        let monthlyList = [...monthlyInvoice, selectedOrder as OrderType];
        setMonthlyInvoice(monthlyList)

    }
    const processDeleteModal = () => {
        if (selectedOrder !== undefined) {
            const deleteOrder = async () => {
                await axios
                    .delete("https://stormy-ridge-84291.herokuapp.com/order/" + selectedOrder.id)
                    .then(response => {
                        console.log(response.data)
                        setShowModal(false);
                        setOrders([]);
                        setOrderDetail([]);
                        setMessageModal("Order has been deledted")
                        setMessageModalTitle("Delete Order: ")
                        setShowMessageModal(true)
                        getCustomerOrdersData(selectedCustomer.id)
                    })
                    .catch(error => console.log(error))
            };
            deleteOrder();
        }
    }
    return (
        <div>
            <div style={{ margin: "0px", width: "100%" }}>
                <Row style={{ height: "50%", width: "100%" }}>
                    <Col lg="6">
                        <OrderList>
                            <div style={{ margin: "1%" }}>
                                <Row>
                                    <Col lg="6">
                                        <SearchInput
                                            holderText={"Search order by customer name ..."}
                                            handleSearchChange={handleSearchCustomer}
                                        /></Col>
                                    <Col style={{ paddingRight: "0px" }}><Button onClick={() => {
                                        setOrderLoading(true)
                                        getOrdersData();
                                    }}>All Orders</Button></Col>
                                </Row>
                                <Suggestions data={searchResults}
                                    showSuggestions={showSearchSuggestions}
                                    handleSelectedItem={processSuggestionSelect} />
                                <DeleteOrder
                                    handleClose={() => { setShowModal(false) }}
                                    handleDelete={processDeleteModal}
                                    show={showModal}
                                    message={selectedOrder as OrderType}
                                />
                                <MessageModal
                                    title={modalMessageTitle}
                                    message={modalMessage}
                                    handleClose={() => { setShowMessageModal(false) }}
                                    show={showMessageModal} />

                            </div>
                            <Orders
                                data={orders}
                                loading={orderLoading}
                                headers={orderHeaders}
                                handleHeaderClick={processOrderHeaderClick}
                                handleSelectedItem={processItemClick}
                            ></Orders>

                            <Row>
                                <Col lg="7">
                                    <Button style={{ marginLeft: "5px", marginTop: "10px", width: "80%" }}
                                        disabled={(selectedOrder === undefined)}
                                        onClick={() => { }}>Monthly Invoice List
                                <Badge pill variant="warning"
                                            style={{ marginLeft: "5px" }}>
                                            {monthlyInvoice.length}
                                        </Badge>
                                    </Button>
                                </Col>
                                <Col lg="auto">
                                    <Link to={"/updateorder/" + selectedOrder?.id} >
                                        <Button
                                            disabled={(selectedOrder === undefined)}
                                            style={{ marginTop: "10px", width: "100%" }}>Update Order</Button>
                                    </Link>

                                </Col>
                            </Row>
                            <Row>
                                <Col lg="7">
                                    <Button
                                        style={{ marginTop: "10px", marginLeft: "5px", width: "80%" }}
                                        variant="danger"
                                        disabled={(selectedOrder === undefined)}
                                        onClick={() => {
                                            setShowModal(true)
                                        }}
                                    >Delete Order</Button>
                                </Col>
                            </Row>
                        </OrderList>
                    </Col>
                    <Col lg="4" md="8" style={{ marginTop: "65px" }}>
                        <OrderDetail data={orderDetail}
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
                                        <Button variant="primary" type="submit" style={{ width: "20vh", marginBottom: "5px" }}
                                            disabled={(selectedOrder === undefined)}>Set credit</Button>
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
                                        disabled={(selectedOrder === undefined)}
                                        onClick={handlePayOrder}
                                    >Pay For Order</Button>
                                    </div>
                                </Col>
                            </Alert>
                        </Row>
                    </Col>
                    <Col lg="2" md="3" style={{ marginTop: "30px" }}>

                        <TotalProduct rawData={convertTotalProductData([], [], orderDetail)} />

                    </Col>
                </Row>
            </div >
        </div >
    );
};
export default withRouter(ProcessOrder);
