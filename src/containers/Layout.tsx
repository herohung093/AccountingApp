import * as React from "react"
import ProcessingOrder from "../containers/ProcessingOrder"
import CreateOrder from "../containers/CreateOrder"
import { Route, Redirect } from "react-router-dom"
import ProcessInventory from "./ProcessInventory"
import CreateProduct from "./CreateProduct"
import CreateCustomer from "./CreateCustomer"
import InventoryHistory from "./InventoryHistory"
import PowderMixing from "./PowderMixing"
import Customers from "./Customers"
import Analysis from "./Analysis"
import Auth from "../containers/Auth/Auth"
import { LoginContext } from "../components/Context/LoginContext"
import AddExpense from "./AddExpense"
const Layout: React.FC<{}> = props => {

    const authContext = React.useContext(LoginContext).isAuth


    return (<div style={{ paddingTop: "72px", backgroundColor: "#f7f7f7", height: "100%" }}>
        {!authContext ? <Redirect to="/auth" /> : <Redirect to="/" />}
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
        <Route path="/auth" exact component={Auth}></Route>
        <Route path="/addexpense" exact component={AddExpense}></Route>
        <Route path="/logout" exact component={Auth}></Route>
    </div>);
}
export default Layout;