import { useSelector } from 'react-redux';
import { logSliceName, LogState } from './reducer';
import { Log, LogEntry, FieldValue } from './initialStates';

/**
 * Use this hook to access the log state.
 * @returns {LogState|undefined} The log state.
 */
export const useGetLogs = ():LogState => {
  return useSelector((state: any) => state[logSliceName]);
}

/**
 * Use this hook to access the log state.
 * @returns {Log[]|undefined} An array of log objects.
 */
export const useGetLogsArray = ():Log[] => {
  const logs = useGetLogs();
  return logs && (Object.values(logs) as Log[]);
}

/**
 * Use this hook to access the log state.
 * @returns {Log|undefined} The log object.
 * @param {string} logId The id of the log to get.
 */
export const useGetLog = (logId:string):Log => {
  const logs = useGetLogs();
  return logs && logs[logId];
}

/**
 * Use this hook to access the log state.
 * @returns {{[entryId:string]: LogEntry}|undefined} An object of log entry objects.
 * @param {string} logId The id of the log to get.
 */
export const useGetLogEntries = (logId:string): {[entryId:string]: LogEntry} => {
  const log = useGetLog(logId);
  return log && log.entries;
}

/**
 * Use this hook to access the log state.
 * @returns {LogEntry[]|undefined} An array of log entry objects.
 * @param {string} logId The id of the log to get.
 */
export const useGetLogEntriesArray = (logId:string):LogEntry[] => {
  const entries = useGetLogEntries(logId);
  return entries && Object.values(entries);
}

/**
 * Use this hook to access the log state.
 * @returns {LogEntry|undefined} An object of log entry objects.
 * @param {string} logId The id of the log to get.
 * @param {string} entryId The id of the log entry to get.
 */
export const useGetLogEntry = (logId:string, entryId:string):LogEntry => {
  const entries = useGetLogEntries(logId);
  return entries && entries[entryId];
}

/**
 * Use this hook to access the log state.
 * @returns {FieldValue|undefined} The value of the log entry value.
 * @param {string} logId The id of the log to get.
 * @param {string} entryId The id of the log entry to get.
 * @param {string} valueId The id of the log entry value to get.
 */
export const useGetLogEntryValue = (logId:string, entryId:string, valueId:string): FieldValue => {
  const values = useGetLogEntry(logId, entryId);
  return values && values[valueId];
}
