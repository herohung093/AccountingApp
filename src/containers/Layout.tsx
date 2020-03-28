import * as React from "react"
import ProcessingOrder from "../containers/ProcessingOrder"
import CreateOrder from "../containers/CreateOrder"
import { Route } from "react-router-dom"
import ProcessInventory from "./ProcessInventory"
import CreateProduct from "./CreateProduct"
import CreateCustomer from "./CreateCustomer"
import InventoryHistory from "./InventoryHistory"
import PowderMixing from "./PowderMixing"
import Customers from "./Customers"
import Analysis from "./Analysis"
const Layout: React.FC<{}> = props => {
    return (<div style={{ paddingTop: "72px", backgroundColor: "#f7f7f7", height: "100vh" }}>
        <Route path="/" exact component={Analysis}></Route>
        <Route path="/processingorder" exact component={ProcessingOrder}></Route>
        <Route path="/createorder" exact component={CreateOrder}></Route>
        <Route path="/updateorder/:id" exact component={CreateOrder}></Route>
        <Route path="/inventory" exact component={ProcessInventory}></Route>
        <Route path="/createproduct" exact component={CreateProduct}></Route>
        <Route path="/createcustomer" component={CreateCustomer}></Route>
        <Route path="/inventoryhistory" exact component={InventoryHistory}></Route>
        <Route path="/powdermixing" exact component={PowderMixing}></Route>
        <Route path="/customers" exact component={Customers}></Route>
        <Route path="/updatecustomer/:name" exact component={CreateCustomer}></Route>
    </div>);
}
export default Layout;