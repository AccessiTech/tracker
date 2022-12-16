export const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
export const SCOPES = ["https://www.googleapis.com/auth/drive"];

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
}

export const initGoogleAuth = ({
  apiKey,
  clientId,
  discoveryDocs = [DISCOVERY_DOC],
}: InitGoogleAuthParams): void => {
  if (!apiInitialized) {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      gapi = (window as any).gapi;
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey,
          discoveryDocs,
        });
        apiInitialized = true;

        if (!googleInitialized) {
          const googleScript = document.createElement("script");
          googleScript.src = "https://accounts.google.com/gsi/client";
          googleScript.onload = () => {
            google = (window as any).google;
            tokenClient = google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: SCOPES.join(" "),
              callback: "",
            });
            googleInitialized = true;
          };
          document.body.appendChild(googleScript);
        }
      });
    };
    document.body.appendChild(gapiScript);
  }
};

export const authenticateUser = (
  tokenCallback: (token: TokenResponse) => void
) => {
  tokenClient.callback = tokenCallback;
  tokenClient.requestAccessToken({ prompt: "consent" });
};

export const deauthenticateUser = (
  signOutCallback: () => void
) => {
  const token = gapi.client.getToken();
  google.accounts.oauth2.revoke(token.access_token);
  signOutCallback();
};

export const getTokenClient = () => {
  return tokenClient;
};
