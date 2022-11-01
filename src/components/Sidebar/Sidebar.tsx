import React from "react";
import { FC, ReactElement } from "react";
import { Offcanvas } from "react-bootstrap";
import { END } from "../../strings";

export const SIDEBAR_HEADER = "About the App";
export const SIDEBAR_BODY = "This is a simple app to help you keep track of your logs. Highly customizable logs allow you to track anything you want!";
export const SIDEBAR_DATA_HEADER = "Data Usage";
export const SIDEBAR_DATA_BODY_1 = "This app uses local storage to store your logs, no data is sent to a server. Your data is never sold to anyone, EVER."
export const SIDEBAR_DATA_BODY_2 = "If you want to delete your personal data, just delete the Log / Entry. To completely clear the App data, clear your browser's local storage via the browser inspector tools.";

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
  return (
    <Offcanvas
      show={showSidebar}
      onHide={() => toggleSidebar(false)}
      placement={END}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title as="h2">{SIDEBAR_HEADER}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>{SIDEBAR_BODY}</p>
        <h3>{SIDEBAR_DATA_HEADER}</h3>
        <p>{SIDEBAR_DATA_BODY_1}</p>
        <p>{SIDEBAR_DATA_BODY_2}</p>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
