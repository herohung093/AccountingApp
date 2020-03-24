import * as React from "react"
import ProcessingOrder from "../containers/ProcessingOrder"
import CreateOrder from "../containers/CreateOrder"
import { Route } from "react-router-dom"
import ProcessInventory from "./ProcessInventory"
import CreateProduct from "./CreateProduct"
import CreateCustomer from "./CreateCustomer"
import InventoryHistory from "./InventoryHistory"
const Layout: React.FC<{}> = props => {
    return (<div style={{ paddingTop: "72px" }}>
        <Route path="/" exact component={ProcessingOrder}></Route>
        <Route path="/createorder" exact component={CreateOrder}></Route>
        <Route path="/updateorder/:id" exact component={CreateOrder}></Route>
        <Route path="/inventory" exact component={ProcessInventory}></Route>
        <Route path="/createproduct" exact component={CreateProduct}></Route>
        <Route path="/createcustomer" exact component={CreateCustomer}></Route>
        <Route path="/inventoryhistory" exact component={InventoryHistory}></Route>
    </div>);
}
export default Layout;