import * as React from "react"
import axios from "axios"
import { Row, Col, Button, Form, Alert } from "react-bootstrap"
import SearchInput from "../components/SearchInput"
import Inventory from "../components/Inventory"
import { useState, useEffect } from "react"
import InventoryType from "../Types/InventoryType"
import MessageModal from "../components/Modal/MessageModal"
import processHeaderClick from "../common/processHeaderClick"
import TotalProduct from "../components/TotalProduct"
import convertTotalProductData from "../common/convertTotalProductData"
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
const initInventoryInputs = {
    stock: "0",
    description: "",
    code: "",
}
interface InventoryInputType {
    stock: number | string;
    description: string;
    code: string;
}
const inventoryHeaders = ["Product", "Stock"]
const ProcessInventory: React.FC<{}> = props => {
    const [inventory, setInventory] = useState<InventoryType[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState<boolean>(true);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryType | undefined>(undefined);
    const [inventoryInputs, setInventoryInputs] = useState<InventoryInputType>(initInventoryInputs)
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");
    useEffect(() => {

        loadInventoryData();
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
    const handleSelectedIventory = (item: InventoryType) => {
        setSelectedInventoryItem(item)
        setInventoryInputs({ ...inventoryInputs, "code": item.code })
        setInventoryInputs({ ...inventoryInputs, "stock": item.stock })

    }
    const handleInventoryInputChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;

        setInventoryInputs({ ...inventoryInputs, [name]: value });
    }
    const handleIncreaseStock = () => {
        if (selectedInventoryItem !== undefined) {
            let sentData = {
                product: {
                    code: selectedInventoryItem.code,
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: inventoryInputs.description.trim(),
                quantity: inventoryInputs.stock,
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendIncreaseStock(sentData)
        }

    }
    const sendIncreaseStock = async (productInput: any) => {
        await axios
            .put("https://stormy-ridge-84291.herokuapp.com/productinput/increase", productInput)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    setShowMessageModal(true)
                    setModalMessage(response.data)
                    loadInventoryData();
                }
            })
            .catch(error => {
                setShowMessageModal(true)
                setModalMessage(error)
                console.log(error)

            });

    };
    const handleResetStock = () => {
        if (selectedInventoryItem !== undefined) {
            let sentData = {
                product: {
                    code: selectedInventoryItem.code,
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: inventoryInputs.description.trim(),
                quantity: inventoryInputs.stock,
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendSetStock(sentData)
        }
    }
    const sendSetStock = async (productInput: any) => {
        await axios
            .put("https://stormy-ridge-84291.herokuapp.com/productinput/", productInput)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    setShowMessageModal(true)
                    setModalMessage(response.data)
                    loadInventoryData();
                }
            })
            .catch(error => {
                setShowMessageModal(true)
                setModalMessage(error)
                console.log(error)

            });

    };
    return (
        <div style={{ marginLeft: "10px" }}>
            <Row>
                <div style={{ marginLeft: "15px", width: "22vh" }}>
                    <SearchInput
                        holderText={"Search product ..."}
                        handleSearchChange={handleSearchProduct}
                    />
                </div>

            </Row>
            <MessageModal
                show={showmessageModal}
                handleClose={() => { setShowMessageModal(false) }}
                message={modalMessage}
                title={"Update Stock"} />
            <Row>
                <Col lg="4">
                    <Inventory data={inventory}
                        loading={inventoryLoading}
                        headers={inventoryHeaders}
                        handleHeaderClick={processInventoryHeaderClick}
                        handleSelectedItem={handleSelectedIventory}
                        tableHeight="80vh"></Inventory>
                </Col>
                <Col style={{ marginLeft: "0px" }}>
                    <Row style={{ marginLeft: "10px" }}>


                        <Form onSubmit={(e: React.FormEvent) => { e.preventDefault() }}
                            style={{ width: "20vh", alignContent: "left" }}>
                            <Alert variant="primary" style={{ height: "min-content", marginTop: "55px" }}>
                                {selectedInventoryItem !== undefined ? selectedInventoryItem.code : ""}
                            </Alert>
                            <Form.Group>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="stock"
                                    required
                                    onChange={handleInventoryInputChange}
                                    value={inventoryInputs.stock.toString()}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    as="textarea"
                                    rows="2"
                                    placeholder="Description ..."
                                    required
                                    name="description"
                                    onChange={handleInventoryInputChange}
                                    value={inventoryInputs.description}
                                />
                            </Form.Group>
                        </Form>
                    </Row>
                    <Row style={{ marginTop: " 10px", marginLeft: "10px" }}>
                        <Button variant="warning" style={{ width: "20vh" }}
                            onClick={handleIncreaseStock}
                            disabled={selectedInventoryItem === undefined}>Increase Stock
                            </Button>
                    </Row>
                    <Row style={{ marginTop: " 10px", marginLeft: "10px" }}>
                        <Button variant="danger" style={{ width: "20vh" }}
                            onClick={handleResetStock}
                            disabled={selectedInventoryItem === undefined}>Reset Stock</Button>
                    </Row>
                </Col>
                <Col>
                    <TotalProduct rawData={convertTotalProductData([], [], [], inventory)} />
                </Col>
            </Row>
        </div>
    )
}
export default ProcessInventory