import React, { FC, ReactElement } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../containers/Home";
import { Edit } from "../containers/Edit";
import { Log } from "../containers/Log";
import { LogEntry } from "../containers/LogEntry";
import "./App.scss";

export const App: FC = (): ReactElement => {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<Home />} />
        <Route path="/log/">
          <Route path="" element={<h1>404</h1>} />
          <Route path=":id/">
            <Route path="" element={<Log />} />
            <Route path="entry/" element={<LogEntry />} />
            <Route path="entry/:entry" element={<LogEntry />} />
            <Route path="edit/">
              <Route path="" element={<Edit />} />
              <Route path="field/:field/" element={<Edit />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
