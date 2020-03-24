import * as React from "react"
import { Modal, Button } from "react-bootstrap"
import styled from "styled-components"
import OrderType from "../../Types/OrderType"
interface modalProps {
    handleDelete: () => void;
    handleClose: () => void;
    message: OrderType;
    show: boolean
}
const Div = styled.div`
    list-style: none;
    height:max-content;
    overflow: auto;
    z-index: 20;
    position: absolute;
    border-radius: 5px;`

const DeleteOrder: React.FC<modalProps> = ({ message, handleDelete, handleClose, show }) => {
    return (<Div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Order</Modal.Title>
            </Modal.Header>
            {message ? <div><Modal.Body> Are you sure you want to delete order {message.id}.</Modal.Body>
                <Modal.Body>From {message.customer}.</Modal.Body>
            </div> : <></>}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
          </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
          </Button>
            </Modal.Footer>
        </Modal>
    </Div>)
}
export default DeleteOrder;