import * as React from "react"
import axios from "axios"
import { Col, Button, Form } from "react-bootstrap"
import { useState } from "react"
import MessageModal from "../components/Modal/MessageModal"
interface productInPutType {
    code: string;
    name: string;
    stock: number | string;
    description: string;
}
const initProductInput = {
    code: "",
    name: "",
    stock: "",
    description: "New Product"
}
const CreateProduct: React.FC<{}> = props => {
    const [productInput, setProductInput] = useState<productInPutType>(initProductInput)
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");

    const handleProductInputChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;

        setProductInput({ ...productInput, [name]: value });

    }

    const handleAddNewProduct = (e: any) => {
        e.preventDefault()
        let sentData = {
            product: {
                code: productInput.code,
                name: productInput.name,
                price: 0,
                unit: ""
            },
            description: productInput.description.trim(),
            quantity: productInput.stock,
            operator: {
                name: "Mai Thi Vu",
                mobilePhone: "",
                address: "",
            }
        }
        sendCreateProduct(sentData)
    }

    const sendCreateProduct = async (productInput: any) => {
        await axios
            .post("https://stormy-ridge-84291.herokuapp.com/products/", productInput)
            .then(response => {
                setShowMessageModal(true)
                setModalMessage(response.data)
            })
            .catch(error => {
                setShowMessageModal(true)
                setModalMessage(error.toString())
                console.log(error)

            })
    }
    return (
        <div style={{ height: "100vh" }}>
            <Col lg="4" md="6" sm="10" xs="12">
                <MessageModal
                    show={showmessageModal}
                    handleClose={() => {
                        setShowMessageModal(false)
                        setProductInput(initProductInput)
                    }} message={modalMessage} title="Add New Product" />
                <Form onSubmit={handleAddNewProduct} >
                    <Form.Group>
                        <Form.Label>Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="code"
                            required
                            onChange={handleProductInputChange}
                            value={productInput.code}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            onChange={handleProductInputChange}
                            value={productInput.name}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            required
                            onChange={handleProductInputChange}
                            value={productInput.stock.toString()}
                        />
                    </Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows="2"
                        placeholder="Description ..."
                        name="description"
                        onChange={handleProductInputChange}
                        value={productInput.description}
                    />
                    <Button variant="success" type="submit" style={{ marginTop: "10px" }}>Add new product</Button>
                </Form>
            </Col>
        </div>
    )
}
export default CreateProduct