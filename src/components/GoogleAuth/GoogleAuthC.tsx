import React, { FC, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { authenticateUser, deauthenticateUser, TokenResponse } from "./GoogleAuthZ";

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

  const login = () => authenticateUser(onLogin);
  const logout = () => deauthenticateUser(onLogout);

  return (
    <Button
      onClick={() => (authenticated ? logout() : login())}
      variant={authenticated ? logoutVariant : loginVariant}
    >
      {authenticated ? logoutText : loginText}
    </Button>
  );
};

let logoutTimeout: any;

export const clearLogoutTimer = () => {
  clearTimeout(logoutTimeout);
}

export interface LogoutTimerProps {
  logoutCallback: EmptyFunction;
  autoRefresh?: boolean;
  sessionData: {[key: string]: any};
  timeout: number;
}

export const setLogoutTimer = ({
  logoutCallback,
  autoRefresh = false,
  timeout,
  // sessionData,
}: LogoutTimerProps) => {
  // auto refresh doesn't work yet!
  if (autoRefresh) {
    logoutTimeout = setTimeout(async () => {
      clearLogoutTimer();
      // const refreshResponse = await fetchRefreshToken(sessionData.refresh_token);
      const refreshResponse = {} as any;// todo: refresh token
      if (refreshResponse.error) {
        logoutCallback();
      } else {
        setLogoutTimer({
          logoutCallback,
          autoRefresh,
          timeout: (refreshResponse.expires_in * 1000) - (1000 * 60 * 5),
          sessionData: refreshResponse,
        });
      }
    }, timeout - (1000 * 60 * 5));
  } else {
    logoutTimeout = setTimeout(() => {
      logoutCallback();
      clearLogoutTimer();
    }, timeout);
  }
};


