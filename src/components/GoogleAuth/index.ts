export {
  GoogleAuthButton,
  DEFAULT_LOGIN_TEXT,
  DEFAULT_LOGOUT_TEXT,
  DEFAULT_LOGIN_VARIANT,
  DEFAULT_LOGOUT_VARIANT,
  setLogoutTimer,
} from "./GoogleAuthC";
export type {
  GoogleAuthProps,
  EmptyFunction,
  GoogleLoginSuccess,
} from "./GoogleAuthC";

export {
  DISCOVERY_DOC,
  SCOPES,

  initGoogleAuth,
  authenticateUser,
  deauthenticateUser,
  getTokenClient,
} from './GoogleAuthZ';

export type {
  ErrorCode,
  TokenResponse,
  InitGoogleAuthParams,
} from './GoogleAuthZ';
