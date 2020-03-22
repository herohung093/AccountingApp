import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import styled from "styled-components";
import ToolBar from "./components/Navigation/ToolBar/ToolBar"
import Layout from "./containers/Layout"
function App() {
  return (
    <div className="App">

      <ToolBar></ToolBar>
      <Layout />
    </div>
  );
}

export default App;
