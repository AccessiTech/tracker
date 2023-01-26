import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EMPTY } from "../../strings";

// Magic String Constants
export const dataSyncSliceName = "dataSync";
export const GOOGLE_DRIVE = "googleDrive";

// State Interfaces
export interface LogSheet {
  id: string;
  name: string;
}

export enum SyncFrequency {
  HOURLY = "HOURLY",
  EVERY_6_HOURS = "EVERY_6_HOURS",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  CUSTOM = "CUSTOM",
}

export interface SyncSettings {
  onLogin: boolean;
  onLogout: boolean;
  onLogView: boolean;
  onLogEditView: boolean;
  onAddNewLog: boolean;
  onEditLog: boolean;
  onAddEntry: boolean;
  onEditEntry: boolean;
  onAddField: boolean;
  onEditField: boolean;
  // syncFrequency: SyncFrequency;
  // customSyncFrequency: number;
}

export const defaultSyncSettings: SyncSettings = {
  onLogin: true,
  onLogout: true,
  onLogView: true,
  onLogEditView: true,
  onAddNewLog: true,
  onEditLog: true,
  onAddEntry: true,
  onEditEntry: true,
  onAddField: true,
  onEditField: true,
  // syncFrequency: SyncFrequency.HOURLY,
  // customSyncFrequency: 1,
};

export interface DataSyncState {
  syncEnabled: boolean;
  syncMethod: typeof GOOGLE_DRIVE;
  syncId: string;
  googleDrive: {
    folderId: string;
    logSheetId: string;
    logSheets: { [logId: string]: LogSheet };
  };
  syncSettings: SyncSettings;
}

// Initial State
export const initialState: DataSyncState = {
  syncEnabled: false,
  syncMethod: GOOGLE_DRIVE,
  syncId: EMPTY,
  googleDrive: {
    folderId: EMPTY,
    logSheetId: EMPTY,
    logSheets: {},
  },
  syncSettings: defaultSyncSettings,
};

// Action Types
export const SET_ENABLE_SYNC = "dataSync/setEnableSync";
export const RESET_SYNC = "dataSync/resetSync";
export const SET_SYNC_METHOD = "dataSync/setSyncMethod";
export const Set_SYNC_ID = "dataSync/setSyncId";
export const SET_GOOGLE_DRIVE_FOLDER_ID = "dataSync/setGoogleDriveFolderId";
export const SET_GOOGLE_DRIVE_LOG_SHEET_ID =
  "dataSync/setGoogleDriveLogSheetId";
export const SET_GOOGLE_DRIVE_LOG_SHEETS = "dataSync/setGoogleDriveLogSheets";
export const ADD_GOOGLE_DRIVE_LOG_SHEET = "dataSync/addGoogleDriveLogSheet";
export const REMOVE_GOOGLE_DRIVE_LOG_SHEET =
  "dataSync/removeGoogleDriveLogSheet";
export const EDIT_SYNC_SETTINGS = "dataSync/editSyncSettings";
export const RESET_SYNC_SETTINGS = "dataSync/resetSyncSettings";

// Reducer
export const dataSyncSlice: Slice<
  any,
  SliceCaseReducers<any>,
  string
> = createSlice({
  name: dataSyncSliceName,
  initialState,
  reducers: {
    [SET_ENABLE_SYNC]: (state, action) => {
      state.syncEnabled = action.payload;
    },
    [RESET_SYNC]: (state) => {
      const { syncEnabled, syncMethod, syncId, googleDrive } = initialState;
      const { folderId, logSheetId, logSheets } = googleDrive;
      state.syncEnabled = syncEnabled;
      state.syncMethod = syncMethod;
      state.syncId = syncId;
      state.googleDrive.folderId = folderId;
      state.googleDrive.logSheetId = logSheetId;
      state.googleDrive.logSheets = logSheets;
    },
    [SET_SYNC_METHOD]: (state, action) => {
      const { syncMethod } = action.payload;
      state.syncMethod = syncMethod;
    },
    [Set_SYNC_ID]: (state, action) => {
      const { syncId } = action.payload;
      state.syncId = syncId;
    },
    [SET_GOOGLE_DRIVE_FOLDER_ID]: (state, action) => {
      const { folderId } = action.payload;
      state.googleDrive.folderId = folderId;
    },
    [SET_GOOGLE_DRIVE_LOG_SHEET_ID]: (state, action) => {
      const { logSheetId } = action.payload;
      state.googleDrive.logSheetId = logSheetId;
    },
    [SET_GOOGLE_DRIVE_LOG_SHEETS]: (state, action) => {
      const { logSheets } = action.payload;
      state.googleDrive.logSheets = logSheets;
    },
    [ADD_GOOGLE_DRIVE_LOG_SHEET]: (state, action) => {
      state.googleDrive.logSheets = {
        ...state.googleDrive.logSheets,
        ...action.payload,
      };
    },
    [REMOVE_GOOGLE_DRIVE_LOG_SHEET]: (state, action) => {
      const { logSheetId } = action.payload;
      delete state.googleDrive.logSheets[logSheetId];
    },
    [EDIT_SYNC_SETTINGS]: (state, action) => {
      state.syncSettings = action.payload;
    },
    [RESET_SYNC_SETTINGS]: (state) => {
      state.syncSettings = defaultSyncSettings;
    },
  },
});

// Action Creators
export const setEnableSync = dataSyncSlice.actions[SET_ENABLE_SYNC];
export const resetSync = dataSyncSlice.actions[RESET_SYNC];
export const setSyncMethod = dataSyncSlice.actions[SET_SYNC_METHOD];
export const setSyncId = dataSyncSlice.actions[Set_SYNC_ID];
export const setGoogleDriveFolderId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_FOLDER_ID];
export const setGoogleDriveLogSheetId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEET_ID];
export const setGoogleDriveLogSheets =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEETS];
export const addGoogleDriveLogSheet =
  dataSyncSlice.actions[ADD_GOOGLE_DRIVE_LOG_SHEET];
export const removeGoogleDriveLogSheet =
  dataSyncSlice.actions[REMOVE_GOOGLE_DRIVE_LOG_SHEET];
export const editSyncSettings = dataSyncSlice.actions[EDIT_SYNC_SETTINGS];
export const resetSyncSettings = dataSyncSlice.actions[RESET_SYNC_SETTINGS];

// Hooks
export const useDataSync = (): DataSyncState => {
  return useSelector((state: any) => state[dataSyncSliceName]) || initialState;
};

export const useSyncEnabled = (): boolean => {
  const dataSync = useDataSync();
  return dataSync.syncEnabled;
};

export const useSyncId = (): string => {
  const dataSync = useDataSync();
  return dataSync.syncId;
};

export const useSyncMethod = (): typeof GOOGLE_DRIVE => {
  const dataSync = useDataSync();
  return dataSync.syncMethod;
};
export const useGoogleDrive = (): DataSyncState[typeof GOOGLE_DRIVE] => {
  const dataSync = useDataSync();
  return dataSync.googleDrive;
};

export const useGoogleDriveFolderId = (): string => {
  const googleDrive = useGoogleDrive();
  return googleDrive.folderId;
};

export const useGoogleDriveLogSheetId = (): string => {
  const googleDrive = useGoogleDrive();
  return googleDrive.logSheetId;
};

export const useGoogleDriveLogSheets = (): { [logId: string]: LogSheet } => {
  const googleDrive = useGoogleDrive();
  return googleDrive.logSheets;
};

export const useGoogleDriveLogSheet = (id: string): LogSheet => {
  const { logSheets } = useGoogleDriveLogSheets();
  return (logSheets as any)[id] || {};
};

export const useSyncSettings = (): SyncSettings => {
  const dataSync = useDataSync();
  return dataSync.syncSettings;
};
