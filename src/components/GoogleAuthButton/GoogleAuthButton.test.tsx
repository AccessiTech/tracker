import React from "react";
import { render } from "@testing-library/react";
import { DEFAULT_LOGIN_TEXT, DEFAULT_LOGIN_VARIANT, DEFAULT_LOGOUT_TEXT, DEFAULT_LOGOUT_VARIANT, GoogleAuthButton, GoogleAuthProps } from "./GoogleAuthButton";
import * as GoogleApi from "../../services/GoogleApi";
jest.mock("../../services/GoogleApi", () => ({
  authenticateUser: jest.fn(),
  deauthenticateUser: jest.fn(),
}));

const basicProps: GoogleAuthProps = {
  authenticated: false,
  onLogin: jest.fn(),
  onLogout: jest.fn(),
};

describe("GoogleAuthButton", () => {
  test("renders without crashing", () => {
    const { getByText } = render(<GoogleAuthButton {...basicProps} />);
    expect(basicProps.onLogin).toHaveBeenCalledTimes(0);
    expect(getByText(DEFAULT_LOGIN_TEXT)).toBeInTheDocument();
  });

  test("renders correctly when authenticated", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated={true} />
    );
    expect(basicProps.onLogin).toHaveBeenCalledTimes(0);
    const btn = getByText(DEFAULT_LOGOUT_TEXT)
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('btn-' + DEFAULT_LOGOUT_VARIANT);
  });

  test("renders correctly when not authenticated", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated={false} />
    );
    expect(basicProps.onLogin).toHaveBeenCalledTimes(0);
    const btn = getByText(DEFAULT_LOGIN_TEXT)
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('btn-' + DEFAULT_LOGIN_VARIANT);
  });

  test("calls onLogin when not authenticated and clicked", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated={false} />
    );
    expect(GoogleApi.authenticateUser).toHaveBeenCalledTimes(0);
    getByText(DEFAULT_LOGIN_TEXT).click();
    expect(GoogleApi.authenticateUser).toHaveBeenCalledTimes(1);
  });

  test("calls onLogout when authenticated and clicked", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated={true} />
    );
    expect(GoogleApi.deauthenticateUser).toHaveBeenCalledTimes(0);
    getByText(DEFAULT_LOGOUT_TEXT).click();
    expect(GoogleApi.deauthenticateUser).toHaveBeenCalledTimes(1);
  });

  test("renders with custom login text", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} loginText="Custom Login Text" />
    );
    expect(getByText("Custom Login Text")).toBeInTheDocument();
  });

  test("renders with custom logout text", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated logoutText="Custom Logout Text" />
    );
    expect(getByText("Custom Logout Text")).toBeInTheDocument();
  });

  test("renders with custom login variant", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} loginVariant="primary" />
    );
    expect(getByText(DEFAULT_LOGIN_TEXT)).toHaveClass("btn-primary");
  });

  test("renders with custom logout variant", () => {
    const { getByText } = render(
      <GoogleAuthButton {...basicProps} authenticated logoutVariant="danger" />
    );
    expect(getByText(DEFAULT_LOGOUT_TEXT)).toHaveClass("btn-danger");
  });
});