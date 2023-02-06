import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const sessionSliceName = "session";

export interface SessionData {
  [key: string]: any;
}

export interface SessionState {
  data: SessionData;
  authenticated: boolean;
  expiresAt: number;
  autoRefresh: boolean;
}

export const initialState: SessionState = {
  authenticated: false,
  expiresAt: 0,
  autoRefresh: false,
  data: {},
};

export const AUTHENTICATE = "session/authenticate";
export const DEAUTHENTICATE = "session/deauthenticate";
export const UPDATE_AUTHENTICATION = "session/updateAuthentication";

export const sessionSlice: Slice<
  any,
  SliceCaseReducers<any>,
  string
> = createSlice({
  name: sessionSliceName,
  initialState,
  reducers: {
    [AUTHENTICATE]: (state, action) => {
      const { data, expiresAt, autoRefresh } = action.payload;
      state.authenticated = true;
      state.data = data;
      state.expiresAt = expiresAt;
      state.autoRefresh = autoRefresh;
    },
    [DEAUTHENTICATE]: (state) => {
      state.authenticated = false;
      state.data = {};
      state.expiresAt = 0;
      state.autoRefresh = false;
    },
    [UPDATE_AUTHENTICATION]: (state, action) => {
      const { data } = action.payload;
      state.data = data;
    },
  },
});

export const authenticate = sessionSlice.actions[AUTHENTICATE];
export const deauthenticate = sessionSlice.actions[DEAUTHENTICATE];
export const updateAuthentication = sessionSlice.actions[UPDATE_AUTHENTICATION];

export const useSession = (): SessionState => {
  return useSelector((state: any) => state[sessionSliceName]);
};

export const useAuthenticated = (): boolean => {
  const session = useSession();
  return session.authenticated;
};

export const useSessionData = (): { [key: string]: any } | undefined => {
  const session = useSession();
  return session.data;
};

export const useSessionExpiresAt = (): number => {
  const session = useSession();
  return session.expiresAt;
};

export const useSessionAutoRefresh = (): boolean => {
  const session = useSession();
  return session.autoRefresh;
};

// Selectors

export const getSession = (state: any): SessionState => {
  return state[sessionSliceName];
};

export const getAuthenticated = (state: any): boolean => {
  return getSession(state).authenticated;
};

export const getSessionData = (state: any): SessionData | undefined => {
  return getSession(state).data;
};

export const getSessionExpiresAt = (state: any): number => {
  return getSession(state).expiresAt;
};

export const getSessionAutoRefresh = (state: any): boolean => {
  return getSession(state).autoRefresh;
};
