import * as React from "react"
import ProcessingOrder from "../containers/ProcessingOrder"
import CreateOrder from "../containers/CreateOrder"
import { Route } from "react-router-dom"
const Layout: React.FC<{}> = props => {
    return (<div style={{ paddingTop: "72px" }}>
        <Route path="/" exact component={ProcessingOrder}></Route>
        <Route path="/createorder" exact component={CreateOrder}></Route>
        <Route path="/updateorder/:id" exact component={CreateOrder}></Route>
    </div>);
}
export default Layout;