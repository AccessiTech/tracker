// Header component tests
import React from "react";
import { render } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import { Header } from "./Header";
import { ABOUT_APP_HEADER } from "../../strings";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header", () => {
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

  test("navigates home when logo is clicked", () => {
    const { container } = render(<HashRouter><Header title="Test" toggleSidebar={() => { }} /></HashRouter>);
    const logoLink = container.querySelector(".header__a_logo");
    expect(logoLink).toBeInTheDocument();
    (logoLink as HTMLAnchorElement).click();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("toggles sidebar when menu button is clicked", () => {
    const toggleSidebar = jest.fn();
    const { container } = render(<HashRouter><Header title="Test" toggleSidebar={toggleSidebar} /></HashRouter>);
    const menuBtn = container.querySelector(".sidebar__button_toggle");
    expect(menuBtn).toBeInTheDocument();
    (menuBtn as HTMLButtonElement).click();
    expect(toggleSidebar).toHaveBeenCalledWith(true);
  });
});