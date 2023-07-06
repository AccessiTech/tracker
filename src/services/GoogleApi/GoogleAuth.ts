export type EmptyFunction = () => void;

export const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
export const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

let apiInitialized = false;
let googleInitialized = false;
let tokenClient: any;
let gapi: any;
let google: any;

export type ErrorCode =
  | "invalid_request"
  | "access_denied"
  | "unauthorized_client"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable";

export interface TokenResponse {
  /** The access token of a successful token response. */
  access_token: string;
  /** The lifetime in seconds of the access token. */
  expires_in: number;
  /** The hosted domain the signed-in user belongs to. */
  hd?: string;
  /** The prompt value that was used from the possible list of values specified by TokenClientConfig or OverridableTokenClientConfig */
  prompt: string;
  /** The type of the token issued. */
  token_type: string;
  /** A space-delimited list of scopes that are approved by the user. */
  scope: string;
  /** The string value that your application uses to maintain state between your authorization request and the response. */
  state?: string;
  /** A single ASCII error code. */
  error?: ErrorCode;
  /**	Human-readable ASCII text providing additional information, used to assist the client developer in understanding the error that occurred. */
  error_description?: string;
  /** A URI identifying a human-readable web page with information about the error, used to provide the client developer with additional information about the error. */
  error_uri?: string;
}

export interface InitGoogleAuthParams {
  apiKey: string;
  clientId: string;
  discoveryDocs?: string[];
  decrypt?: (encrypted: string) => string;
}

export const onGoogleScriptLoad = (
  {  clientId, decrypt }: InitGoogleAuthParams,
  callback?: EmptyFunction
) => {
  google = (window as any).google;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: decrypt ? decrypt(clientId) : clientId,
    scope: SCOPES.join(" "),
    callback: "",
  });
  googleInitialized = true;
  if (callback) {
    callback();
  }
};

export const gapiLoadClient = async (
  { apiKey, clientId, discoveryDocs, decrypt }: InitGoogleAuthParams,
  callback?: EmptyFunction
) => {
  await gapi.client.init({
    apiKey: decrypt ? decrypt(apiKey) : apiKey,
    discoveryDocs,
  });
  apiInitialized = true;

  if (!googleInitialized) {
    const googleScript = document.createElement("script");
    googleScript.id = "googleScript";
    googleScript.src = "https://accounts.google.com/gsi/client";
    googleScript.onload = () => {
      onGoogleScriptLoad(
        { apiKey, clientId, discoveryDocs, decrypt },
        callback
      );
    };
    document.body.appendChild(googleScript);
  }
};

export const onGapiScriptLoad = (
  initGoogleAuthParams: InitGoogleAuthParams,
  callback?: EmptyFunction
) => {
  gapi = (window as any).gapi;
  gapi.load("client", () =>
    gapiLoadClient(initGoogleAuthParams, callback as EmptyFunction)
  );
};

export const initGoogleAuth = (
  initGoogleAuthParams: InitGoogleAuthParams,
  callback?: EmptyFunction
): void => {
  if (!apiInitialized) {
    const gapiScript = document.createElement("script");
    gapiScript.id = "gapiScript";
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      onGapiScriptLoad(initGoogleAuthParams, callback);
    };
    document.body.appendChild(gapiScript);
  }
};

export const authenticateUser = (
  tokenCallback: (token: TokenResponse) => void,
  tokenData?: TokenResponse
) => {
  tokenClient.callback = tokenCallback;
  const prompt = tokenData ? "none" : "consent";
  tokenClient.requestAccessToken({ prompt });
};

export const deauthenticateUser = async (
  signOutCallback: () => void,
  tokenData?: TokenResponse
) => {
  await signOutCallback();
  const token = tokenData || gapi.client.getToken();
  google.accounts.oauth2.revoke(token.access_token);
};

export const getTokenClient = () => {
  return tokenClient;
};

export const getApiClient = () => {
  return gapi && gapi.client;
};

export const getGoogle = () => {
  return google;
};

let logoutTimeout: any;

export const clearLogoutTimer = () => {
  clearTimeout(logoutTimeout);
};

export interface LogoutTimerProps {
  logoutCallback: EmptyFunction;
  autoRefresh?: boolean;
  sessionData: { [key: string]: any };
  timeout: number;
}

export const setLogoutTimer = ({
  logoutCallback,
  // autoRefresh = false,
  timeout,
}: LogoutTimerProps) => {
  // auto refresh doesn't work yet!
  // if (autoRefresh) {
  //   logoutTimeout = setTimeout(async () => {
  //     clearLogoutTimer();
  //     // const refreshResponse = await fetchRefreshToken(sessionData.refresh_token);
  //     const refreshResponse = {} as any; // todo: refresh token
  //     if (refreshResponse.error) {
  //       logoutCallback();
  //     } else {
  //       setLogoutTimer({
  //         logoutCallback,
  //         autoRefresh,
  //         timeout: refreshResponse.expires_in * 1000 - 1000 * 60 * 5,
  //         sessionData: refreshResponse,
  //       });
  //     }
  //   }, timeout - 1000 * 60 * 5);
  // } else {
    logoutTimeout = setTimeout(() => {
      logoutCallback();
      clearLogoutTimer();
    }, timeout);
  // }
};
