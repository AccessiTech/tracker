import { v4 as uuidv4 } from "uuid";
import {
  createFolder,
  createSpreadsheet,
  getSheetValues,
  setSheetName,
  setSheetValues,
} from "../../components/GoogleApi";

export interface InitDataSyncProps {
  onError: (error: any) => void;
  selectedFolder?: string;
  selectedLogSheet?: string;
}

export interface InitDataSyncResponse {
  folderId: string;
  logSheetId: string;
  syncId: string;
}

export const initDataSync = async ({
  onError,
  selectedFolder,
  selectedLogSheet,
}: InitDataSyncProps):Promise<InitDataSyncResponse> => {
  const newFolderId =
    selectedFolder ||
    (await createFolder({
      name: "Tracker Keeper Data",
    })
      .then((result: any) => {
        if (!result.body) {
          throw new Error("Error creating folder");
        }
        return JSON.parse(result.body).id;
      })
      .catch((err: any) => {
        console.log("Error creating folder: ");
        onError(err?.result?.error);
      }));
  if (!newFolderId) {
    throw new Error("Error creating folder");
  }
  

  const spreadsheetId =
    selectedLogSheet ||
    (await createSpreadsheet({
      name: "Tracker Keeper Data",
      parents: [newFolderId],
    })
      .then((result: any) => {
        if (!result.body) {
          throw new Error("Error creating spreadsheet");
        }
        return JSON.parse(result.body).id;
      })
      .catch((err: any) => {
        console.log("Error creating primary spreadsheet: ");
        onError(err?.result?.error);
      }));

  if (!spreadsheetId) {
    throw new Error("Error creating log spreadsheet");
  }
  

  let syncId = selectedLogSheet
    ? await getSheetValues({
        sheetId: spreadsheetId,
        range: "A2",
      })
    : uuidv4();
  if (syncId instanceof Array) {
    syncId = syncId[0][0];
  }

  if (!selectedLogSheet) {
    const newSheetData = {
      syncId,
      dateCreated: new Date().toISOString(),
    } as any;

    const newSheetValues = [];
    for (const key in newSheetData) {
      if (Object.prototype.hasOwnProperty.call(newSheetData, key)) {
        newSheetValues.push([key, newSheetData[key]]);
      }
    }

    const renameResponse = await setSheetName({
      sheetId: spreadsheetId,
      sheetName: "Metadata",
    })
      .catch((err: any) => {
        console.log("Error renaming sheet: ");
        onError(err?.result?.error);
      });
    if (!renameResponse) {
      throw new Error("Error renaming sheet");
    }

    return setSheetValues({
      sheetId: spreadsheetId,
      range: "Metadata!A1",
      values: newSheetValues,
    })
      .then(() => ({
        folderId: newFolderId,
        logSheetId: spreadsheetId,
        syncId,
      }))
      .catch((err: any) => {
        console.log("Error updating sheet: ");
        onError(err?.result?.error);
      });
  }
  
  return {
    folderId: newFolderId,
    logSheetId: spreadsheetId,
    syncId,
  };
};

export interface ConnectDataSyncProps {
  onError: (error: any) => void;
  selectedFolder: string;
  selectedLogSheet: string;
}
export const connectDataSync = async ({
  onError,
  selectedFolder,
  selectedLogSheet,
}: ConnectDataSyncProps): Promise<InitDataSyncResponse> => {
  const folderId = selectedFolder;
  const logSheetId = selectedLogSheet;
  const syncId = await getSheetValues({
    sheetId: logSheetId,
    range: "Metadata!B1",
  }).then((result: any) => result[0][0])
  .catch((err: any) => {
    console.log("Error getting syncId: ");
    onError(err?.result?.error);
  });
  if (!syncId) throw new Error("Error getting syncId");
  return {
    folderId,
    logSheetId,
    syncId,
  };
};

export interface UpdateDataSyncProps {
  onError: (error: any) => void;
  folderId: string;
  logSheetId: string;
  syncId: string;
  data: any;
}
export const updateDataSync = async ({
  onError,
  folderId,
  logSheetId,
  syncId,
  data,
}: UpdateDataSyncProps): Promise<void> => {
  const newSheetData = {
    syncId,
    dateUpdated: new Date().toISOString(),
    ...data,
  } as any;

  const newSheetValues = [];
  for (const key in newSheetData) {
    if (Object.prototype.hasOwnProperty.call(newSheetData, key)) {
      newSheetValues.push([key, newSheetData[key]]);
    }
  }

  return setSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A1",
    values: newSheetValues,
  })
    .then(() => ({
      folderId,
      logSheetId,
      syncId,
    }))
    .catch((err: any) => {
      console.log("Error updating sheet: ");
      onError(err?.result?.error);
    });
}

export interface SetLogsToSyncProps {
  onError: (error: any) => void;
  folderId: string;
  logSheetId: string;
  syncId: string;
  logs: string[];
}

export const setLogsToSync = async ({
  onError,
  folderId,
  logSheetId,
  syncId,
  logs,
}: SetLogsToSyncProps): Promise<void> => {

  const existingSheetData = await getSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A:B",
  }).then((result: []) => {
    const data = {};
    for (const row of result) {
      data[row[0]] = row[1];
    }
    return data;
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });

  // if (existingSheetData.syncId !== syncId) throw new Error("Sync ID mismatch");

  const newSheetData = {
    ...existingSheetData,
    syncId,
    dateUpdated: new Date().toISOString(),
    logs: JSON.stringify(logs),
  } as any;

  const newSheetValues = [];
  for (const key in newSheetData) {
    if (Object.prototype.hasOwnProperty.call(newSheetData, key)) {
      newSheetValues.push([key, newSheetData[key]]);
    }
  }

  return setSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A1",
    values: newSheetValues,
  })
    .then(() => ({
      folderId,
      logSheetId,
      syncId,
    }))
    .catch((err: any) => {
      console.log("Error updating sheet: ");
      throw onError(err?.result?.error);
    });
};

export interface GetLogsToSyncProps {
  onError: (error: any) => void;
  logSheetId: string;
  syncId: string;
}

export const getLogsToSync = async ({
  onError,
  logSheetId,
}: GetLogsToSyncProps): Promise<string[]> => {
  const existingSheetData = await getSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A:B",
  }).then((result: []) => {
    const data = {};
    for (const row of result) {
      data[row[0]] = row[1];
    }
    return data as any;
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });

  // if (existingSheetData.syncId !== syncId) throw new Error("Sync ID mismatch");

  const logs = JSON.parse(existingSheetData.logs);
  return logs;
}
