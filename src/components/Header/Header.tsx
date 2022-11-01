import React from "react";
import { FC, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { ToggleSidebar } from "../Sidebar";
import "./header.scss";

/**
 * Header Component
 * @param {string} title - Page Title
 * @param {ToggleSidebar} toggleSidebar - Toggle Sidebar Function
 * @returns Header Component
 */

export interface HeaderProps {
  title: string;
  toggleSidebar: ToggleSidebar;
}

export const Header: FC<HeaderProps> = ({
  title,
  toggleSidebar,
}): ReactElement => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <Button
        className="sidebar__button_toggle"
        variant="outline-secondary"
        onClick={() => toggleSidebar(true)}
      >
        <i aria-label="More Information">i</i>
      </Button>
    </header>
  );
};
