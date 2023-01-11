import React, { useEffect, useState } from "react";
import { FC, ReactElement } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { ABOUT_APP_HEADER, END, LINK_SECONDARY } from "../../strings";
import "./sidebar.scss";
import { GoogleAuthButton, setLogoutTimer } from "../GoogleApi";
import { AboutModal } from "../AboutModal";
import store from "../../store/store";
import {
  authenticate,
  deauthenticate,
  useSession,
} from "../../store/Session";
import { clearLogoutTimer, TokenResponse } from "../GoogleApi";
import { DataSync } from "../DataSync";

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

  useEffect(() => {
    setAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
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
        
        <DataSync
          authenticated={authenticated}
        />
        
        <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
      </Offcanvas.Body>
      <p className="sidebar__p_version text-muted">
        Version: {process.env.REACT_APP_VERSION}
      </p>
    </Offcanvas>
  );
};
