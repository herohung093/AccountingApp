import * as React from "react"
import image from "../assess/dragon_dental_logo_piros_D.jpg"
interface logoProps {
    logoHeight: string
}
const Logo: React.FC<logoProps> = props => {
    return (<div style={{ padding: "8px", height: props.logoHeight, boxSizing: "border-box" }}>
        <img src={image} alt="Dragon Dental" style={{ height: "100%", borderRadius: "5px" }} />
    </div>);
}
export default Logo;