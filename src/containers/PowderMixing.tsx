import * as React from "react"
import { Row, Col, Button, Form, Dropdown, Alert } from "react-bootstrap"
import { relative } from "path"
import axios from "axios"
import MessageModal from "../components/Modal/MessageModal"
import Inventory from "../components/Inventory"
import { useState, useEffect } from "react"
import InventoryType from "../Types/InventoryType"
import processHeaderClick from "../common/processHeaderClick"
import baseUrl from "../common/baseUrl"

interface PowderType {
    NN1: number;
    NN2S: number;
    NN0: number;
    NN3ST: number;
    NTC1: number;
    NTC2S: number;
    NTC0: number;
    NTC3ST: number;
    NTCA1: number;
    NTCA2: number;
    NTCA3: number;
}
const initPowder: PowderType = {
    NN1: 0,
    NN2S: 0,
    NN0: 0,
    NN3ST: 0,
    NTC1: 0,
    NTC2S: 0,
    NTC0: 0,
    NTC3ST: 0,
    NTCA1: 0,
    NTCA2: 0,
    NTCA3: 0,
}
const selectedStyled = {
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    padding: ".75rem 1.25rem",
    marginBottom: "1rem",
    border: "1px solid transparent",
    borderRadius: ".25rem",
    position: relative,
}
const notSelectedStyled = {
    color: "#383d41",
    backgroundColor: "#e2e3e5",
    borderColor: "#d6d8db",
    padding: ".75rem 1.25rem",
    marginBottom: "1rem",
    border: "1px solid transparent",
    borderRadius: ".25rem",
    position: relative,
}
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

const inventoryHeaders = ["Product", "Stock"]
const resultPowder = ["NN-64M", "NN-37M", "NN-10M", "NTC-64M", "NTC-37M", "NTC-10M"]
const PowderMixing: React.FC<{}> = props => {
    const [powderInput, setPowderInput] = React.useState<PowderType>(initPowder)
    const [nnStyle, setNnStyle] = React.useState<any>(selectedStyled)
    const [ntcStyle, setNTCnStyle] = React.useState<any>(notSelectedStyled)
    const [dropdownLable, setDropDownLabel] = React.useState<string>(resultPowder[0])
    const [showmessageModal, setShowMessageModal] = React.useState<boolean>(false)
    const [modalMessage, setModalMessage] = React.useState<string>("");
    const [disableMixButton, setDissableMixButton] = React.useState<boolean>(false)
    const [inventory, setInventory] = useState<InventoryType[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState<boolean>(true);
    const [revertOrder, setRevertOrder] = useState<boolean>(false);
    useEffect(() => {

        loadInventoryData();
    }, []);
    const loadInventoryData = async () => {
        await axios
            .get(baseUrl.base + "inventory/")
            .then(response => {
                setInventory(response.data);
                initIventory.length = 0;
                initIventory = response.data;
                setInventoryLoading(false)
                let filteredData = [...initIventory];
                filteredData.length = 0;
                filteredData = initIventory.filter(item => {
                    if (item.code.includes("NN-") || item.code.includes("NTC-"))
                        return item;

                });
                setInventory(filteredData);
            })
            .catch(error => console.log(error))
    }
    const processInventoryHeaderClick = (value: string) => {
        processHeaderClick(value, revertOrder, inventory, setRevertOrder, setInventory)

    };
    const handlePowderInputChange = (e: any) => {
        let value = e.target.value;
        let name = e.target.name;
        setPowderInput({ ...powderInput, [name]: value })
        checkDisableButton()
    }
    const handleSelectedFinalPowder = (finalPowder: string) => {
        setDropDownLabel(finalPowder)
        if (finalPowder === "NN-64M" || finalPowder === "NN-37M" || finalPowder === "NN-10M") {
            setNnStyle(selectedStyled)
            setNTCnStyle(notSelectedStyled)
            //setPowderInput({...powderInput, "NN1": 0})
            checkDisableButton();
        } else {
            setNTCnStyle(selectedStyled)
            setNnStyle(notSelectedStyled)
        }

    }
    const checkDisableButton = () => {
        // if (dropdownLable === "NN-64M" || dropdownLable === "NN-37M" || dropdownLable === "NN-10M") {
        //     if (powderInput.NN0 === 0 && powderInput.NN1 === 0 && powderInput.NN2S === 0 && powderInput.NN3ST === 0) {
        //         setDissableMixButton(false)

        //     } else setDissableMixButton(true)
        // } else {
        //     if (powderInput.NTC0 === 0
        //         && powderInput.NTC1 === 0
        //         && powderInput.NTC2S === 0
        //         && powderInput.NTC3ST === 0
        //         && powderInput.NTCA1 === 0
        //         && powderInput.NTCA2 === 0
        //         && powderInput.NTCA3 === 0) {
        //         setDissableMixButton(true)

        //     } else setDissableMixButton(true)
        // }
    }
    const handleMixPowder = () => {
        if (dropdownLable === "NN-64M" || dropdownLable === "NN-37M" || dropdownLable === "NN-10M") {
            mixNN()
        } else {
            mixNTC()
        }
        loadInventoryData();
    }
    const mixNN = () => {
        let total = 0;

        if (powderInput.NN0 !== 0) {
            total = total + Number(powderInput.NN0)
            //networkcall
            const sentData = {
                product: {
                    code: "NN-0",
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: "Making " + dropdownLable,
                quantity: Number(powderInput.NN0),
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendDecreaseStock(sentData)
        }
        if (powderInput.NN1 !== 0) {
            total = total + Number(powderInput.NN1)
            //networkcall
            const sentData = {
                product: {
                    code: "NN-1",
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: "Making " + dropdownLable,
                quantity: Number(powderInput.NN1),
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendDecreaseStock(sentData)
        }
        if (powderInput.NN2S !== 0) {
            total += Number(powderInput.NN2S)
            //networkcall
            const sentData = {
                product: {
                    code: "NN-2S",
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: "Making " + dropdownLable,
                quantity: Number(powderInput.NN2S),
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendDecreaseStock(sentData)
        }
        if (powderInput.NN3ST !== 0) {
            total += Number(powderInput.NN3ST)
            const sentData = {
                product: {
                    code: "NN-3ST",
                    name: "",
                    price: 0,
                    unit: ""
                },
                description: "Making " + dropdownLable,
                quantity: Number(powderInput.NN3ST),
                operator: {
                    name: "Mai Thi Vu",
                    mobilePhone: "",
                    address: "",
                }
            }
            sendDecreaseStock(sentData)
        }
        // send increase stock for final profuct

        const sentData = {
            product: {
                code: dropdownLable,
                name: "",
                price: 0,
                unit: ""
            },
            description: "Mix " + dropdownLable,
            quantity: total,
            operator: {
                name: "Mai Thi Vu",
                mobilePhone: "",
                address: "",
            }
        }
        sendIncreaseStock(sentData)
        console.log(sentData)
    }
    const mixNTC = () => {
        let total = 0;
        const inputPowders = [{ name: "NTC-1", value: powderInput.NTC1 },
        { name: "NTC-2S", value: powderInput.NTC2S },
        { name: "NTC-0", value: powderInput.NTC0 },
        { name: "NTC-3ST", value: powderInput.NTC3ST },
        { name: "NTC-A1", value: initPowder.NTCA1 },
        { name: "NTC-A2", value: powderInput.NTCA2 },
        { name: "NTC-A3", value: powderInput.NTCA3 }]
        inputPowders.forEach(item => {
            if (item.value !== 0) {
                total = total + Number(item.value)
                const sentData = {
                    product: {
                        code: item.name,
                        name: "",
                        price: 0,
                        unit: ""
                    },
                    description: "Making " + dropdownLable,
                    quantity: Number(item.value),
                    operator: {
                        name: "Mai Thi Vu",
                        mobilePhone: "",
                        address: "",
                    }
                }

                sendDecreaseStock(sentData)
            }
        })
        const sentData = {
            product: {
                code: dropdownLable,
                name: "",
                price: 0,
                unit: ""
            },
            description: "Making " + dropdownLable,
            quantity: total,
            operator: {
                name: "Mai Thi Vu",
                mobilePhone: "",
                address: "",
            }
        }
        sendIncreaseStock(sentData)
    }
    const sendIncreaseStock = async (productInput: any) => {
        await axios
            .put(baseUrl.base + "productinput/increase", productInput)
            .then(response => {
                setShowMessageModal(true)
                setModalMessage(response.data.toString())
                setPowderInput(initPowder)
            })
            .catch(error => {
                console.log(error)
            });

    };
    const sendDecreaseStock = async (productInput: any) => {
        await axios
            .put(baseUrl.base + "productinput/decrease", productInput)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log(error)
            });

    };

    return (
        <div>
            <MessageModal show={showmessageModal} handleClose={() => { setShowMessageModal(false) }} message={modalMessage} title="Mixing Powder" />
            <Row>
                <Col lg="3">
                    <Alert>
                        <div style={nnStyle}>
                            <Form onSubmit={handlePowderInputChange}>
                                <Form.Group>
                                    <Form.Label>NN-1</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NN-64M") && (dropdownLable.toString() !== "NN-37M") && (dropdownLable.toString() !== "NN-10M") ? true : false}
                                        type="number"
                                        name="NN1"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NN1.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NN-2S</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NN-64M") && (dropdownLable.toString() !== "NN-37M") && (dropdownLable.toString() !== "NN-10M") ? true : false}
                                        type="number"
                                        name="NN2S"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NN2S.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NN-0</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NN-64M") && (dropdownLable.toString() !== "NN-37M") && (dropdownLable.toString() !== "NN-10M") ? true : false}
                                        type="number"
                                        name="NN0"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NN0.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NN-3ST</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NN-64M") && (dropdownLable.toString() !== "NN-37M") && (dropdownLable.toString() !== "NN-10M") ? true : false}
                                        type="number"
                                        name="NN3ST"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NN3ST.toString()}
                                    />
                                </Form.Group>
                            </Form>
                        </div>

                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {dropdownLable}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {resultPowder.map(result => {
                                    return (
                                        <Dropdown.Item key={result} onClick={() => {
                                            handleSelectedFinalPowder(result)
                                        }}>{result}</Dropdown.Item>)

                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            disabled={disableMixButton}
                            style={{ marginTop: "10px", marginBottom: "5px", width: "100%" }}
                            variant="warning"
                            onClick={handleMixPowder}>Mix Powder</Button>
                    </Alert>
                </Col>
                <Col lg="3">
                    <Alert>
                        <div style={ntcStyle}>
                            <Form onSubmit={handlePowderInputChange}>
                                <Form.Group>
                                    <Form.Label>NTC-1</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTC1"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTC1.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-2S</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTC2S"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTC2S.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-0</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTC0"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTC0.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-3ST</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTC3ST"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTC3ST.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-A1</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTCA1"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTCA1.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-A2</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTCA2"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTCA2.toString()}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>NTC-A3</Form.Label>
                                    <Form.Control
                                        disabled={(dropdownLable.toString() !== "NTC-64M") && (dropdownLable.toString() !== "NTC-37M") && (dropdownLable.toString() !== "NTC-10M") ? true : false}
                                        type="number"
                                        name="NTCA3"
                                        onChange={handlePowderInputChange}
                                        value={powderInput.NTCA3.toString()}
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                    </Alert>
                </Col>
                <Col lg="3">
                    <Inventory data={inventory}
                        loading={inventoryLoading}
                        headers={inventoryHeaders}
                        handleHeaderClick={processInventoryHeaderClick}
                        handleSelectedItem={() => { }}
                        tableHeight="80vh"></Inventory>
                </Col>
            </Row>
        </div>
    );
}
export default PowderMixing;