import * as React from "react"
import TableHeader from "./TableHeader"
import { Table, Spinner } from "react-bootstrap"
import InventoryType from "../Types/InventoryType"
interface TableProps {
    data: InventoryType[];
    loading: boolean;
    headers: string[];
    handleHeaderClick: (value: string) => void;
    handleSelectedItem: (code: string) => void;
}

const Inventory: React.FC<TableProps> = ({ data, loading, headers, handleHeaderClick, handleSelectedItem }) => {
    const [selectedItem, setSelectedItem] = React.useState<string>("")
    return (
        <div style={{ height: "50vh", overflow: "auto", width: "22vh" }}>
            {loading ? <Spinner animation="grow" /> :
                <Table striped bordered hover size="sm"  >
                    <TableHeader listOfHeader={headers} handleClick={handleHeaderClick}></TableHeader>
                    <tbody >
                        {data.map(item => {
                            return (
                                <tr key={item.code} style={{ background: item.code === selectedItem ? '#00afec' : '', color: item.code === selectedItem ? 'white' : '' }} onClick={() => {
                                    setSelectedItem(item.code)
                                    handleSelectedItem(item.code)
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