import * as React from "react"
import { Modal, Button, Alert, Form } from "react-bootstrap"
import styled from "styled-components"
import ConfirmOrderType from "../../Types/ConfirmOrderType"
import moneyFormat from "../../common/moneyFormat"
import OrderDetail, { Data } from "../OrderDetail"
import OrderType from "../../Types/OrderType"
import Orders from "../../components/Orders"
interface modalProps {
    handleClose: () => void;
    handlePrint: (month: string) => void;
    handleDelete: (order: OrderType) => void;
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

const PdfExportModal: React.FC<modalProps> = ({ handleClose, handlePrint, handleDelete, show, data }) => {
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
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="danger"
                    disabled={(selectedItem === null || data.length === 0) ? true : false}
                    onClick={() => {
                        if (selectedItem !== null)
                            handleDelete(selectedItem)
                    }}>Delete Selected Order</Button>
                <Button variant="success"
                    disabled={data.length === 0 ? true : false}
                    onClick={() => { handlePrint(monthValue) }}>Export To Pdf</Button>
            </Modal.Footer>
        </Modal>
    </Div>)
}
export default PdfExportModal;