import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Log } from "./initialStates";

export const logSliceName = "logs";

// Define the initial state using that type
export interface LogState {
  [logId: string]: Log;
}
export const initialState: LogState = {};

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
export const logSlice: Slice<any, SliceCaseReducers<any>, string> = createSlice(
  {
    name: logSliceName,
    initialState,
    reducers: {
      [ADD_LOG_ACTION]: (state, action) => {
        const { log } = action.payload;
        state[log.id] = log;
        state[log.id].createdAt = new Date().toISOString();
        state[log.id].updatedAt = state[log.id].createdAt;
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
        state[logId].entries[entry.id] = { ...entry };
        state[logId].entries[entry.id].createdAt = new Date().toISOString();
        state[logId].entries[entry.id].updatedAt = state[logId].entries[entry.id].createdAt;
      },
      [REMOVE_LOG_ENTRY_ACTION]: (state, action) => {
        const { logId, entryId } = action.payload;
        delete state[logId].entries[entryId];
        if (!state[logId].deletedEntries) {
          state[logId].deletedEntries = [];
        }
        state[logId].deletedEntries.push(entryId);
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
        state[logId].fields[field.id].updatedAt = state[logId].fields[field.id].createdAt;
      },
      [REMOVE_LOG_FIELD_ACTION]: (state, action) => {
        const { logId, fieldId } = action.payload;
        delete state[logId].fields[fieldId];
        if (!state[logId].deletedFields) {
          state[logId].deletedFields = [];
        }
        state[logId].deletedFields.push(fieldId);
      },
      [UPDATE_LOG_FIELD_ACTION]: (state, action) => {
        const { logId, fieldId, field } = action.payload;
        state[logId].fields[fieldId] = {
          ...field,
          updatedAt: new Date().toISOString(),
        };
      },
    },
  }
);

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

export const getLog = (state: any, logId: string) => state[logSliceName][logId];

export const getLogEntries = (state: any, logId: string) => {
  const log = getLog(state, logId);
  return log?.entries;
}

export const getLogEntry = (state: any, logId: string, entryId: string) => {
  const entries = getLogEntries(state, logId);
  return entries?.[entryId];
}

export const getLogFields = (state: any, logId: string) => {
  const log = getLog(state, logId);
  return log?.fields;
}

export const getLogField = (state: any, logId: string, fieldId: string) => {
  const fields = getLogFields(state, logId);
  return fields?.[fieldId];
}
