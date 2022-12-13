import React from "react";
import { FC, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { OUTLINE_SECONDARY, ABOUT_APP_HEADER } from "../../strings";
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
  const navigate = useNavigate();
  return (
    <header className="header">
      <a
        href="/"
        className="header__a_logo"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <img
          src={process.env.PUBLIC_URL + `/black_logo192.png`}
          alt="Logo"
          className="header__img"
        />
      </a>
      <h1>{title}</h1>
      <Button
        className="sidebar__button_toggle"
        variant={OUTLINE_SECONDARY}
        onClick={() => toggleSidebar(true)}
        title={ABOUT_APP_HEADER}
      >
        <i>i</i>
      </Button>
    </header>
  );
};
