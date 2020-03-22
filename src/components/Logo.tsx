import * as React from "react"
import image from "../assess/dragon_dental_logo_piros_D.jpg"
const Logo: React.FC<{}> = props => {
    return (<div style={{ padding: "8px", height: "100%", boxSizing: "border-box" }}>
        <img src={image} alt="Dragon Dental" style={{ height: "100%", borderRadius: "5px" }} />
    </div>);
}
export default Logo;