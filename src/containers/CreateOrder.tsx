import * as React from "react"
import { useState, useEffect } from "react"
import InventoryType from "../Types/InventoryType"
import CustomerType from "../Types/CustomerType"
import OrderLineType from "../Types/OrderLineType"
import OrderDetail, { Data } from "../components/OrderDetail"
import Inventory from "../components/Inventory"
import Customer from "../components/Customer"
import SearchInput from "../components/SearchInput";
import { Container, Row, Col, Button, Form, Alert, Card } from "react-bootstrap";
import removeSpecialCharacter from "../common/handleVietnamese";
import { withRouter, RouteComponentProps } from "react-router-dom"
import OrderType from "../Types/OrderType"
import axios from "axios"
import OrderDetailType from "../Types/OrderDetailType"
import ConfirmOrder from "../components/Modal/ConfirmOrder"
import ConfirmOrderType from "../Types/ConfirmOrderType"
import processHeaderClick from "../common/processHeaderClick"
import MessageModal from "../components/Modal/MessageModal"
let initCustomer = [{
    id: 0,
    name: "",
    phone: "",
    address: "",
    contactPerson: "",
    note: ""
}]
let initIventory = [{
    code: "",
    stock: 0,
    product: {
        code: "",
        name: "",
        price: 0,
        unit: "",
    }
}]
const initAddingItem = {
    quantity: "",
    price: "",
    discount: "0",
}
const initOrderNote = {
    paid: 0,
    note: ""
}
const initOrderLine = [{
    product: {
        code: "",
        name: "",
        price: 0,
        unit: ""
    },
    quantity: 0,
    price: 0,
    discount: 0,
    totalPrice: 0,
    id: 0,
}];

interface AddingItemType {
    quantity: number | string;
    price: number | string;
    discount: number | string;
}
interface OrderNoteType {
    paid: string | number;
    note: string;
}
let routeParameter: routeParam;
let orderLineId = 1;

type routeParam = { id: number; }
let errorMessage = ""
const inventoryHeaders = ["Product", "Stock"]
const customerHeaders = ["Name"]
const orderLineHeaders = ["Product", "Quantity", "Price", "Discount", "Total Price"]
const CreateOrder: React.FC<RouteComponentProps> = props => {
    const [inventory, setInventory] = useState<InventoryType[]>([]);
    const [customers, setCustomers] = useState<CustomerType[]>(initCustomer);
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    const [revertCustomer, setRevertCustomer] = useState<boolean>(false);
    const [inventoryLoading, setInventoryLoading] = useState<boolean>(true);
    const [customerLoading, setCustomerLoading] = useState<boolean>(true);
    const [orderItems, setOrderItems] = useState<OrderLineType[]>(initOrderLine);
    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryType | undefined>(undefined);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState<string>("");
    const [itemExist, setItemExist] = useState<boolean>(false)
    const [stringInputs, setStringInputs] = useState<AddingItemType>(initAddingItem);
    const [orderNoteInputs, setOrderNoteInputs] = useState<OrderNoteType>(initOrderNote)
    const [isCreateSuccess, setCreateSuccess] = useState<boolean | undefined>(undefined)
    const [updateOrderNumber, setUpdateOrderNumber] = useState<number>(-1)
    const [updateOrder, setUpdateOrder] = useState<OrderType | undefined>(undefined);
    const [confirmOrderData, setConfirmOrderData] = useState<ConfirmOrderType | undefined>(undefined)
    const [showConfirmOrder, setShowConfirmOrder] = useState<boolean>(false)
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");
    useEffect(() => {


        if (Object.getOwnPropertyNames(props.match.params).length !== 0) {
            routeParameter = props.match.params as routeParam
            setUpdateOrderNumber(routeParameter.id)
            getUpdateOrderDetai(routeParameter.id)
            setOrderNoteInputs(initOrderNote);
        }

        const getCustomerData = async () => {
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
        loadInventoryData();
        getCustomerData();
    }, []);
    const loadInventoryData = async () => {
        await axios
            .get("https://stormy-ridge-84291.herokuapp.com/inventory/")
            .then(response => {
                setInventory(response.data);
                initIventory.length = 0;
                initIventory = response.data;
                setInventoryLoading(false)
            })
            .catch(error => console.log(error))
    }
    const getUpdateOrderDetai = (id: number) => {
        const getOrder = async () => {
            await axios
                .get<OrderType>("https://stormy-ridge-84291.herokuapp.com/order/" + id)
                .then(response => {
                    setUpdateOrder(response.data);
                    initOrderNote.paid = response.data.paid
                    initOrderNote.note = response.data.note;
                    setOrderNoteInputs(initOrderNote)
                })
                .catch(error => console.log(error))
        };

        const getOrderDetail = async () => {
            await axios
                .get<OrderDetailType[]>("https://stormy-ridge-84291.herokuapp.com/order/" + id + "/items")
                .then(response => {
                    setOrderItems([...response.data, initOrderLine[0]]);
                    // initOrderLine.length = 0;
                    // initOrderLine = response.data;
                })
                .catch(error => console.log(error))
        };
        getOrder()
        getOrderDetail();
    }
    const handleSearchProduct = (value: string) => {
        let filteredData = [...initIventory];
        filteredData.length = 0;
        if (value === "" || value === null) {
            setInventory(initIventory);
        } else if (value !== "") {
            filteredData = initIventory.filter(item => {
                if (value.includes("-")) {

                    if (item.code.substr(item.code.indexOf("-") + 1).toLowerCase().includes(value.substr(value.indexOf("-")).toLowerCase())) {
                        console.log(item.code.substr(item.code.indexOf("-") + 1).toLowerCase())
                        console.log((value.substr(value.indexOf("-") + 1).toLowerCase()))
                        return item;
                    }
                }
                return item.code.toLowerCase().includes(
                    value.toLowerCase()
                );

            });
            setInventory(filteredData);
        }
    };
    const processInventoryHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, inventory, setRevertOrder, setInventory)

    };
    const processCustomerHeaderClick = (value: string) => {
        processHeaderClick(value, revertCustomer, customers, setRevertCustomer, setCustomers)

    }
    const processOrderDetailHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, orderItems, setRevertOrder, setOrderItems)

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
        setSelectedCustomer(customer.name)
    }
    const handleSelectedIventory = (item: InventoryType) => {
        setSelectedInventoryItem(item)
    }
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();

        const totalPrice = (Number(stringInputs.price) * Number(stringInputs.quantity)) * (100 - Number(stringInputs.discount)) / 100
        if (selectedInventoryItem !== undefined) {
            if (selectedInventoryItem.stock < Number(stringInputs.quantity)) {
                setShowMessageModal(true)
                setModalMessage("Not enough stock !!!")
                return;
            }
            orderItems.forEach(item => {
                if (item.product.code + item.quantity + item.price === selectedInventoryItem.code + stringInputs.quantity + stringInputs.price) {
                    setItemExist(true);

                } else {
                    setOrderItems([...orderItems, {
                        product: { code: selectedInventoryItem.code, name: "", price: 0, unit: "" },
                        quantity: Number(stringInputs.quantity),
                        price: Number(stringInputs.price),
                        discount: Number(stringInputs.discount),
                        totalPrice: totalPrice,
                        id: ++orderLineId
                    }])
                    setItemExist(false)
                }

            })
        }

    }
    const handleAddItemFormChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;

        const regexp = /^[0-9\b]+$/;
        if (value === "" || regexp.test(value.substring(value.length - 1))) {
            setStringInputs({ ...stringInputs, [name]: value });
        }
    };
    const handleDeleteItem = () => {
        setOrderItems(orderItems.filter(item => {
            return item.product.code + item.quantity + item.price !== selectedDeleteItem
        }))
        setSelectedDeleteItem("")
    }
    const handleOrderNoteForm = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;

        setOrderNoteInputs({ ...orderNoteInputs, [name]: value });

    }
    const handleCreateOrder = () => {
        interface OrderLine {
            product: {
                code: string;
                name: string;
                price: number;
                unit: string;
            };
            quantity: number;
            price: number;
            discount: number;
        }

        let sentOrderLines = orderItems.map(item => {
            const value =
            {
                product: { code: item.product.code, name: "", price: 0, unit: "" },
                quantity: Number(item.quantity),
                price: Number(item.price),
                discount: Number(item.discount),
                id: ++orderLineId

            }

            return value;
        })
        let sentData = (sentOrderLines.filter(item => {
            return item.product.code !== ""
        }))
        let newOrder: any;
        if (Object.getOwnPropertyNames(props.match.params).length !== 0) {
            newOrder = { customer: selectedCustomer, staff: "Mai Thi Vu", orderLines: sentData, paid: orderNoteInputs.paid, note: orderNoteInputs.note, installment: false, id: updateOrder?.id }
            sendUpdateOrderData(newOrder)
            console.log(sentData)
        } else {
            newOrder = { customer: selectedCustomer, staff: "Mai Thi Vu", orderLines: sentData, paid: orderNoteInputs.paid, note: orderNoteInputs.note, installment: false }
            sendNewOrderData(newOrder);

        }

    }
    const sendNewOrderData = async (order: any) => {
        await axios
            .post("https://stormy-ridge-84291.herokuapp.com/order/", order)
            .then(response => {
                if (response.status === 200) {
                    setConfirmOrderData(response.data)
                    setShowConfirmOrder(true)
                    setCreateSuccess(true)
                    loadInventoryData();
                } else setCreateSuccess(false)
            })
            .catch(error => errorMessage = error)

    };
    const sendUpdateOrderData = async (order: any) => {
        await axios
            .put("https://stormy-ridge-84291.herokuapp.com/order/", order)
            .then(response => {
                if (response.status === 200) {
                    setConfirmOrderData(response.data)
                    console.log(response.data)
                    setShowConfirmOrder(true)
                    setCreateSuccess(true)
                    loadInventoryData();
                } else setCreateSuccess(false)
            })
            .catch(error => errorMessage = error.toString())

    };
    const processServerResponse = () => {
        if (isCreateSuccess === undefined)
            return <></>
        if (isCreateSuccess === false) {
            return <Alert variant="danger" style={{ width: "20vh", marginTop: "5px" }}>{errorMessage}</Alert>
        }
    }
    const handleUpdateOrder = () => {
        handleCreateOrder()
    }
    const handleCloseCondfirmModal = () => {
        setShowConfirmOrder(false);
        setOrderNoteInputs(initOrderNote)
        setSelectedInventoryItem(undefined)
        setOrderItems(initOrderLine)

    }
    // const updateInventoryAfterAdd=(productCode : string)=>{
    //     setInventory( inventory.map((productCode, item)=>{
    //         return item;
    //     }))
    // }
    return (
        <Container style={{ margin: "1vh" }}>
            {(showConfirmOrder && (confirmOrderData !== undefined)) ? <ConfirmOrder data={confirmOrderData} show={true} handleClose={handleCloseCondfirmModal} /> : ""}
            <MessageModal
                show={showmessageModal}
                handleClose={() => {
                    setShowMessageModal(false)
                }} message={modalMessage} title="Error when add product to order" />
            <Row >
                <Col xl={3} sm={4} md={2}>
                    <Row>
                        <div style={{ marginTop: "3px", width: "22vh" }}>
                            <SearchInput
                                holderText={"Search product ..."}
                                handleSearchChange={handleSearchProduct}
                            />
                        </div>
                    </Row>
                    <Row >
                        <Inventory data={inventory}
                            loading={inventoryLoading}
                            headers={inventoryHeaders}
                            handleHeaderClick={processInventoryHeaderClick}
                            handleSelectedItem={handleSelectedIventory}
                            tableHeight="50vh"></Inventory>
                    </Row>
                    {updateOrderNumber !== -1 ?
                        "" : <> <Row>
                            <div style={{ marginTop: "3px", width: "22vh", marginBottom: "0px" }}>
                                <SearchInput
                                    holderText={"Search Customer ..."}
                                    handleSearchChange={handleSearchCustomer}
                                />
                            </div>
                        </Row>
                            <Row>
                                <Customer data={customers}
                                    headers={customerHeaders}
                                    loading={customerLoading}
                                    tableHeight="30vh"
                                    tablewidth="22vh"
                                    handleHeaderClick={processCustomerHeaderClick}
                                    handleSelectedItem={() => { }}
                                    getSelectedCustomer={handleSelectedCustomer} />
                            </Row> </>}
                </Col>
                <Col xl={2} sm={2} md={2}>
                    <Form onSubmit={handleAddItem}
                        style={{ width: "20vh", alignContent: "left" }}>
                        <Form.Group>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                placeholder="0"
                                required
                                onChange={handleAddItemFormChange}
                                value={stringInputs.quantity.toString()}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                required
                                placeholder="0"
                                onChange={handleAddItemFormChange}
                                value={stringInputs.price.toString()}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Discount</Form.Label>
                            <Form.Control
                                type="number"
                                name="discount"
                                placeholder="0"
                                required
                                onChange={handleAddItemFormChange}
                                value={stringInputs.discount.toString()}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit"
                            style={{ width: "20vh", marginBottom: "5px" }}
                            disabled={selectedInventoryItem === undefined}>Add to Order
                            </Button>
                        {itemExist ? <Alert variant="danger">Product has been added before</Alert> : <></>}
                    </Form>
                    <Button variant="danger"
                        style={{ width: "20vh", marginBottom: "5px" }}
                        onClick={handleDeleteItem}
                        disabled={(selectedDeleteItem === "")}>Delete Item
                        </Button>

                </Col>
                <Col xl={{ span: 6, offset: 1 }} sm={2} md={{ span: 6, offset: 2 }}>
                    {updateOrderNumber !== -1 ?
                        <Alert style={{ alignContent: "center" }} variant="secondary">
                            <Card.Title>Customer: {updateOrder?.customer}</Card.Title>
                            <Card.Text>Id: {updateOrder?.id}</Card.Text>
                        </Alert>
                        : ""}

                    <OrderDetail data={orderItems as Data}
                        loading={false}
                        headers={orderLineHeaders}
                        handleSelectedItem={(product: string) => { setSelectedDeleteItem(product) }}
                        handleHeaderClick={processOrderDetailHeaderClick}></OrderDetail>
                    <div>
                        <Form onSubmit={handleAddItem}
                            style={{ width: "20vh", alignContent: "left" }}>
                            <Form.Group>
                                <Form.Label>Paid</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="paid"
                                    placeholder="0"
                                    required
                                    onChange={handleOrderNoteForm}
                                    value={orderNoteInputs.paid.toString()}
                                />
                            </Form.Group>
                            <Form.Control
                                as="textarea"
                                rows="2"
                                placeholder="Note ..."
                                name="note"
                                onChange={handleOrderNoteForm}
                                value={orderNoteInputs.note}
                            />
                        </Form>
                        {(Object.getOwnPropertyNames(props.match.params).length === 0) ? <Button style={{ width: "20vh", marginTop: "5px" }}
                            disabled={(orderItems.length === 0)
                                || (orderItems.length <= 1)
                                || (selectedCustomer === "")}
                            onClick={handleCreateOrder}
                        >Create Order</Button> : <Button style={{ width: "20vh", marginTop: "5px" }} onClick={handleUpdateOrder}>Update Order</Button>}

                        {processServerResponse()}
                    </div>
                </Col>
            </Row>
        </Container >


    );
}
export default withRouter(CreateOrder);