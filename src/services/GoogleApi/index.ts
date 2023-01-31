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
  EmptyFunction,
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
