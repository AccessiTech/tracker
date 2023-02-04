// Header component tests
import React from "react";
import { render } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { Header } from "./Header";
import { ABOUT_APP_HEADER } from "../../strings";

test("renders without crashing", () => {
  render(<HashRouter><Header title="" toggleSidebar={() => { }} /></HashRouter>);
});

test("renders title", () => {
  const { getByText } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
  const title = getByText(/Test/i);
  expect(title).toBeInTheDocument();
});

test("renders menu button", () => {
  const { getByTitle } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
  const menuBtn = getByTitle(ABOUT_APP_HEADER);
  expect(menuBtn).toBeInTheDocument();
});

test("renders logo", () => {
  const { getByAltText } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
  const logo = getByAltText(/Logo/i);
  expect(logo).toBeInTheDocument();
});

test("renders logo image", () => {
  const { getByRole } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
  const logoImg = getByRole("img");
  expect(logoImg).toBeInTheDocument();
  expect(logoImg).toHaveAttribute("src", "/black_logo192.png");
});

test("renders logo link", () => {
  const { getByRole } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
  const logoLink = getByRole("link");
  expect(logoLink).toBeInTheDocument();
  expect(logoLink).toHaveAttribute("href", "/");
});
