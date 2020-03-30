import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolBar from "./components/Navigation/ToolBar/ToolBar"
import Layout from "./containers/Layout"
import { useEffect, useState, useContext } from "react"
import { LoginContext } from "./components/Context/LoginContext"
function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const authContext = useContext(LoginContext).isAuth
  useEffect(() => {
    if (authContext) {
      setIsAuth(true)

    } else {
      setIsAuth(false)
    }
  })

  return (

    <div className="App" style={{ backgroundColor: "#f7f7f7", height: "100%" }}>

      <ToolBar></ToolBar>
      <Layout />
    </div>


  );
}

export default App;
