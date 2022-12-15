import React, { FC, ReactElement, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import { Home } from "../containers/Home";
import { Edit } from "../containers/Edit";
import { Log } from "../containers/Log";
import { LogEntry } from "../containers/LogEntry";
import "./App.scss";
import { EDIT_URL, EMPTY, ENTRY_EDIT_URL, ENTRY_URL, FIELD_URL, HOME_URL, LOG_ID_URL, LOG_URL, NEW_URL, SUCCESS, WILDCARD } from "../strings";
import { Toaster, ToastType } from "../components/Toaster";
import { deauthenticate, useAuthenticated, useSessionExpiresAt } from "../store/Session/reducer";

export const App: FC = (): ReactElement => {
  const clientId = process.env.REACT_APP_G_CLIENT_ID as string;
  const authenticated = useAuthenticated();
  const expires_at = useSessionExpiresAt();

  useEffect(() => {
    if (authenticated) {
      if (expires_at && expires_at < Date.now()) {
        googleLogout();
        deauthenticate('');
        alert('Session expired. Please log in again.')
      } else {
        const sessionTimeout = setTimeout(() => {
          googleLogout();
          deauthenticate('');
          alert('Session expired. Please log in again!!!!!!')
          clearTimeout(sessionTimeout);
        }, expires_at - Date.now());
      }
    }
  }, []);

  const [toast, setToast] = React.useState({
    show: false,
    context: EMPTY,
    name: EMPTY,
    status: SUCCESS,
  } as ToastType);
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <HashRouter>
        <Routes>
          <Route path={WILDCARD} element={<h1>404</h1>} />
          <Route path={HOME_URL} element={<Home setToast={setToast} />} />
          <Route path={NEW_URL} element={<Home setToast={setToast} />} />
          <Route path={LOG_URL}>
            <Route path={EMPTY} element={<h1>404</h1>} />
            <Route path={LOG_ID_URL}>
              <Route path={EMPTY} element={<Log setToast={setToast} />} />
              <Route path={ENTRY_URL} element={<LogEntry setToast={setToast} />} />
              <Route
                path={ENTRY_EDIT_URL}
                element={<LogEntry setToast={setToast} />}
              />
              <Route path={EDIT_URL}>
                <Route path={EMPTY} element={<Edit setToast={setToast} />} />
                <Route
                  path={FIELD_URL}
                  element={<Edit setToast={setToast} />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </HashRouter>
      <Toaster toast={toast} setToast={setToast} />
    </GoogleOAuthProvider>
  );
};

export default App;
