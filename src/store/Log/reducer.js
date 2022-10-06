import { createSlice } from "@reduxjs/toolkit";

export const logSliceName = "logs";

// Define the initial state using that type
export const initialState = {};

// Define the action name strings
export const ADD_LOG_ACTION = "log/add";
export const REMOVE_LOG_ACTION = "log/remove";
export const UPDATE_LOG_ACTION = "log/update";
export const ADD_LOG_ENTRY_ACTION = "entry/add";
export const REMOVE_LOG_ENTRY_ACTION = "entry/remove";
export const UPDATE_LOG_ENTRY_ACTION = "entry/update";
export const ADD_LOG_FIELD_ACTION = "field/add";
export const REMOVE_LOG_FIELD_ACTION = "field/remove";
export const UPDATE_LOG_FIELD_ACTION = "field/update";

// Define the slice
export const logSlice = createSlice({
  name: logSliceName,
  initialState,
  reducers: {
    [ADD_LOG_ACTION]: (state, action) => {
      const { log } = action.payload;
      state[log.id] = log;
      state[log.id].createdAt = new Date().toISOString();
    },
    [REMOVE_LOG_ACTION]: (state, action) => {
      const { logId } = action.payload;
      delete state[logId];
    },
    [UPDATE_LOG_ACTION]: (state, action) => {
      const { logId, log } = action.payload;
      state[logId] = { 
        ...state[logId],
        ...log,
        updatedAt: new Date().toISOString(),
      };
    },
    [ADD_LOG_ENTRY_ACTION]: (state, action) => {
      const { logId, entry } = action.payload;
      state[logId].entries[entry.id] = entry;
      state[logId].entries[entry.id].createdAt = new Date().toISOString();
    },
    [REMOVE_LOG_ENTRY_ACTION]: (state, action) => {
      const { logId, entryId } = action.payload;
      delete state[logId].entries[entryId];
    },
    [UPDATE_LOG_ENTRY_ACTION]: (state, action) => {
      const { logId, entryId, entry } = action.payload;
      state[logId].entries[entryId] = {
        ...state[logId].entries[entryId],
        ...entry,
        updatedAt: new Date().toISOString(),
      };
    },
    [ADD_LOG_FIELD_ACTION]: (state, action) => {
      const { logId, field } = action.payload;
      state[logId].fields[field.id] = field;
      state[logId].fields[field.id].createdAt = new Date().toISOString();
    },
    [REMOVE_LOG_FIELD_ACTION]: (state, action) => {
      const { logId, fieldId } = action.payload;
      delete state[logId].fields[fieldId];
    },
    [UPDATE_LOG_FIELD_ACTION]: (state, action) => {
      const { logId, fieldId, field } = action.payload;
      state[logId].fields[fieldId] = {
        ...state[logId].fields[fieldId],
        ...field,
        updatedAt: new Date().toISOString(),
      };
    },
  },
});

// Extract the action creators object and the reducer
export const addLog = logSlice.actions[ADD_LOG_ACTION];
export const removeLog = logSlice.actions[REMOVE_LOG_ACTION];
export const updateLog = logSlice.actions[UPDATE_LOG_ACTION];
export const addLogEntry = logSlice.actions[ADD_LOG_ENTRY_ACTION];
export const removeLogEntry = logSlice.actions[REMOVE_LOG_ENTRY_ACTION];
export const updateLogEntry = logSlice.actions[UPDATE_LOG_ENTRY_ACTION];
export const addLogField = logSlice.actions[ADD_LOG_FIELD_ACTION];
export const removeLogField = logSlice.actions[REMOVE_LOG_FIELD_ACTION];
export const updateLogField = logSlice.actions[UPDATE_LOG_FIELD_ACTION];

