import { v4 as uuidv4 } from "uuid";
import {
  createFolder,
  createSpreadsheet,
  getSheetValues,
  setSheetName,
  setSheetValues,
} from "../../components/GoogleApi";
import { LogSheet } from "../../store/DataSync";
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
      logsToSync: '[]',
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
    logsToSync: JSON.stringify(logs),
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

  const logs = JSON.parse(existingSheetData.logsToSync) || [];
  return logs;
}


/** ***** Get Log Sheet IDs from Data Sync ****** */
export interface GetLogSheetIdsProps {
  onError: (error: any) => void;
  logSheetId: string;
}
export const getLogSheetIds = async ({
  onError,
  logSheetId,
}: GetLogSheetIdsProps): Promise<{[key:string] : LogSheet}> => {
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
    return JSON.parse(existingSheetData.logSheetIds || '{}');
  })
  .catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Sheet IDs in a Data Sync ****** */
export interface SetLogSheetIdsProps {
  onError: (error: any) => void;
  logSheetId: string;
  logSheetIds: { [logId: string]: LogSheet };
}
export const setLogSheetIds = async ({
  onError,
  logSheetId,
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
        logSheetId,
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
}: InitNewLogSheetProps): Promise<{id:string}> => {
  const sheetId = await createSpreadsheet({
    parents: [folderId],
    name: log.name,
  })
    .then((res: any) => {
      const id = res?.result?.id;
      if (!id) throw new Error("No ID returned from createSpreadsheet");
      return id;
    })
    .catch((err: any) => {
      console.log("Error creating new Log sheet: ");
      throw onError(err?.result?.error);
    });

  const newSheetData = {
    ...log,
    syncId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;

  const newSheetValues = [];
  for (const key in newSheetData) {
    if (key === "fields" || key === "entries" || key === "recurrence") continue;
    if (Object.prototype.hasOwnProperty.call(newSheetData, key)) {
      newSheetValues.push([key, newSheetData[key]]);
    }
  }
  if (log.recurrence) {
    newSheetValues.push(["recurrence", JSON.stringify(log.recurrence)]);
  }

  const renameResponse = await setSheetName({
    sheetId,
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
    "id", "name", "type", "required", "option", "typeOptions", "typeOptionStrings", "defaultValue",
    // field specific info
    "min", "max", "step", "unit", "trueLabel", "falseLabel", "options",
    // CRUD info
    "createdAt", "updatedAt"
  ];

  await setSheetValues({
    sheetId,
    range: "Metadata!A1",
    values: newSheetValues,
  });
  
  await setSheetValues({
    sheetId,
    range: "Fields!A1",
    values: [fieldHeaders],
  });

  await setSheetValues({
    sheetId,
    range: "Entries!A1",
    values: [
      [...fieldIds, "id", "createdAt", "updatedAt"],
      [...fieldNames, "id", "createdAt", "updatedAt"],
    ],
  });
  return Promise.resolve({id: sheetId});
}

/** ***** Get Log Metadata from a Log Sheet ****** */
export interface GetLogMetadataProps {
  onError: (error: any) => void;
  logSheetId: string;
}
export const getLogMetadata = async ({
  onError,
  logSheetId,
}: GetLogMetadataProps): Promise<{[key:string]: any}> => {
  return getSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A:B",
  }).then((result: any[]) => {
    const data = {} as any;
    for (const row of result) {
      try {
        data[row[0]] = JSON.parse(row[1]);
      } catch {
        data[row[0]] = row[1];
      }
    }
    return data;
  }).catch((err: any) => {
    console.log("Error getting Log metadata: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Metadata to a Log Sheet ****** */
export interface SetLogMetadataProps {
  onError: (error: any) => void;
  logSheetId: string;
  log: Log;
}
export const setLogMetadata = async ({
  onError,
  logSheetId,
  log,
}: SetLogMetadataProps): Promise<{[key:string]: any}> => {
  const newSheetData = {
    ...log,
    updatedAt: new Date().toISOString(),
  } as any;

  const newSheetValues = [];
  for (const prop in newSheetData) {
    if (prop === "fields" || prop === "entries") continue;
    if (Object.prototype.hasOwnProperty.call(newSheetData, prop)) {
      const newValue = Array.isArray((newSheetData as any)[prop]) || typeof (newSheetData as any)[prop] === "object"
            ? JSON.stringify(newSheetData[prop])
            : newSheetData[prop]
      newSheetValues.push([prop, newValue]);
    }
  }

  return setSheetValues({
    sheetId: logSheetId,
    range: "Metadata!A1",
    values: newSheetValues,
  }).then((result: any) => {
    return result;
  }).catch((err: any) => {
    console.log("Error setting Log metadata: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Get Log Metadata Prop from a Log Sheet ****** */
export interface GetLogMetadataPropProps {
  onError: (error: any) => void;
  logSheetId: string;
  prop: string;
}
export const getLogMetadataProp = async ({
  onError,
  logSheetId,
  prop,
}: GetLogMetadataPropProps): Promise<any> => {
  return getLogMetadata({
    onError,
    logSheetId,
  }).then((result: any) => {
    return result[prop];
  }).catch((err: any) => {
    console.log("Error getting Log metadata prop: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Metadata Prop to a Log Sheet ****** */
export interface SetLogMetadataPropProps {
  onError: (error: any) => void;
  logSheetId: string;
  prop: string;
  value: any;
}
export const setLogMetadataProp = async ({
  onError,
  logSheetId,
  prop,
  value,
}: SetLogMetadataPropProps): Promise<any> => {
  const newValue = Array.isArray(value) || typeof value === "object"
        ? JSON.stringify(value)
        : value;
  const existingMetadata = await getLogMetadata({
    onError,
    logSheetId,
  });
  const newMetadata = {
    ...existingMetadata,
    [prop]: newValue,
    updatedAt: new Date().toISOString(),
  } as any;

  const newSheetValues = [];
  for (const prop in newMetadata) {
    if (prop === "fields" || prop === "entries") continue;
    if (Object.prototype.hasOwnProperty.call(newMetadata, prop)) {
      newSheetValues.push([prop, newMetadata[prop]]);
    }
  }

  return setLogMetadata({
    onError,
    logSheetId,
    log: newMetadata,
  }).then((result: any) => {
    return result;
  }).catch((err: any) => {
    console.log("Error setting Log metadata prop: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Get Log Fields from a Log Sheet ****** */
export interface GetLogFieldsProps {
  onError: (error: any) => void;
  logSheetId: string;
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
        try {
          field[prop] = JSON.parse(row[headerRow.indexOf(prop)]);
        } catch {
          field[prop] = row[headerRow.indexOf(prop)];
        }
      }
      data.push(field);
    }
    return data as LogFields[];
  }).catch((err: any) => {
    console.log("Error getting existing sheet fields: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Fields in a Log Sheet ****** */
export interface SetLogFieldsProps {
  onError: (error: any) => void;
  logSheetId: string;
  logFields: { [logId: string]: LogFields };
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
    "min", "max", "step", "unit", "trueLabel", "falseLabel", "options",
    // CRUD info
    "createdAt", "updatedAt"
  ];

  const fields = fieldIds.map((id) => {
    const field = logFields[id];
    return fieldHeaders.map((prop) => Array.isArray((field as any)[prop]) || typeof (field as any)[prop] === "object"
      ? JSON.stringify((field as any)[prop])
      : (field as any)[prop])
  });

  return Promise.all([
    setSheetValues({
      sheetId: logSheetId,
      range: "Fields!A2",
      values: fields,
    }),
  ]).catch((err: any) => {
    console.log("Error updating log sheet fields: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Get Log Entries from a Log Sheet ****** */
export interface GetLogEntriesProps {
  onError: (error: any) => void;
  logSheetId: string;
}
export const getLogEntries = async ({
  onError,
  logSheetId,
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
        user: "",
        createdAt: row[headerRow.indexOf("createdAt")],
        updatedAt: row[headerRow.indexOf("updatedAt")],
      } as LogEntry;
      const newValues = {} as any;
      for (const h in headerRow) {
        const prop = headerRow[h];
        if (prop === "id" || prop === "createdAt" || prop === "updatedAt") {
          continue;
        }
        try {
          newValues[prop] = JSON.parse(row[h]);
        } catch (e) {
          newValues[prop] = row[h];
        }
      }
      entry.values = newValues;
      data.push(entry);
    }
    return data;
  }).catch((err: any) => {
    console.log("Error getting existing sheet entries: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Set Log Entries in a Log Sheet ****** */
export interface SetLogEntriesProps {
  onError: (error: any) => void;
  logSheetId: string;
  logEntries: { [entryId: string]: LogEntry };
  logFields?: { [fieldId: string]: LogFields };
}
export const setLogEntries = async ({
  onError,
  logSheetId,
  logEntries,
  logFields,
}: SetLogEntriesProps): Promise<any> => {
  // get existing header row
  const headerRow:string[] = await getSheetValues({
    sheetId: logSheetId,
    range: "Entries!A1:ZZ1",
  }).then((result: any[]) => {
    return result[0];
  }).catch((err: any) => {
    console.log("Error getting existing sheet data: ");
    throw onError(err?.result?.error);
  });

  // if logFields are provided, update header row to match
  let newHeaderRow = headerRow;
  if (logFields) {
    const fieldIds = Object.keys(logFields);
    const newNameRow = newHeaderRow.map((id) => logFields[id]?.name || id);
    for (const fieldId of fieldIds) {
      const field = logFields[fieldId];
      if (!newHeaderRow.includes(field.id)) {
        newHeaderRow.push(field.id);
        newNameRow.push(field.name);
      }
    }

    // update header rows
    await setSheetValues({
      sheetId: logSheetId,
      range: "Entries!1:2",
      values: [newHeaderRow, newNameRow],
    });
  }

  // update sheet entries
  const entries = Object.keys(logEntries).map((entryId) => {
    const { values } = logEntries[entryId];
    return newHeaderRow.map((prop) => {
      const nextValue = (values as any)[prop] || (logEntries[entryId] as any)[prop] || "";
      return Array.isArray(nextValue) || typeof nextValue === "object"
        ? JSON.stringify(nextValue) : nextValue;
    });
  });

  return Promise.all([
    setSheetValues({
      sheetId: logSheetId,
      range: "Entries!A3",
      values: entries,
    }),
  ]).catch((err: any) => {
    console.log("Error updating log sheet entries: ");
    throw onError(err?.result?.error);
  });
}

/** ***** Sync Log Sheet ****** */
export interface SyncLogSheetProps {
  onError: (error: any) => void;
  logSheetId: string;
  log?: Log;
}
export interface SyncLogSheetResponse {
  metadata: Partial<Log>;
  entries: LogEntry[];
  fields: LogFields[];
}
export const syncLogSheet = async ({
  onError,
  logSheetId,
  log,
}: SyncLogSheetProps): Promise<SyncLogSheetResponse> => {
  const newMetadata: any = await syncLogMetadata({
    onError,
    logSheetId,
    log,
  });
  const { deletedEntries, deletedFields } = newMetadata;
  const newFields = await syncLogFields({
    onError,
    logSheetId,
    log,
    deletedFields: deletedFields || [],
  });
  const newEntries = await syncLogEntries({
    onError,
    logSheetId,
    log,
    deletedEntries: deletedEntries || [],
  });
  const recurrence =
    newMetadata.recurrence &&
    typeof newMetadata.recurrence === "string" &&
    (newMetadata.recurrence[0] === "{" || newMetadata.recurrence[0] === "[")
      ? JSON.parse(newMetadata.recurrence)
      : undefined;
  return  {
    metadata: {
      ...newMetadata,
      recurrence,
    } as Partial<Log>,
    entries: newEntries,
    fields: newFields,
  };
};

/** ***** Sync Log Metadata ***** */
export interface SyncLogMetadataOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  log?: Log;
}
export const syncLogMetadata = async ({
  onError,
  logSheetId,
  log,
}: SyncLogMetadataOptions): Promise<Partial<Log>> => {
  //get log metadata from sheet
  const existingMetadata: any = await getLogMetadata({
    onError,
    logSheetId,
  });

  // if there is no local log, return existing metadata from sheet
  if (!log) {
    return existingMetadata as Partial<Log>;
  }

  // get metadata from local log
  const localMetadata: any = {};
  for (const prop of Object.keys(log)) {
    if (prop !== "entries" && prop !== "fields") {
      localMetadata[prop] = (log as any)[prop];
    }
  }

  let updatedData = {} as any;
  const localDate = localMetadata.updatedAt || localMetadata.createdAt;
  const sheetDate = existingMetadata.updatedAt || existingMetadata.createdAt;
  if (localDate > sheetDate) {
    updatedData = {
      ...existingMetadata,
      ...localMetadata,
    }
  } else {
    updatedData = {
      ...localMetadata,
      ...existingMetadata,
    }
  }

  // update log metadata
  try {
    await setLogMetadata({
      onError,
      logSheetId,
      log: updatedData,
    });
  } catch (error:any) {
    onError(error);
  }

  // return log metadata that was updated
  return updatedData as Partial<Log>;
};

/** ***** Sync Log Fields ***** */
export interface SyncLogFieldsOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  log?: Log;
  deletedFields: string[];
}
export const syncLogFields = async ({
  onError,
  logSheetId,
  log,
  deletedFields,
}: SyncLogFieldsOptions): Promise<LogFields[]> => {
  // get existing log fields from sheet
  const existingFields: any = await getLogFields({
    onError,
    logSheetId,
  }).then((fields) => {
    const fieldMap = {} as { [key: string]: LogFields };
    for (const field of fields) {
      if (deletedFields.includes(field.id)) continue;
      fieldMap[field.id] = field;
    }
    return fieldMap;
  });

  // if there is no local log, return existing data from sheet
  if (!log) {
    return Object.values(existingFields);
  }
  
  // get log fields from local log
  const localFields = {} as { [key: string]: LogFields };
  for (const field of Object.values(log.fields)) {
    if (deletedFields.includes(field.id)) continue;
    localFields[field.id] = field;
  }

  const { updatedData, updatedIds } = syncData({
    localData: localFields,
    sheetData: existingFields,
  });

  // update log fields
  try {
    await setLogFields({
      onError,
      logSheetId,
      logFields: updatedData,
    });
  } catch (error: any) {
    onError(error);
  }

  // return log fields that were updated
  return updatedIds.map((id) => updatedData[id]);
};


/** ***** Sync Log Entries ***** */
export interface SyncLogEntriesOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  log?: Log;
  deletedEntries: string[];
}
export const syncLogEntries = async ({
  onError,
  logSheetId,
  log,
  deletedEntries,
}: SyncLogEntriesOptions): Promise<LogEntry[]> => {
  // get existing log entries from sheet
  const existingEntries = await getLogEntries({
    onError,
    logSheetId,
  }).then((entries) => {
    const entryMap = {} as { [key: string]: LogEntry };
    for (const entry of entries) {
      if (deletedEntries.includes(entry.id)) continue;
      entryMap[entry.id] = entry;
    }
    return entryMap;
  });

  // if there is no local log, return existing data from sheet
  if (!log) {
    return Object.values(existingEntries);
  }

  // get log entries from local log
  const localEntries = {} as { [key: string]: LogEntry };
  for (const entry of Object.values(log.entries)) {
    if (deletedEntries.includes(entry.id)) continue;
    localEntries[entry.id] = entry;
  }

  const { updatedIds, updatedData } = syncData({
    localData: localEntries,
    sheetData: existingEntries,
  });

  // update log entries
  try {
    await setLogEntries({
      onError,
      logSheetId,
      logEntries: updatedData,
      logFields: log.fields,
    });
  } catch (error:any) {
    onError(error);
  }

  // return log entries that were updated
  return updatedIds.map((id) => updatedData[id]);
};

/** ***** Sync Data ***** */
export interface SyncDataOptions {
  localData: { [key: string]: any };
  sheetData: { [key: string]: any };
}
export interface SyncDataResponse {
  updatedData: { [key: string]: any };
  updatedIds: string[];
}
export const syncData = ({
  localData,
  sheetData,
}: SyncDataOptions): SyncDataResponse => {
  // get all unique entry ids from sheet and local log
  const dataIds = Array.from(
    new Set([...Object.keys(localData), ...Object.keys(sheetData)])
  );

  // get log entries with different data in local log and sheet
  const updatedIds = dataIds.filter(
    (id) => JSON.stringify(localData[id]) !== JSON.stringify(sheetData[id])
  );

  // create updated data
  const updatedData = {} as { [key: string]: any };
  for (const id of dataIds) {
    // if data exists in both local and sheet data
    if (localData[id] && sheetData[id]) {
      // if data is different in local and sheet data
      if (updatedIds.includes(id)) {
        // if local data is newer or has been updated more recently
        const localDate = localData[id].updatedAt || localData[id].createdAt;
        const sheetDate = sheetData[id].updatedAt || sheetData[id].createdAt;
        if (localDate > sheetDate) {
          // use local data
          updatedData[id] = localData[id];
        } else {
          // use sheet data
          updatedData[id] = sheetData[id];
        }
      }
    } else if (sheetData[id] && !localData[id]) {
      // if data only exists in sheet
      // use sheet data
      updatedData[id] = sheetData[id];
    } else if (!sheetData[id] && localData[id]) {
      // if data only exists in local data
      // use local data
      updatedData[id] = localData[id];
    }
  }

  return {
    updatedIds,
    updatedData,
  }
};

/** ***** Add Log Entry ***** */
export interface AddLogEntryOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logEntry: LogEntry;
}
export const addLogEntry = async ({
  onError,
  logSheetId,
  logEntry,
}: AddLogEntryOptions): Promise<LogEntry> => {
  // get existing log entries from sheet
  const existingEntries = await getLogEntries({
    onError,
    logSheetId,
  }).then((entries) => {
    const entryMap = {} as { [key: string]: LogEntry };
    for (const entry of entries) {
      entryMap[entry.id] = entry;
    }
    return entryMap;
  });

  // add new log entry
  existingEntries[logEntry.id] = logEntry;

  // update log entries
  try {
    await setLogEntries({
      onError,
      logSheetId,
      logEntries: existingEntries,
    });
  } catch (error:any) {
    onError(error);
  }

  // return new log entry
  return logEntry;
};

/** ***** Update Log Entry ***** */
export interface UpdateLogEntryOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logEntry: LogEntry;
}
export const updateLogEntry = async ({
  onError,
  logSheetId,
  logEntry,
}: UpdateLogEntryOptions): Promise<LogEntry> => {
  // get existing log entries from sheet
  const existingEntries = await getLogEntries({
    onError,
    logSheetId,
  }).then((entries) => {
    const entryMap = {} as { [key: string]: LogEntry };
    for (const entry of entries) {
      entryMap[entry.id] = entry;
    }
    return entryMap;
  });

  // update log entry
  existingEntries[logEntry.id] = logEntry;

  // update log entries
  try {
    await setLogEntries({
      onError,
      logSheetId,
      logEntries: existingEntries,
    });
  } catch (error:any) {
    onError(error);
  }

  // return updated log entry
  return logEntry;
};

/** ***** Delete Log Entry ***** */
export interface DeleteLogEntryOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logEntryId: string;
}
export const deleteLogEntry = async ({
  onError,
  logSheetId,
  logEntryId,
}: DeleteLogEntryOptions): Promise<void> => {
  // get existing log entries from sheet
  const existingEntries = await getLogEntries({
    onError,
    logSheetId,
  }).then((entries) => {
    const entryMap = {} as { [key: string]: LogEntry };
    for (const entry of entries) {
      entryMap[entry.id] = entry;
    }
    return entryMap;
  });
  const existingDeletedEntries = await getLogMetadataProp({
    onError,
    logSheetId,
    prop: 'deletedEntries',
  }) || [];

  // delete log entry
  delete existingEntries[logEntryId];
  existingDeletedEntries.push(logEntryId);

  // update log entries
  try {
    await setLogEntries({
      onError,
      logSheetId,
      logEntries: existingEntries,
    });
    await setLogMetadataProp({
      onError,
      logSheetId,
      prop: 'deletedEntries',
      value: existingDeletedEntries,
    });
  } catch (error:any) {
    onError(error);
  }
};

/** ***** Add Log Field ***** */
export interface AddLogFieldOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logField: LogFields;
}
export const addLogField = async ({
  onError,
  logSheetId,
  logField,
}: AddLogFieldOptions): Promise<LogFields> => {
  // get existing log fields from sheet
  const existingFields = await getLogFields({
    onError,
    logSheetId,
  }).then((fields) => {
    const fieldMap = {} as { [key: string]: LogFields };
    for (const field of fields) {
      fieldMap[field.id] = field;
    }
    return fieldMap;
  });

  // add new log field
  existingFields[logField.id] = logField;

  // update log fields
  try {
    await setLogFields({
      onError,
      logSheetId,
      logFields: existingFields,
    });
  } catch (error:any) {
    onError(error);
  }

  // return new log field
  return logField;
};

/** ***** Update Log Field ***** */
export interface UpdateLogFieldOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logField: LogFields;
}
export const updateLogField = async ({
  onError,
  logSheetId,
  logField,
}: UpdateLogFieldOptions): Promise<LogFields> => {
  // get existing log fields from sheet
  const existingFields = await getLogFields({
    onError,
    logSheetId,
  }).then((fields) => {
    const fieldMap = {} as { [key: string]: LogFields };
    for (const field of fields) {
      fieldMap[field.id] = field;
    }
    return fieldMap;
  });

  // update log field
  existingFields[logField.id] = logField;

  // update log fields
  try {
    await setLogFields({
      onError,
      logSheetId,
      logFields: existingFields,
    });
  } catch (error: any) {
    onError(error);
  }

  // return updated log field
  return logField;
};

/** ***** Delete Log Field ***** */
export interface DeleteLogFieldOptions {
  onError: (error: Error) => void;
  logSheetId: string;
  logFieldId: string;
}
export const deleteLogField = async ({
  onError,
  logSheetId,
  logFieldId,
}: DeleteLogFieldOptions): Promise<void> => {
  // get existing log fields from sheet
  const existingFields = await getLogFields({
    onError,
    logSheetId,
  }).then((fields) => {
    const fieldMap = {} as { [key: string]: LogFields };
    for (const field of fields) {
      fieldMap[field.id] = field;
    }
    return fieldMap;
  });
  const existingDeletedFields = await getLogMetadataProp({
    onError,
    logSheetId,
    prop: 'deletedFields',
  }) || [];

  // delete log field
  delete existingFields[logFieldId];
  existingDeletedFields.push(logFieldId);

  // update log fields
  try {
    await setLogFields({
      onError,
      logSheetId,
      logFields: existingFields,
    });
    await setLogMetadataProp({
      onError,
      logSheetId,
      prop: 'deletedFields',
      value: existingDeletedFields,
    });
  } catch (error:any) {
    onError(error);
  }
};
