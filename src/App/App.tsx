import React, { FC, ReactElement } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../containers/Home";
import { Edit } from "../containers/Edit";
import { Log } from "../containers/Log";
import { LogEntry } from "../containers/LogEntry";
import "./App.scss";
import { EMPTY, SUCCESS } from "../strings";
import { Toaster, ToastType } from "../components/Toaster";

export const App: FC = (): ReactElement => {
  const [toast, setToast] = React.useState({
    show: false,
    context: EMPTY,
    name: EMPTY,
    status: SUCCESS,
  } as ToastType);
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="*" element={<h1>404</h1>} />
          <Route path="/" element={<Home setToast={setToast} />} />
          <Route path="/new" element={<Home setToast={setToast} />} />
          <Route path="/log/">
            <Route path="" element={<h1>404</h1>} />
            <Route path=":id/">
              <Route path="" element={<Log setToast={setToast} />} />
              <Route path="entry/" element={<LogEntry setToast={setToast} />} />
              <Route
                path="entry/:entry"
                element={<LogEntry setToast={setToast} />}
              />
              <Route path="edit/">
                <Route path="" element={<Edit setToast={setToast} />} />
                <Route
                  path="field/:field/"
                  element={<Edit setToast={setToast} />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </HashRouter>
      <Toaster toast={toast} setToast={setToast} />
    </>
  );
};

export default App;
