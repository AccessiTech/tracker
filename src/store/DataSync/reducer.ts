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
  googleDrive: {
    folderId: EMPTY,
    logSheetId: EMPTY,
    logSheets: {},
  },
};

// Action Types
export const TOGGLE_SYNC = "dataSync/toggleSync";
export const SET_SYNC_METHOD = "dataSync/setSyncMethod";
export const SET_GOOGLE_DRIVE_FOLDER_ID = "dataSync/setGoogleDriveFolderId";
export const SET_GOOGLE_DRIVE_LOG_SHEET_ID =
  "dataSync/setGoogleDriveLogSheetId";
export const SET_GOOGLE_DRIVE_LOG_SHEET = "dataSync/setGoogleDriveLogSheet";

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
    [SET_SYNC_METHOD]: (state, action) => {
      const { syncMethod } = action.payload;
      state.syncMethod = syncMethod;
    },
    [SET_GOOGLE_DRIVE_FOLDER_ID]: (state, action) => {
      const { folderId } = action.payload;
      state.googleDrive.folderId = folderId;
    },
    [SET_GOOGLE_DRIVE_LOG_SHEET_ID]: (state, action) => {
      const { logSheetId } = action.payload;
      state.googleDrive.logSheetId = logSheetId;
    },
    [SET_GOOGLE_DRIVE_LOG_SHEET]: (state, action) => {
      const { logSheet } = action.payload;
      state.googleDrive.logSheets[logSheet.id] = logSheet;
    },
  },
});

// Action Creators
export const toggleSync = dataSyncSlice.actions[TOGGLE_SYNC];
export const setSyncMethod = dataSyncSlice.actions[SET_SYNC_METHOD];
export const setGoogleDriveFolderId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_FOLDER_ID];
export const setGoogleDriveLogSheetId =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEET_ID];
export const setGoogleDriveLogSheet =
  dataSyncSlice.actions[SET_GOOGLE_DRIVE_LOG_SHEET];


// Hooks
export const useDataSync = (): DataSyncState => {
  return useSelector((state: any) => state[dataSyncSliceName]) || initialState;
};

export const useSyncEnabled = (): boolean => {
  const dataSync = useDataSync();
  return dataSync.syncEnabled;
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
