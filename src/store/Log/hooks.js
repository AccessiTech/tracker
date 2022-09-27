import { useSelector } from 'react-redux';
import { logSliceName } from './reducer';

/**
 * Use this hook to access the log state.
 * @returns {Log|undefined} The log state.
 * @typedef {Object} Any
 */
export const useGetLogs = () => {
  return useSelector((state) => state[logSliceName]);
}

/**
 * Use this hook to access the log state.
 * @returns {Array|undefined} An array of log objects.
 * @typedef {Array} Log[] An array of log objects.
 */
export const useGetLogsArray = () => {
  const logs = useGetLogs();
  return logs && Object.values(logs);
}

/**
 * Use this hook to access the log state.
 * @returns {Log|undefined} The log object.
 * @typedef {Object} Log
 * @param {string} logId The id of the log to get.
 */
export const useGetLog = (logId) => {
  const logs = useGetLogs();
  return logs && logs[logId];
}

/**
 * Use this hook to access the log state.
 * @returns {Object|undefined} An object of log entry objects.
 * @typedef {Object} Any of log entry objects.
 * @param {string} logId The id of the log to get.
 */
export const useGetLogEntries = (logId) => {
  const log = useGetLog(logId);
  return log && log.entries;
}

/**
 * Use this hook to access the log state.
 * @returns {Array|undefined} An array of log entry objects.
 * @typedef {Array} LogEntry[] array of log entry objects.
 * @param {string} logId The id of the log to get.
 */
export const useGetLogEntriesArray = (logId) => {
  const entries = useGetLogEntries(logId);
  return entries && Object.values(entries);
}

/**
 * Use this hook to access the log state.
 * @returns {Object|undefined} An object of log entry objects.
 * @typedef {Object} Any of log entry objects.
 * @param {string} logId The id of the log to get.
 * @param {string} entryId The id of the log entry to get.
 */
export const useGetLogEntry = (logId, entryId) => {
  const entries = useGetLogEntries(logId);
  return entries && entries[entryId];
}

/**
 * Use this hook to access the log state.
 * @returns {Array|undefined} An array of log entry objects.
 * @typedef {Array} LogEntry[] array of log entry objects.
 * @param {string} logId The id of the log to get.
 * @param {string} entryId The id of the log entry to get.
 */
export const useGetLogEntryValues = (logId, entryId) => {
  const entry = useGetLogEntry(logId, entryId);
  return entry && entry.values;
}

/**
 * Use this hook to access the log state.
 * @returns {Number|String|Boolean|undefined} The value of the log entry value.
 * @typedef {Number|String|Boolean} Any The value of the log entry value.
 * @param {string} logId The id of the log to get.
 * @param {string} entryId The id of the log entry to get.
 * @param {string} valueId The id of the log entry value to get.
 */
export const useGetLogEntryValue = (logId, entryId, valueId) => {
  const values = useGetLogEntryValues(logId, entryId);
  return values && values[valueId];
}
