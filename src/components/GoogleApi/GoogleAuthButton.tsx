import React, { FC, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { authenticateUser, deauthenticateUser, TokenResponse } from "./GoogleAuth";

export type EmptyFunction = () => void;
export type GoogleLoginSuccess = (tokenResponse: TokenResponse) => void;

export interface GoogleAuthProps {
  authenticated: boolean;
  onLogout: EmptyFunction;
  onLogin: GoogleLoginSuccess;
  loginVariant?: string;
  logoutVariant?: string;
  loginText?: string;
  logoutText?: string;
  tokenData?: TokenResponse;
}

export const DEFAULT_LOGIN_VARIANT = "outline-primary";
export const DEFAULT_LOGOUT_VARIANT = "outline-danger";
export const DEFAULT_LOGIN_TEXT = "Log In";
export const DEFAULT_LOGOUT_TEXT = "Log Out";

export const GoogleAuthButton: FC<GoogleAuthProps> = ({
  authenticated,
  onLogin,
  onLogout,
  loginVariant = DEFAULT_LOGIN_VARIANT,
  logoutVariant = DEFAULT_LOGOUT_VARIANT,
  loginText = DEFAULT_LOGIN_TEXT,
  logoutText = DEFAULT_LOGOUT_TEXT,
  tokenData,
}): ReactElement => {

  const login = () => authenticateUser(onLogin);
  const logout = () => deauthenticateUser(onLogout, tokenData);

  return (
    <Button
      onClick={() => (authenticated ? logout() : login())}
      variant={authenticated ? logoutVariant : loginVariant}
    >
      {authenticated ? logoutText : loginText}
    </Button>
  );
};


