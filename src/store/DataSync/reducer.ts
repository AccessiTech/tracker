import { createSlice, Slice, SliceCaseReducers } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EMPTY } from "../../strings";

// Magic String Constants
export const dataSyncSliceName = "dataSync";
export const GOOGLE_DRIVE = "googleDrive";

// State Interfaces
export interface LogSheet {
  id: string;
  fieldsSheetId: string;
  entriesSheetId: string;
}

export interface DataSyncState {
  syncEnabled: boolean;
  syncMethod: typeof GOOGLE_DRIVE;
  syncId: string;
  googleDrive: {
    folderId: string;
    logSheetId: string;
    logSheets: { [key: string]: LogSheet };
  };
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
};

// Action Types
export const TOGGLE_SYNC = "dataSync/toggleSync";
export const RESET_SYNC = "dataSync/resetSync";
export const SET_SYNC_METHOD = "dataSync/setSyncMethod";
export const Set_SYNC_ID = "dataSync/setSyncId";
export const SET_GOOGLE_DRIVE_FOLDER_ID = "dataSync/setGoogleDriveFolderId";
export const SET_GOOGLE_DRIVE_LOG_SHEET_ID =
  "dataSync/setGoogleDriveLogSheetId";
export const SET_GOOGLE_DRIVE_LOG_SHEETS = "dataSync/setGoogleDriveLogSheets";

// Reducer
export const dataSyncSlice: Slice<
  any,
  SliceCaseReducers<any>,
  string
> = createSlice({
  name: dataSyncSliceName,
  initialState,
  reducers: {
    [TOGGLE_SYNC]: (state) => {
      state.syncEnabled = !state.syncEnabled;
    },
    [RESET_SYNC]: (state) => {
      const { syncEnabled, syncMethod, syncId, googleDrive } = initialState;
      const { folderId, logSheetId, logSheets } = googleDrive;
      state.syncEnabled = syncEnabled;
      state.syncMethod = syncMethod;
      state.syncId = syncId;
      state.googleDrive.folderId = folderId;
      state.googleDrive.logSheetId = logSheetId;
      state.googleDrive.logSheets =logSheets;
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
      const { logSheet } = action.payload;
      state.googleDrive.logSheets[logSheet.id] = logSheet;
    },
  },
});

// Action Creators
export const toggleSync = dataSyncSlice.actions[TOGGLE_SYNC];
export const resetSync = dataSyncSlice.actions[RESET_SYNC];
export const setSyncMethod = dataSyncSlice.actions[SET_SYNC_METHOD];
export const setSyncId = dataSyncSlice.actions[Set_SYNC_ID];
export const setGoogleDriveFolderId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_FOLDER_ID];
export const setGoogleDriveLogSheetId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEET_ID];
export const setGoogleDriveLogSheets =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEETS];


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

export const useGoogleDriveLogSheets = (): { [key: string]: LogSheet } => {
  const googleDrive = useGoogleDrive();
  return googleDrive.logSheets;
};

export const useGoogleDriveLogSheet = (id: string): LogSheet => {
  const googleDrive = useGoogleDrive();
  return googleDrive.logSheets[id] || ({} as LogSheet);
};