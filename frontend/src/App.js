import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import withAuthentication from './components/withAuthentication'; 

const ProtectedUpload = withAuthentication(Upload);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<ProtectedUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
