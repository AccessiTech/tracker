import React, { FC, ReactElement } from "react";
import { Modal } from "react-bootstrap";
import { ABOUT_APP_HEADER } from "../../strings";

export const ABOUT_BODY =
  "This is a simple app to help you keep track of your logs. Highly customizable logs allow you to track anything you want!";
export const ABOUT_DATA_HEADER = "Data Usage";
export const ABOUT_DATA_BODY_1 =
  "This app uses local storage to store your logs, no data is sent to a server. Your data is never sold to anyone, EVER.";
export const ABOUT_DATA_BODY_2 =
  "If you want to delete your personal data, just delete the Log / Entry. To completely clear the App data, clear your browser's local storage via the browser inspector tools.";
export const ABOUT_ISSUES_HEADER = "Report Issues";
export const ABOUT_ISSUES_BODY =
  "If you find any issues with the app, please report them on the GitHub issues page.";
export const ABOUT_ISSUES_LINK =
  "https://github.com/AccessiTech/tracker/issues";
export const ABOUT_FEATURES_HEADER = "Feature Requests";
export const ABOUT_FEATURES_BODY =
  "If you have any feature requests, please feel free to start (or join) a discussion on Github!";
export const ABOUT_FEATURES_LINK =
  "https://github.com/AccessiTech/tracker/discussions";
export const GITHUB_ISSUES = "GitHub Issues";
export const GITHUB_DISCUSSIONS = "GitHub Discussions";

export interface AboutModalProps {
  show: boolean;
  onHide: () => void;
}
export const AboutModal: FC<AboutModalProps> = ({
  show,
  onHide,
}): ReactElement => {
  return (
    <Modal id="aboutModal" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <h3>{ABOUT_APP_HEADER}</h3>
      </Modal.Header>
      <Modal.Body>
        <p>{ABOUT_BODY}</p>
        <h4>{ABOUT_DATA_HEADER}</h4>
        <p>{ABOUT_DATA_BODY_1}</p>
        <p>{ABOUT_DATA_BODY_2}</p>
        <h4>{ABOUT_ISSUES_HEADER}</h4>
        <p>
          {ABOUT_ISSUES_BODY}
          <a
            href={ABOUT_ISSUES_LINK}
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
        <h4>{ABOUT_FEATURES_HEADER}</h4>
        <p>
          {ABOUT_FEATURES_BODY}
          <a
            href={ABOUT_FEATURES_LINK}
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
      </Modal.Body>
    </Modal>
  );
};
