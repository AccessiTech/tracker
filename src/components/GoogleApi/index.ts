export {
  GoogleAuthButton,
  DEFAULT_LOGIN_TEXT,
  DEFAULT_LOGOUT_TEXT,
  DEFAULT_LOGIN_VARIANT,
  DEFAULT_LOGOUT_VARIANT,
} from "./GoogleAuthButton";
export type {
  GoogleAuthProps,
  EmptyFunction,
  GoogleLoginSuccess,
} from "./GoogleAuthButton";

export {
  DISCOVERY_DOCS,
  SCOPES,
  initGoogleAuth,
  authenticateUser,
  deauthenticateUser,
  getTokenClient,
  getApiClient,
  getGoogle,
  setLogoutTimer,
  clearLogoutTimer,
} from "./GoogleAuth";

export type {
  ErrorCode,
  TokenResponse,
  InitGoogleAuthParams,
} from "./GoogleAuth";

export {
  listFiles,
  listFolders,
  createFolder,
  createFile,
  createSpreadsheet,
} from "./GoogleDrive";

export type {
  CreateFolderProps,
  CreateFileProps,
  CreateSpreadsheetProps,
} from "./GoogleDrive";

export { setSheetValues, getSheetValues, setSheetName } from "./GoogleSheets";

export type {
  setSheetValuesProps,
  getSheetValuesProps,
  setSheetNameProps,
} from "./GoogleSheets";
