import { createSlice } from "@reduxjs/toolkit";

export const logSliceName = "log";

// Define the initial state using that type
const initialState = {
  logs: {},
};

// Define the slice
export const logSlice = createSlice({
  name: logSliceName,
  initialState,
  reducers: {
    addLog: (state, action) => {
      const { log } = action.payload;
      state.logs[log.id] = log;
    },
    removeLog: (state, action) => {
      const { logId } = action.payload;
      delete state.logs[logId];
    }
  },
});

// Extract the action creators object and the reducer
export const { addLog, removeLog } = logSlice.actions;
