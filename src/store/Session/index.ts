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

  // Strings
  AUTHENTICATE,
  DEAUTHENTICATE,
  UPDATE_AUTHENTICATION,
} from "./reducer";

export type {
  SessionState,
  // SessionUser,
} from "./reducer";
