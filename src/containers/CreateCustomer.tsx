import * as React from "react"
import axios from "axios"
import { Col, Button, Form } from "react-bootstrap"
import { useState } from "react"
import MessageModal from "../components/Modal/MessageModal"

const initCustomer = {
    name: "",
    phone: "",
    address: "",
    contactPerson: "",
    note: "",
}
interface CustomerType {
    phone: string;
    address: string;
    name: string;
    contactPerson: string;
    note: string;
}
const CreateCustomer: React.FC<{}> = props => {
    const [customerForm, setCustomerForm] = useState<CustomerType>(initCustomer)
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");

    const handleFormChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;

        setCustomerForm({ ...customerForm, [name]: value });

    }
    const handleCreateCustomer = (e: any) => {
        e.preventDefault();
        let sentData = {
            name: customerForm.name,
            address: customerForm.address,
            phone: customerForm.phone,
            contactPerson: customerForm.contactPerson,
            note: customerForm.note
        }
        sendCreateProduct(sentData)
    }

    const sendCreateProduct = async (customer: CustomerType) => {
        await axios
            .post("https://stormy-ridge-84291.herokuapp.com/customer/", customer)
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
    return (<div>
        <Col lg="4" md="6" sm="10" xs="12">
            <MessageModal
                show={showmessageModal}
                handleClose={() => {
                    setShowMessageModal(false)
                    setCustomerForm(initCustomer)
                }} message={modalMessage} title="Add New Customer" />
            <Form onSubmit={handleCreateCustomer} >
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        required
                        onChange={handleFormChange}
                        value={customerForm.name}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        required
                        onChange={handleFormChange}
                        value={customerForm.address}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        required
                        onChange={handleFormChange}
                        value={customerForm.phone}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                        type="text"
                        name="contactPerson"
                        onChange={handleFormChange}
                        value={customerForm.contactPerson}
                    />
                </Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows="2"
                    placeholder="Description ..."
                    name="note"
                    onChange={handleFormChange}
                    value={customerForm.note}
                />
                <Button variant="success" type="submit" style={{ marginTop: "10px" }}>Create Customer</Button>
            </Form>
        </Col>
    </div>)
}
export default CreateCustomer;