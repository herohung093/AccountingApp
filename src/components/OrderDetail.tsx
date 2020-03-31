import * as React from "react"
import OrderDetailType from "../Types/OrderDetailType"
import OrderLineType from "../Types/OrderLineType"
import { Table, Spinner, Alert, Badge } from "react-bootstrap"
import TableHeader from "./TableHeader"
import moneyFormat from "../common/moneyFormat"

export type Data = Array<OrderDetailType & { id: number, order: string }>

interface TableProps {
    data: Data
    loading: boolean;
    headers: string[];
    handleSelectedItem: (value: string, code: string) => void;
    handleHeaderClick: (value: string) => void;

}
type DetailOrLine = OrderDetailType[] | OrderLineType[];
const OrderDetail: React.FC<TableProps> = ({ data, loading, headers, handleSelectedItem, handleHeaderClick }) => {
    const [selectedItem, setSelectedItem] = React.useState<string>("")
    const [totalPromotionProduct, setTotalPromotionProduct] = React.useState<number>(0)
    const [totalPrice, setTotalPrice] = React.useState<number>(0)


    const determineTypeDetail = (data: Data) => data.length !== 0 && !!data[0].id && !!data[0].order

    React.useEffect(() => {
        let initAmount = 0;
        let initTotalPrice = 0;

        if (determineTypeDetail(data)) {
            data.forEach((item: OrderDetailType) => {
                if (item.price === 0 || item.discount !== 0) {
                    initAmount = initAmount + item.quantity
                }
                initTotalPrice += item.totalPrice

            })
        } else {
            data.forEach((item: OrderLineType) => {
                if (item.price === 0 || item.discount !== 0) {
                    initAmount = initAmount + item.quantity
                }
                initTotalPrice += item.totalPrice
            })
        }
        setTotalPromotionProduct(initAmount)
        setTotalPrice(initTotalPrice)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.length]);

    return (
        <div>
            <div style={{ height: "50vh", overflow: "auto" }}>
                {loading ? <Spinner animation="grow" /> :
                    <Table striped bordered hover size="sm" >
                        <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                        <tbody>
                            {(determineTypeDetail(data) ?
                                data.map((item: OrderDetailType) => {
                                    return (
                                        <tr key={item.product.code + Math.random()}>
                                            <td >{item.product.code} </td>
                                            <td >{item.quantity} </td>
                                            <td>{moneyFormat(item.price.toString())}</td>
                                            <td>{item.discount}</td>
                                            <td>{moneyFormat(item.totalPrice.toString())}</td>
                                        </tr>)
                                }) : data.map((item: OrderLineType) => {
                                    if (item.product.code === "") {
                                        return;
                                    } else
                                        return (
                                            <tr key={item.id} style={{
                                                background: item.product.code +
                                                    item.quantity + item.price === selectedItem ? '#00afec' : '', color: item.product.code +
                                                        item.quantity + item.price === selectedItem ? 'white' : ''
                                            }} onClick={() => {
                                                setSelectedItem(item.product.code + item.quantity + item.price)
                                                handleSelectedItem(item.product.code + item.quantity + item.price, item.product.code)
                                            }}>
                                                <td >{item.product.code} </td>
                                                <td >{item.quantity} </td>
                                                <td>{moneyFormat(item.price.toString())}</td>
                                                <td>{item.discount}</td>
                                                <td>{moneyFormat(item.totalPrice.toString())}</td>
                                            </tr>
                                        )
                                }))}
                        </tbody>
                    </Table>}
            </div>
            <Alert variant="info" style={{ width: "25vh", marginBottom: "0px" }}>Promotion products:
            <Badge pill variant="primary" style={{ fontSize: "85%" }}>{totalPromotionProduct}</Badge>
            </Alert>
            <Alert variant="warning" style={{ width: "25vh", marginBottom: "0px" }}>Total Price:
            <Badge pill variant="warning" style={{ fontSize: "85%" }}>{moneyFormat(totalPrice.toString())}</Badge>
            </Alert>
        </div>
    );

}
export default OrderDetail;