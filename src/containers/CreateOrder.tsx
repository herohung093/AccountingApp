import * as React from "react"
import { useState, useEffect } from "react"
import InventoryType from "../Types/InventoryType"
import CustomerType from "../Types/CustomerType"
import OrderLineType from "../Types/OrderLineType"
import OrderDetail, { Data } from "../components/OrderDetail"
import Inventory from "../components/Inventory"
import Customer from "../components/Customer"
import SearchInput from "../components/SearchInput";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import removeSpecialCharacter from "../common/handleVietnamese";
import axios from "axios"
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
let initOrderLine = [{
    product: {
        code: "",
        name: "",
        price: 0,
        unit: ""
    },
    quantity: 0,
    price: 0,
    discount: 0,
    totalPrice: 0
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
let errorMessage = ""
const inventoryHeaders = ["Product", "Stock"]
const customerHeaders = ["Name"]
const orderLineHeaders = ["Product", "Quantity", "Price", "Discount", "Total Price"]
const CreateOrder: React.FC<{}> = props => {
    const [inventory, setInventory] = useState<InventoryType[]>(initIventory);
    const [customers, setCustomers] = useState<CustomerType[]>(initCustomer);
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    const [revertCustomer, setRevertCustomer] = useState<boolean>(false);
    const [inventoryLoading, setInventoryLoading] = useState<boolean>(true);
    const [customerLoading, setCustomerLoading] = useState<boolean>(true);
    const [orderItems, setOrderItems] = useState<OrderLineType[]>(initOrderLine);
    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | undefined>(undefined);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState<string>("");
    const [itemExist, setItemExist] = useState<boolean>(false)
    const [stringInputs, setStringInputs] = useState<AddingItemType>(initAddingItem);
    const [orderNoteInputs, setOrderNoteInputs] = useState<OrderNoteType>(initOrderNote)
    const [isCreateSuccess, setCreateSuccess] = useState<boolean | undefined>(undefined)
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
        loadInventoryData();
        getData();
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
        let sortedData: InventoryType[]
        if (revertOrder) {
            sortedData = [...inventory].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(false)
        } else {
            sortedData = [...inventory].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(true)
        }
        setInventory(sortedData)
    };
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
    const processOrderDetailHeaderClick = (value: string) => {
        let sortedData: OrderLineType[]
        if (revertOrder) {
            sortedData = [...orderItems].sort((a, b) => (Reflect.get(a, value) > Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(false)
        } else {
            sortedData = [...orderItems].sort((a, b) => (Reflect.get(a, value) < Reflect.get(b, value)) ? 1 : -1)
            setRevertOrder(true)
        }
        setOrderItems(sortedData)
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
    const handleSelectedCustomer = (customer: string) => {
        setSelectedCustomer(customer)
    }
    const handleSelectedIventory = (code: string) => {
        setSelectedInventoryItem(code)
    }
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const totalPrice = (Number(stringInputs.price) * Number(stringInputs.quantity)) * (100 - Number(stringInputs.discount)) / 100
        if (selectedInventoryItem !== undefined) {
            orderItems.forEach(item => {
                if (item.product.code + item.quantity + item.price === selectedInventoryItem + stringInputs.quantity + stringInputs.price) {
                    setItemExist(true);

                } else {
                    setOrderItems([...orderItems, {
                        product: { code: selectedInventoryItem, name: "", price: 0, unit: "" },
                        quantity: Number(stringInputs.quantity),
                        price: Number(stringInputs.price),
                        discount: Number(stringInputs.discount),
                        totalPrice: totalPrice
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
            const value: OrderLine =
            {
                product: { code: item.product.code, name: "", price: 0, unit: "" },
                quantity: Number(stringInputs.quantity),
                price: Number(stringInputs.price),
                discount: Number(stringInputs.discount),

            }
            return value;
        })
        let sentData = (sentOrderLines.filter(item => {
            return item.product.code !== ""
        }))
        let newOrder = { customer: selectedCustomer, staff: "Mai Thi Vu", orderLines: sentData, paid: orderNoteInputs.paid, note: orderNoteInputs.note, installment: false }

        const sendData = async () => {
            await axios
                .post("https://stormy-ridge-84291.herokuapp.com/order/", newOrder)
                .then(response => {
                    if (response.status === 200) {
                        setCreateSuccess(true)
                        loadInventoryData();
                    } else setCreateSuccess(false)
                })
                .catch(error => errorMessage = error)

        };
        sendData();
    }

    const processServerResponse = () => {
        if (isCreateSuccess) {
            return <Alert variant="success" style={{ width: "20vh", marginTop: "5px" }}>Order has been created</Alert>
        }
        if (isCreateSuccess === undefined)
            return <></>
        if (isCreateSuccess === false) {
            return <Alert variant="danger" style={{ width: "20vh", marginTop: "5px" }}>{errorMessage}</Alert>
        }
    }

    return (
        <Container style={{ margin: "1vh" }}>
            <Row >
                <Col xl={2} sm={4} md={2}>
                    <Row>
                        <div style={{ marginTop: "3px", width: "22vh" }}>
                            <SearchInput
                                holderText={"Search product ..."}
                                handleSearchChange={handleSearchProduct}
                            />
                        </div>
                    </Row>
                    <Row>
                        <Inventory data={inventory}
                            loading={inventoryLoading}
                            headers={inventoryHeaders}
                            handleHeaderClick={processInventoryHeaderClick}
                            handleSelectedItem={handleSelectedIventory}></Inventory>
                    </Row>
                    <Row>
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
                            handleHeaderClick={processCustomerHeaderClick}
                            handleSelectedItem={() => { }}
                            getSelectedCustomerName={handleSelectedCustomer} />
                    </Row>
                </Col>
                <Col xl={3} sm={2} md={2}>
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
                        <Button variant="primary" type="submit" style={{ width: "20vh", marginBottom: "5px" }} className={(selectedInventoryItem === undefined) ? "disabled" : "active"}>Add to Order</Button>
                        {itemExist ? <Alert variant="danger">Product has been added before</Alert> : <></>}
                    </Form>
                    <Button variant="danger" style={{ width: "20vh", marginBottom: "5px" }} onClick={handleDeleteItem} className={(selectedDeleteItem === "") ? "disabled" : "active"}>Delete Item</Button>

                </Col>
                <Col xl={{ span: 6, offset: 1 }} sm={2} md={{ span: 6, offset: 2 }}>
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
                        <Button style={{ width: "20vh", marginTop: "5px" }}
                            className={(orderItems[0].product.code === "")
                                && (orderItems.length === 1)
                                || (selectedCustomer === "") ? "disabled" : ""}
                            onClick={handleCreateOrder}
                        >Create Order</Button>
                        {processServerResponse()}
                    </div>
                </Col>
            </Row>
        </Container >


    );
}
export default CreateOrder;