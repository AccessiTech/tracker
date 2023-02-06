export {
  // Slice
  sessionSlice,
  sessionSliceName,

  // Actions
  authenticate,
  deauthenticate,
  updateAuthentication,

  // Hooks
  useSession,
  useAuthenticated,
  useSessionData,
  useSessionExpiresAt,
  useSessionAutoRefresh,

  // Selectors
  getSession,
  getAuthenticated,
  getSessionAutoRefresh,
  getSessionData,
  getSessionExpiresAt,

  // Strings
  AUTHENTICATE,
  DEAUTHENTICATE,
  UPDATE_AUTHENTICATION,
} from "./reducer";

export type {
  SessionState,
  // SessionUser,
} from "./reducer";
