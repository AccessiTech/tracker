import { v4 as uuidv4 } from "uuid";
import {
  createFolder,
  createSpreadsheet,
  getSheetValues,
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
  console.log("syncId: ", syncId);

  if (!selectedLogSheet) {
    const newSheetData = {
      syncId,
      dateCreated: new Date().toISOString(),
    };

    return setSheetValues({
      sheetId: spreadsheetId,
      range: "A1",
      values: [Object.keys(newSheetData), Object.values(newSheetData)],
    })
      .then((result: any) => {
        if (result.status !== 200 || !result.body) {
          throw new Error("Error updating sheet");
        }
        return JSON.parse(result.body);
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
    range: "A2",
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
