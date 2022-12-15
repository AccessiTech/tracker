import React, { useState } from "react";
import { FC, ReactElement } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { ABOUT_APP_HEADER, END, LINK_SECONDARY } from "../../strings";
import "./sidebar.scss";
import { GoogleAuthButton } from "../GoogleAuth";
import { AboutModal } from "../AboutModal";
import store from "../../store/store";
import {
  authenticate,
  deauthenticate,
  useAuthenticated,
} from "../../store/Session";

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
  const [authenticated, setAuthenticated] = useState(useAuthenticated());
  const [showAbout, setShowAbout] = useState(false) as any;
  let logoutTimeout: any;
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
          onLogin={(credentials) => {
            setAuthenticated(true);
            store.dispatch(
              authenticate({
                data: credentials,
                expiresAt: Date.now() + credentials.expires_in * 1000,
              })
            );
            // Set timeout to log out user after token expires
            logoutTimeout = setTimeout(() => {
              setAuthenticated(false);
              store.dispatch(deauthenticate({}));
              alert("You have been logged out due to inactivity.");
              clearTimeout(logoutTimeout);
            }, credentials.expires_in * 1000);
          }}
          onLogout={() => {
            setAuthenticated(false);
            store.dispatch(deauthenticate({}));
            clearTimeout(logoutTimeout);
          }}
        />
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
        <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
      </Offcanvas.Body>
      <p className="sidebar__p_version text-muted">
        Version: {process.env.REACT_APP_VERSION}
      </p>
    </Offcanvas>
  );
};
