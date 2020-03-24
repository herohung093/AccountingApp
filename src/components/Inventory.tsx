import * as React from "react"
import TableHeader from "./TableHeader"
import { Table, Spinner } from "react-bootstrap"
import InventoryType from "../Types/InventoryType"
interface TableProps {
    data: InventoryType[];
    loading: boolean;
    headers: string[];
    handleHeaderClick: (value: string) => void;
    handleSelectedItem: (item: InventoryType) => void;
    tableHeight: string
}

const Inventory: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, handleSelectedItem, tableHeight }) => {
    const [selectedItem, setSelectedItem] = React.useState<string>("")
    let style = {
        height: tableHeight,
        overflow: "auto",
        width: "22vh"
    }
    return (
        <div style={style}>
            {loading ? <Spinner animation="grow" /> :
                <Table striped bordered hover size="sm"  >
                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                    <tbody >
                        {data.map(item => {
                            return (
                                <tr key={item.code} style={{ background: item.code === selectedItem ? '#00afec' : '', color: item.code === selectedItem ? 'white' : '' }} onClick={() => {
                                    setSelectedItem(item.code)
                                    handleSelectedItem(item)
                                }}>
                                    <td >{item.code} </td>
                                    <td >{item.stock} </td>
                                </tr>)
                        })}
                    </tbody>
                </Table>}
        </div>
    );
}
export default Inventory