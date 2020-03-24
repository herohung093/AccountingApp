import * as React from "react"
import { Modal, Button } from "react-bootstrap"
import styled from "styled-components"

interface modalProps {
    handleClose: () => void;
    message: string;
    title: string;
    show: boolean
}
const Div = styled.div`
    list-style: none;
    height:max-content;
    overflow: auto;
    z-index: 20;
    position: absolute;
    border-radius: 5px;`

const MessageModal: React.FC<modalProps> = ({ message, handleClose, show, title }) => {
    return (<Div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body> {message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
          </Button>
            </Modal.Footer>
        </Modal>
    </Div>)
}
export default MessageModal;