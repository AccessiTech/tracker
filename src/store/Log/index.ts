export {
  // Slice
  logSlice,
  logSliceName,

  // Actions
  addLog,
  removeLog,
  updateLog,
  addLogEntry,
  removeLogEntry,
  updateLogEntry,
  addLogField,
  removeLogField,
  updateLogField,
} from "./reducer";

export type { LogState } from "./reducer";

export {
  // Hooks
  useGetLogs,
  useGetLogsArray,
  useGetLog,
  useGetLogEntry,
  useGetLogEntries,
  useGetLogEntriesArray,
  useGetLogEntryValue,
} from "./hooks";

export {
  // Initial States
  initialCRUDState,
  initialLogState,
  initialLogEntryState,

  // Field States
  initialFieldState,
  initialTextFieldState,
  initialNumberFieldState,
  initialBooleanFieldState,
  initialTagsFieldState,
  initialSelectFieldState,
  initialDateFieldState,
  initialTimeFieldState,

  // Field States by Type
  initialFieldStates,
  getNewFieldState,
} from "./initialStates";

export type {
  CrudState,
  Log,
  FieldValue,
  LogField,
  TextLogField,
  NumberLogField,
  BooleanLogField,
  TagsLogField,
  SelectLogField,
  DateLogField,
  TimeLogField,
  LogEntry,
  LogFields,
  LogEntryStates,
} from "./initialStates";
