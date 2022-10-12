import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../containers/Home";
import { New } from "../containers/New";
import { Edit } from "../containers/Edit";
import "./App.scss";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
