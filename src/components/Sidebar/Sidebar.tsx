import React from "react";
import { FC, ReactElement } from "react";
import { Offcanvas } from "react-bootstrap";
import { END, SIDEBAR_HEADER } from "../../strings";
import "./sidebar.scss";

export const SIDEBAR_BODY =
  "This is a simple app to help you keep track of your logs. Highly customizable logs allow you to track anything you want!";
export const SIDEBAR_DATA_HEADER = "Data Usage";
export const SIDEBAR_DATA_BODY_1 =
  "This app uses local storage to store your logs, no data is sent to a server. Your data is never sold to anyone, EVER.";
export const SIDEBAR_DATA_BODY_2 =
  "If you want to delete your personal data, just delete the Log / Entry. To completely clear the App data, clear your browser's local storage via the browser inspector tools.";
export const SIDEBAR_ISSUES_HEADER = "Report Issues";
export const SIDEBAR_ISSUES_BODY =
  "If you find any issues with the app, please report them on the GitHub issues page.";
export const SIDEBAR_ISSUES_LINK =
  "https://github.com/AccessiTech/tracker/issues";
export const SIDEBAR_FEATURES_HEADER = "Feature Requests";
export const SIDEBAR_FEATURES_BODY =
  "If you have any feature requests, please feel free to start (or join) a discussion on Github!";
export const SIDEBAR_FEATURES_LINK =
  "https://github.com/AccessiTech/tracker/discussions";
export const GITHUB_ISSUES = "GitHub Issues";
export const GITHUB_DISCUSSIONS = "GitHub Discussions";

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
      <Offcanvas.Body className="sidebar__body_container">
        <p>{SIDEBAR_BODY}</p>
        <h3>{SIDEBAR_DATA_HEADER}</h3>
        <p>{SIDEBAR_DATA_BODY_1}</p>
        <p>{SIDEBAR_DATA_BODY_2}</p>
        <h3>{SIDEBAR_ISSUES_HEADER}</h3>
        <p>
          {SIDEBAR_ISSUES_BODY}
          <a
            href={SIDEBAR_ISSUES_LINK}
            title={GITHUB_ISSUES}
            target={"_blank"}
            rel={"noreferrer"}
          >
            <i
              className="fa fa-arrow-up-right-from-square"
              aria-hidden="true"
            ></i>
            <span className="visible_hidden">{GITHUB_ISSUES}</span>
          </a>
        </p>
        <h3>{SIDEBAR_FEATURES_HEADER}</h3>
        <p>
          {SIDEBAR_FEATURES_BODY}
          <a
            href={SIDEBAR_FEATURES_LINK}
            title={GITHUB_DISCUSSIONS}
            target={"_blank"}
            rel={"noreferrer"}
          >
            <i
              className="fa fa-arrow-up-right-from-square"
              aria-hidden="true"
            ></i>
            <span className="visible_hidden">{GITHUB_DISCUSSIONS}</span>
          </a>
        </p>
      </Offcanvas.Body>
      <p className="sidebar__p_version text-muted">
        Version: {process.env.REACT_APP_VERSION}
      </p>
    </Offcanvas>
  );
};
