import React, { FC, ReactElement } from "react";
import {
  googleLogout,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import { Button } from "react-bootstrap";

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
}): ReactElement => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => {
      onLogin(tokenResponse);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const logout = () => {
    onLogout();
    googleLogout();
  };

  return (
    <Button
      onClick={() => (authenticated ? logout() : login())}
      variant={authenticated ? logoutVariant : loginVariant}
    >
      {authenticated ? logoutText : loginText}
    </Button>
  );
};
