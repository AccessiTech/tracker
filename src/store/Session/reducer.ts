import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const sessionSliceName = "session";

export interface SessionState {
  data?: { [key: string]: any };
  authenticated: boolean;
  expiresAt: number;
}

export const initialState: SessionState = {
  authenticated: false,
  expiresAt: 0,
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
      const { data, expiresAt } = action.payload;
      state.authenticated = true;
      state.data = data;
      state.expiresAt = expiresAt;
    },
    [DEAUTHENTICATE]: (state) => {
      state.authenticated = false;
      state.data = undefined;
      state.expiresAt = 0;
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
