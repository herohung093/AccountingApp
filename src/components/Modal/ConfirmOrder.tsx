import * as React from "react"
import { Modal, Button, Alert } from "react-bootstrap"
import styled from "styled-components"
import ConfirmOrderType from "../../Types/ConfirmOrderType"
import moneyFormat from "../../common/moneyFormat"
import OrderDetail, { Data } from "../OrderDetail"
interface modalProps {
    handleClose: () => void;
    show: boolean
    data: ConfirmOrderType
}
const Div = styled.div`
    list-style: none;
    height:max-content;
    overflow: auto;
    z-index: 20;
    position: absolute;
    border-radius: 5px;`
const headers = ["Product", "Quantity", "Price", "Discount", "Total Price"];

const ConfirmOrder: React.FC<modalProps> = ({ handleClose, show, data }) => {
    return (
        <Div>
            <Modal show={show} onHide={handleClose} scrollable>
                <Modal.Header closeButton style={{ justifyContent: "" }}>
                    <Modal.Title>Order has been added</Modal.Title>

                </Modal.Header>
                <div>
                    <Alert variant="success">
                        <h4>New order detail</h4>
                        <h6>Customer: {data.customer.name}</h6>
                        <h6>Order ID: {data.id}</h6>
                        <h6>Total Paid: {moneyFormat(data.paid.toString())}</h6></Alert>
                </div>
                <Modal.Body>
                    <OrderDetail data={data.orderLines as Data} loading={false} headers={headers} handleSelectedItem={() => { }} handleHeaderClick={() => { }} />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>
        </Div>
    )
}
export default ConfirmOrder;