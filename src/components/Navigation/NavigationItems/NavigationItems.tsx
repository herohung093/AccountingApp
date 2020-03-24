import * as React from "react"
import NavigationItem from "./NavigationItem"
const NavigationItems: React.FC<{}> = props => {
    return (
        <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", alignItems: "center", height: "100%" }}>
            <NavigationItem link="/" children="Processing Order" />
            <NavigationItem link="/createorder" children="Create Order" />
            <NavigationItem link="/inventory" children="Inventory" />
            <NavigationItem link="/createproduct" children="Create Product" />
            <NavigationItem link="/createcustomer" children="Create Customer" />
            <NavigationItem link="/inventoryhistory" children="Inventory History" />
        </ul>
    );
}
export default NavigationItems