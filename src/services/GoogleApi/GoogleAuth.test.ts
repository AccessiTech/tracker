import {
  DISCOVERY_DOCS,
  SCOPES,
  initGoogleAuth,
  authenticateUser,
  deauthenticateUser,
  setLogoutTimer,
  getTokenClient,
  getApiClient,
  getGoogle,
  // clearLogoutTimer,
  LogoutTimerProps,
  onGapiScriptLoad,
  InitGoogleAuthParams,
  gapiLoadClient,
  onGoogleScriptLoad,
} from "./GoogleAuth";

jest.useFakeTimers();
// const acSpy = jest.spyOn(document.body, "appendChild");

const mockApiKey = "mockApiKey";
const mockClientId = "mockClientId";

(window as any).gapi = {
  load: jest.fn(),
  client: {
    init: jest.fn(),
    getToken: () => ({
      access_token: "mockAccessToken",
    }),
  },
};

(window as any).google = {
  accounts: {
    oauth2: {
      initTokenClient: () => ({
        requestAccessToken: jest.fn(),
      }),
      revoke: jest.fn(),
    },
  },
};

test("Discovery docs and scopes are defined correctly", () => {
  expect(DISCOVERY_DOCS).toBeDefined();
  expect(DISCOVERY_DOCS).not.toHaveLength(0);
  expect(SCOPES).toBeDefined();
  expect(SCOPES).not.toHaveLength(0);
  expect(DISCOVERY_DOCS.length).toBe(SCOPES.length);
});

test("gapiScript is added to the DOM", async () => {
  initGoogleAuth({
    apiKey: mockApiKey,
    clientId: mockClientId,
  });
  setTimeout(() => {
    const gapiScript: any = document.getElementById("gapiScript");
    expect(gapiScript).not.toBeNull();
    expect(gapiScript.src).toBe("https://apis.google.com/js/api.js");
  }, 20);
  jest.runOnlyPendingTimers();
});

test("gapi load client is called correctly", () => {
  onGapiScriptLoad({} as InitGoogleAuthParams);
  expect((window as any).gapi.load).toHaveBeenCalled();
});

test("gapi client init is called correctly", async () => {
  const mockDecrypt = jest.fn();

  await gapiLoadClient({
    apiKey: mockApiKey,
    clientId: mockClientId,
    discoveryDocs: DISCOVERY_DOCS,
    decrypt: mockDecrypt,
  });
  expect((window as any).gapi.client.init).toHaveBeenCalled();
  expect(mockDecrypt).toHaveBeenCalled();

  setTimeout(() => {
    const googleScript: any = document.getElementById("googleScript");
    expect(googleScript).not.toBeNull();
    expect(googleScript.src).toBe("https://accounts.google.com/gsi/client");
  });

  jest.runOnlyPendingTimers();
});

test("google script initializes token client and triggers callback", () => {
  const mockCallback = jest.fn();
  const mockDecrypt2 = jest.fn();
  const initTokenClientActual = (window as any).google.accounts.oauth2
    .initTokenClient;
  const initTokenClientSpy = jest.spyOn(
    (window as any).google.accounts.oauth2,
    "initTokenClient"
  );
  onGoogleScriptLoad(
    {
      apiKey: mockApiKey,
      clientId: mockClientId,
      decrypt: mockDecrypt2,
    },
    mockCallback
  );
  expect(initTokenClientSpy).toHaveBeenCalled();
  expect(mockDecrypt2).toHaveBeenCalled();
  expect(mockCallback).toHaveBeenCalled();
  (window as any).google.accounts.oauth2.initTokenClient =
    initTokenClientActual;
});

test("authenticateUser and deauthenticateUser work correctly", async () => {
  const mockTokenCallback = jest.fn();
  const mockSignOutCallback = jest.fn();
  const getTokenActual = (window as any).gapi.client.getToken;
  const getTokenSpy = jest.spyOn((window as any).gapi.client, "getToken");

  const tokenClient = getTokenClient();
  expect(tokenClient).toBeDefined();
  authenticateUser(mockTokenCallback);
  expect(tokenClient.callback).toBe(mockTokenCallback);
  expect(tokenClient.requestAccessToken).toHaveBeenCalled();

  await deauthenticateUser(mockSignOutCallback);
  expect(mockSignOutCallback).toHaveBeenCalled();
  expect(getTokenSpy).toHaveBeenCalled();
  expect((window as any).google.accounts.oauth2.revoke).toHaveBeenCalled();
  (window as any).gapi.client.getToken = getTokenActual;
});

test("getApiClient returns api client", () => {
  const apiClient = getApiClient();
  expect(apiClient).toBeDefined();
  expect(apiClient).toBe((window as any).gapi.client);
});

test("getGoogle returns google", () => {
  const google = getGoogle();
  expect(google).toBeDefined();
  expect(google).toBe((window as any).google);
});

test("setLogoutTimer executes callback function and clears timeout", () => {
  const mockCallback = jest.fn();
  setLogoutTimer({
    logoutCallback: mockCallback,
    timeout: 100,
    sessionData: {},
  } as LogoutTimerProps);
  setTimeout(() => {
    expect(mockCallback).toHaveBeenCalledTimes(1);
  }, 200);
  jest.runOnlyPendingTimers();
});
