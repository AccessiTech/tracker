import { v4 as uuidv4 } from "uuid";
import {
  createFolder,
  createSpreadsheet,
  getSheetValues,
  setSheetName,
  setSheetValues,
} from "../../components/GoogleApi";
import { Log, LogEntry, LogFields } from "../../store/Log";

/** ***** Initialize New Data Sync ****** */
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
      sheetIds: '[]',
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
        sheetIds: {},
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

/** ***** Connect to Existing Data Sync ****** */
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

/** ***** Update an Existing Data Sync ****** */
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

/** ***** Set Logs in a Data Sync ****** */
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

/** ***** Get Logs from a Data Sync ****** */
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


/** ***** Get Log Sheet IDs from Data Sync ****** */
export interface GetLogSheetIdsProps {
  onError: (error: any) => void;
  logSheetId: string;
  syncId: string;
}
export const getLogSheetIds = async ({
  onError,
  logSheetId,
}: GetLogSheetIdsProps): Promise<{[key:string] : string}> => {
  return getSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A:B",
  }).then((result: []) => {
    const data = {};
    for (const row of result) {
      data[row[0]] = row[1];
    }
    return data as any;
  }).then((existingSheetData: any) => {
    return JSON.parse(existingSheetData.logSheetIds || {});
  })
  .catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Sheet IDs in a Data Sync ****** */
export interface SetLogSheetIdsProps {
  onError: (error: any) => void;
  folderId: string;
  logSheetId: string;
  syncId: string;
  logSheetIds: { [key: string]: string };
}
export const setLogSheetIds = async ({
  onError,
  folderId,
  logSheetId,
  syncId,
  logSheetIds,
}: SetLogSheetIdsProps): Promise<void> => {
  
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
      logSheetIds: JSON.stringify(logSheetIds),
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
        logSheetIds: JSON.stringify(logSheetIds),
      }))
      .catch((err: any) => {
        console.log("Error updating sheet: ");
        throw onError(err?.result?.error);
      });
}

/** ***** Init New Log Sheet ****** */
export interface InitNewLogSheetProps {
  onError: (error: any) => void;
  folderId: string;
  log: Log,
  syncId: string;
}
export const initNewLogSheet = async ({
  onError,
  folderId,
  log,
  syncId,
}: InitNewLogSheetProps): Promise<any> => {
  const logSheetId = await createSpreadsheet({
    parents: [folderId],
    name: log.name,
  }).catch((err: any) => {
    console.log("Error creating new Log sheet: ");
    throw onError(err?.result?.error);
  });

  const newSheetData = {
    syncId,
    logId: log.id,
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
  } as any;

  const newSheetValues = [];
  for (const key in newSheetData) {
    if (Object.prototype.hasOwnProperty.call(newSheetData, key)) {
      newSheetValues.push([key, newSheetData[key]]);
    }
  }
  const renameResponse = await setSheetName({
    sheetId: logSheetId,
    sheetName: ["Entries", "Fields", "Metadata"],
  }).catch((err: any) => {
    console.log("Error renaming Log sheet: ");
    onError(err?.result?.error);
  });
  if (!renameResponse) {
    throw new Error("Error renaming Log sheet");
  }

  const fieldIds = Object.keys(log.fields);
  const fieldNames = fieldIds.map((id) => log.fields[id].name);
  const fieldHeaders = [
    // basic field info
    "id", "name", "type", "required", "option", "typeOption", "typeOptionStrings", "defaultValue",
    // field specific info
    "min", "max", "step", "unit", "truelabel", "falseLabel", "options",
    // CRUD info
    "createdAt", "updatedAt"
  ];

  return Promise.all([
    setSheetValues({
      sheetId: logSheetId,
      range: "Metadata!A1",
      values: newSheetValues,
    }),
    setSheetValues({
      sheetId: logSheetId,
      range: "Fields!A1",
      values: [fieldHeaders],
    }),
    setSheetValues({
      sheetId: logSheetId,
      range: "Entries!A1",
      values: [
        [...fieldIds, "createdAt", "updatedAt"],
        [...fieldNames, "createdAt", "updatedAt"],
      ],
    }),
  ]).catch((err: any) => {
    console.log("Error updating log sheet: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Get Log Fields from a Log Sheet ****** */
export interface GetLogFieldsProps {
  onError: (error: any) => void;
  logSheetId: string;
  syncId: string;
}
export const getLogFields = async ({
  onError,
  logSheetId,
}: GetLogFieldsProps): Promise<LogFields[]> => {
  return getSheetValues({
    sheetId: logSheetId,
    range: "Fields!A:ZZ",
  }).then((result: any[]) => {
    const headerRow = result[0];
    const data = [] as any;
    for (let i = 1; i < result.length; i++) {
      const row = result[i];
      const field = {} as any;
      for (const prop of headerRow) {
        field[prop] = JSON.parse(row[headerRow.indexOf(prop)]);
      }
      data.push(field);
    }
    return data as LogFields[];
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Fields in a Log Sheet ****** */
export interface SetLogFieldsProps {
  onError: (error: any) => void;
  logSheetId: string;
  logFields: { [key: string]: LogFields };
}
export const setLogFields = async ({
  onError,
  logSheetId,
  logFields,
}: SetLogFieldsProps): Promise<any> => {
  const fieldIds = Object.keys(logFields);

  const fieldHeaders = [
    // basic field info
    "id", "name", "type", "required", "option", "typeOption", "typeOptionStrings", "defaultValue",
    // field specific info
    "min", "max", "step", "unit", "truelabel", "falseLabel", "options",
    // CRUD info
    "createdAt", "updatedAt"
  ];

  const fields = fieldIds.map((id) => {
    const field = logFields[id];
    return fieldHeaders.map((prop) => JSON.stringify((field as any)[prop]));
  });

  return Promise.all([
    setSheetValues({
      sheetId: logSheetId,
      range: "Fields!A1",
      values: fields,
    }),
  ]).catch((err: any) => {
    console.log("Error updating log sheet: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Get Log Entries from a Log Sheet ****** */
export interface GetLogEntriesProps {
  onError: (error: any) => void;
  logSheetId: string;
  logId: string;
}

export const getLogEntries = async ({
  onError,
  logSheetId,
  logId,
}: GetLogEntriesProps): Promise<LogEntry[]> => {
  return getSheetValues({
    sheetId: logSheetId,
    range: "Entries!A:ZZ",
  }).then((result: any[]) => {
    const headerRow = result[0];
    const data = [] as LogEntry[];
    for (let i = 2; i < result.length; i++) {
      const row = result[i];
      const entry = {
        id: row[headerRow.indexOf("id")],
        log: logId,
        user: "",
        createdAt: row[headerRow.indexOf("createdAt")],
        updatedAt: row[headerRow.indexOf("updatedAt")],
        values: {},
      } as LogEntry;
      for (const prop of headerRow) {
        if (prop === "id" || prop === "createdAt" || prop === "updatedAt") {
          continue;
        }
        entry.values[prop] = JSON.parse(row[headerRow.indexOf(prop)]);
      }
      data.push(entry);
    }
    return data;
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Entries in a Log Sheet ****** */
export interface SetLogEntriesProps {
  onError: (error: any) => void;
  logSheetId: string;
  logEntries: LogEntry[];
}
export const setLogEntries = async ({
  onError,
  logSheetId,
  logEntries,
}: SetLogEntriesProps): Promise<any> => {
  const headerRow:string[] = await getSheetValues({
    sheetId: logSheetId,
    range: "Entries!A1:ZZ1",
  }).then((result: any[]) => {
    return result[0];
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });

  const entries = logEntries.map((entry) => {
    const { values } = entry;
    return headerRow.map((prop) => JSON.stringify(
      (values as any)[prop] || (entry as any)[prop]
    ));
  });

  return Promise.all([
    setSheetValues({
      sheetId: logSheetId,
      range: "Entries!C1",
      values: [entries],
    }),
  ]).catch((err: any) => {
    console.log("Error updating log sheet: ");
    throw onError(err?.result?.error);
  });
}