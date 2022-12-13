import React, { useState } from "react";
import { FC, ReactElement } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { END } from "../../strings";
import "./sidebar.scss";
import { GoogleAuthButton } from "../GoogleAuth";
import { AboutModal } from "../AboutModal";

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
  const [credentials, setCredentials] = useState(null) as any;
  const [showAbout, setShowAbout] = useState(false) as any;
  return (
    <Offcanvas
      show={showSidebar}
      onHide={() => toggleSidebar(false)}
      placement={END}
    >
      <Offcanvas.Header closeButton>
        <GoogleAuthButton
          authenticated={!!credentials}
          onLogin={(credentials) => {
            setCredentials(credentials);
          }}
          onLogout={() => {
            setCredentials(null);
          }}
        />
      </Offcanvas.Header>
      <Offcanvas.Body className="sidebar__body_container">
        <Button
          variant="primary"
          onClick={() => {
            setShowAbout(true);
          }}
          className="sidebar__button"
        >About</Button>
        <AboutModal show={showAbout} onHide={() => setShowAbout(false)} />
      </Offcanvas.Body>
      <p className="sidebar__p_version text-muted">
        Version: {process.env.REACT_APP_VERSION}
      </p>
    </Offcanvas>
  );
};
