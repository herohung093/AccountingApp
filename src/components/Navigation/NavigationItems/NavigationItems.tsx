import * as React from "react"
import NavigationItem from "./NavigationItem"
const NavigationItems: React.FC<{}> = props => {
    return (
        <ul style={{ margin: "0", padding: "0", listStyle: "none", display: "flex", alignItems: "center", height: "100%" }}>
            <NavigationItem link="/" children="Processing Order" />
            <NavigationItem link="/createorder" children="Create Order" />
        </ul>
    );
}
export default NavigationItems