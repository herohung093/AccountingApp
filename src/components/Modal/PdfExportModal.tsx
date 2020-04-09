import * as React from "react"
import { Modal, Button, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import OrderType from "../../Types/OrderType"
import Orders from "../../components/Orders"
interface modalProps {
    handleClose: () => void;
    handlePrint: (month: string) => void;
    handleDelete: (order: OrderType) => void;
    handleClearList: () => void;
    show: boolean;
    data: OrderType[]
}
const Div = styled.div`
    list-style: none;
    height:max-content;
    overflow: auto;
    z-index: 20;
    position: absolute;
    border-radius: 5px;`

const orderHeaders = ["Id", "Customer", "Create At", "Paid", "Note"];

const buttonStyle = {
    marginLeft: "1%",
    marginRight: "1%",
    width: "30%"
}

const PdfExportModal: React.FC<modalProps> = ({ handleClose, handlePrint, handleDelete, handleClearList, show, data }) => {
    const [selectedItem, setSelectedItem] = React.useState<OrderType | null>(null);
    const [monthValue, setMonthValue] = React.useState<string>("");
    const handleFormChange = (e: any) => {
        e.preventDefault();
        setMonthValue(e.target.value)

    }

    return (<Div>
        <Modal show={show} onHide={handleClose} scrollable>
            <Modal.Header closeButton style={{ justifyContent: "" }}>
                <Modal.Title>Export Order</Modal.Title>
            </Modal.Header>
            <div style={{ margin: "3%", width: "35%", marginBottom: "0px" }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Month of the Invoice"
                        name="monthInput"
                        onChange={handleFormChange}
                        value={monthValue}
                    />
                </Form.Group>
            </div>
            <Modal.Body>
                <Orders
                    data={data}
                    loading={false}
                    headers={orderHeaders}
                    handleHeaderClick={() => { }}
                    handleSelectedItem={(item: OrderType) => { setSelectedItem(item) }}
                ></Orders>
            </Modal.Body>
            <Modal.Footer>
                <Row style={{ width: "100%" }}>
                    <Button variant="success"
                        disabled={data.length === 0 ? true : false}
                        onClick={() => { handlePrint(monthValue) }}
                        style={{ width: "100%" }}
                    >Export To Pdf</Button>
                </Row>

                <Row style={{ width: "100%" }}>
                    <Button variant="secondary" onClick={handleClose} style={buttonStyle}>Close</Button>
                    <Button variant="warning" style={buttonStyle} onClick={handleClearList} disabled={data.length === 0 ? true : false}>Clear List</Button>
                    <Button variant="danger"
                        disabled={(selectedItem === null || data.length === 0) ? true : false}
                        style={buttonStyle}
                        onClick={() => {
                            if (selectedItem !== null)
                                handleDelete(selectedItem)
                        }}>Remove Order</Button>
                </Row>


            </Modal.Footer>
        </Modal>
    </Div>)
}
export default PdfExportModal;