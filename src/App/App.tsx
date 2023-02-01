import React, { FC, ReactElement, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "../containers/Home";
import { Edit } from "../containers/Edit";
import { Log } from "../containers/Log";
import { LogEntry } from "../containers/LogEntry";
import "./App.scss";
import { EDIT_URL, EMPTY, ENTRY_EDIT_URL, ENTRY_URL, FIELD_URL, HOME_URL, LOG_ID_URL, LOG_URL, NEW_URL, SUCCESS, WILDCARD } from "../strings";
import { Toaster, ToastType } from "../components/Toaster";
import { deauthenticate, useSession } from "../store/Session/reducer";
import store from "../store/store";
import { authenticateUser, deauthenticateUser, initGoogleAuth, setLogoutTimer } from "../services/GoogleApi";
import { decode } from "../utils";

export const App: FC = (): ReactElement => {
  const apiKey = process.env.REACT_APP_EG_API_KEY as string;
  const clientId = process.env.REACT_APP_EG_CLIENT_ID as string;
  const session = useSession();
  const { authenticated, expiresAt, data } = session;

  const handleLogout = (): void => {
    deauthenticateUser(() => {
      store.dispatch(deauthenticate(''));
    })
  };

  useEffect(() => {
    initGoogleAuth({
      apiKey,
      clientId,
      decrypt: (str:string) => decode(str, 2)
    }, () => {
      if (authenticated) {
        if (expiresAt && expiresAt < Date.now()) {
          handleLogout();
        } else {
          authenticateUser(() => {
            setLogoutTimer({
              logoutCallback: handleLogout,
              timeout: expiresAt - Date.now(),
              // autoRefresh,
              sessionData: data,
            });
          }, data.access_token && data);
        }
      }
    });
  }, []);

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
    </>
  );
};

export default App;
