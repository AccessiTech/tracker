import React, { useEffect, useState } from "react";
import { FC, ReactElement } from "react";
import { Button, Offcanvas } from "react-bootstrap";

import store from "../../store/store";
import { authenticate, deauthenticate, useSession } from "../../store/Session";
import { useGetLogs } from "../../store/Log";
import { useDataSync } from "../../store/DataSync";

import { syncLogSheet, SyncLogSheetResponse } from "../../services/DataSync";
import { clearLogoutTimer, TokenResponse, setLogoutTimer  } from "../../services/GoogleApi";

import { AboutModal } from "../AboutModal";
import { GoogleAuthButton} from "../GoogleAuthButton";
import { DataSync, handleError, updateLocalLog } from "../DataSync";

import { ABOUT_APP_HEADER, END, LINK_SECONDARY } from "../../strings";

import "./sidebar.scss";

/**
 * Sidebar Component
 * @param {boolean} showSidebar - Show Sidebar
 * @param {ToggleSidebar} toggleSidebar - Toggle Sidebar Function
 * @returns {ReactElement} Sidebar Component
 */

export type ToggleSidebar = React.Dispatch<React.SetStateAction<boolean>>;

export interface SidebarProps {
  showSidebar: boolean;
  toggleSidebar: ToggleSidebar;
}

export const Sidebar: FC<SidebarProps> = ({
  showSidebar,
  toggleSidebar,
}): ReactElement => {
  const session = useSession();
  const { authenticated: isAuthenticated, data } = session;

  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  // const [rememberMe, setRememberMe] = useState(autoRefresh);
  const [showAbout, setShowAbout] = useState(false) as any;

  const dataSyncState = useDataSync();
  const logs = useGetLogs();

  useEffect(() => {
    setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    // await sync logs
    if (dataSyncState?.syncEnabled && dataSyncState?.syncSettings?.onLogout) {
      const sync = dataSyncState[dataSyncState.syncMethod];
      if (sync?.logSheets && Object.keys(sync?.logSheets).length) {
        const { logSheets } = sync;
        const logIds = Object.keys(logSheets);
        for (const logId of logIds) {
          const log = logs[logId];
          await syncLogSheet({
            log,
            logSheetId: logSheets[logId]?.id,
            onError: handleError,
          })
            .then((updates: SyncLogSheetResponse) => {
              updateLocalLog({ log, updates, store });
            })
            .catch((error) => {
              console.error("Error syncing onLogIn: ", error);
            });
        }
      }
    }

    setAuthenticated(false);
    store.dispatch(deauthenticate(""));
    clearLogoutTimer();
  };

  const handleLogin = (credentials: TokenResponse) => {
    setAuthenticated(true);
    store.dispatch(
      authenticate({
        data: credentials,
        // autoRefresh: rememberMe,
        expiresAt: Date.now() + credentials.expires_in * 1000,
      })
    );
    setLogoutTimer({
      logoutCallback: handleLogout,
      timeout: credentials.expires_in * 1000,
      // autoRefresh: rememberMe,
      sessionData: credentials,
    });
    // todo: sync logs
    if (dataSyncState?.syncEnabled) {
      const { syncSettings } = dataSyncState;
      if (syncSettings?.onLogin) {
        const sync = dataSyncState[dataSyncState.syncMethod];
        if (sync?.logSheets && Object.keys(sync?.logSheets).length) {
          const { logSheets } = sync;
          const logIds = Object.keys(logSheets);
          for (const logId of logIds) {
            const log = logs[logId];
            syncLogSheet({
              log,
              logSheetId: logSheets[logId]?.id,
              onError: handleError,
            })
              .then((updates: SyncLogSheetResponse) => {
                updateLocalLog({ log, updates, store });
              })
              .catch((error) => {
                console.error("Error syncing onLogIn: ", error);
              });
          }
        }
      }
    }
  };

  return (
    <Offcanvas
      show={showSidebar}
      onHide={() => toggleSidebar(false)}
      placement={END}
      className="sidebar"
    >
      <Offcanvas.Header closeButton>
        <GoogleAuthButton
          authenticated={authenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          tokenData={data.access_token && data}
        />
        {/* <Form.Check
          id="sidebar__check_remember"
          type="checkbox"
          label="Remember Me"
          className="sidebar__check_remember"
          onChange={(e) => {
            setRememberMe(e.target.checked);
          }}
        /> */}

        <Button
          variant={LINK_SECONDARY}
          onClick={() => {
            setShowAbout(true);
          }}
          className="sidebar__about_btn"
          title={ABOUT_APP_HEADER}
        >
          <i className="fa fa-info fa-lg" aria-hidden="true"></i>
        </Button>
      </Offcanvas.Header>
      <Offcanvas.Body className="sidebar__body_container">
        <DataSync authenticated={authenticated} />

        <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
      </Offcanvas.Body>
      <p className="sidebar__p_version text-muted">
        Version: {process.env.REACT_APP_VERSION}
      </p>
    </Offcanvas>
  );
};
