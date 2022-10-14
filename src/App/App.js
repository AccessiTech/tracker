import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../containers/Home";
import { New } from "../containers/New";
import { Edit } from "../containers/Edit";
import { LogEntry } from "../containers/LogEntry";
import "./App.scss";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/log">
          <Route path="new" element={<New />} />
          <Route path=":id">
            <Route path="entry" element={<LogEntry />} />
            <Route path="edit" element={<Edit />}>
              <Route path="field/:field" element={<Edit />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
