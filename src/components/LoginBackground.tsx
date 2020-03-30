import * as React from "react"
import image from "../assess/Login_Background.png"
interface logoProps {
    logoHeight: string
}
const LoginBackground: React.FC<logoProps> = props => {
    return (
        <img src={image} alt="Dragon Dental" style={{ height: "100%" }} />
    );
}
export default LoginBackground;