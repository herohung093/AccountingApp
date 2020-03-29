import * as React from "react"
import axios from "axios"
import { Col, Button, Form } from "react-bootstrap"
import { useState, useEffect } from "react"
import MessageModal from "../components/Modal/MessageModal"
import { withRouter, RouteComponentProps } from "react-router-dom"
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
interface CustomerResponseType {
    phone: string;
    address: string;
    name: string;
    contactPerson: string;
    note: string;
    id: number;
}
let routeParameter: routeParam;
let customerId = 0;
type routeParam = { name: string; }
const CreateCustomer: React.FC<RouteComponentProps> = props => {
    const [customerForm, setCustomerForm] = useState<CustomerType>(initCustomer)
    const [showmessageModal, setShowMessageModal] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("");
    const [updateCustomer, setUpdateCustomer] = useState<CustomerType | undefined>(initCustomer)

    useEffect(() => {
        if (props.match.path.includes("createcustomer")) {
            setCustomerForm(initCustomer)
            return;
        }
        if (Object.getOwnPropertyNames(props.match.params).length !== 0) {
            routeParameter = props.match.params as routeParam
            getCustomer(routeParameter.name);
        }
    }, [updateCustomer])


    const getCustomer = async (name: string) => {
        await axios
            .get<CustomerResponseType>("https://stormy-ridge-84291.herokuapp.com/customer/" + name)
            .then(response => {

                setUpdateCustomer(response.data);
                setCustomerForm(response.data)
            })
            .catch(error => console.log(error))
    };

    const handleUpdateCustomer = async () => {
        if (Object.getOwnPropertyNames(props.match.params).length !== 0) {
            routeParameter = props.match.params as routeParam
            const sentData = {
                name: customerForm.name,
                phone: customerForm.phone,
                address: customerForm.address,
                contactPerson: customerForm.contactPerson,
                note: customerForm.note,
                id: customerId,
            }
            await axios
                .put("https://stormy-ridge-84291.herokuapp.com/customer/", sentData)
                .then(response => {
                    setShowMessageModal(true)
                    setModalMessage(response.data.toString())
                })
                .catch(error => {
                    setShowMessageModal(true)
                    setModalMessage(error.toString())
                    console.log(error)
                })
        }
    }

    const handleFormChange = (e: any) => {
        let name = e.target.name;
        let value = e.target.value;
        setCustomerForm({ ...customerForm, [name]: value });
    }

    const handlesubmit = (e: any) => {
        e.preventDefault();
        if ((Object.getOwnPropertyNames(props.match.params).length === 0)) {
            let sentData = {
                name: customerForm.name,
                address: customerForm.address,
                phone: customerForm.phone,
                contactPerson: customerForm.contactPerson,
                note: customerForm.note
            }
            sendNewCustomer(sentData)
        } else {
            handleUpdateCustomer()
        }
    }

    const sendNewCustomer = async (customer: CustomerType) => {
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
            <Form onSubmit={handlesubmit} >
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
                {(Object.getOwnPropertyNames(props.match.params).length === 0) ? <Button
                    variant="success"
                    type="submit"
                    style={{ marginTop: "10px" }}>Create Customer</Button> :
                    <Button variant="success"
                        type="submit"
                        style={{ marginTop: "10px" }}>Update Order</Button>}
            </Form>
        </Col>
    </div>)
}
export default withRouter(CreateCustomer);