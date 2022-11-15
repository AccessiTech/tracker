import { Log } from "./store/Log";

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Slugify a string
 * @param {string} text - The text to slugify
 * @returns {string} The slugified text
 */
export const slugify = (text: string) => {
  return text && text.toString().toLowerCase().replace(/\s+/g, "-");
};

export interface logEntriesToCSVOptions {
  includeID?: boolean;
  includeCreatedAt?: boolean;
  includeUpdatedAt?: boolean;
}

/**
 * Convert Log Entries to CSV
 * @param {Log} logEntries - The log entries to convert
 * @param {object} options - The options to use
 * @returns {string} The CSV string
 */
export const logEntriesToCSV = (
  log: Log,
  options: logEntriesToCSVOptions = {
    includeID: false,
    includeCreatedAt: false,
    includeUpdatedAt: false,
  }
) => {
  const { includeID, includeCreatedAt, includeUpdatedAt } = options;
  let csv = "";
  if (includeID) csv += "ID,";
  if (includeCreatedAt) csv += "Created At,";
  if (includeUpdatedAt) csv += "Updated At,";

  const fields = Object.values(log.fields);
  for (const field of fields) {
    csv += field.name + ",";
  }
  csv = csv.slice(0, -1);
  csv += "\r\n";
  const entries: any[] = Object.values(log.entries);
  for (const entry of entries) {
    if (includeID) csv += entry.id + ",";
    if (includeCreatedAt) csv += entry.createdAt + ",";
    if (includeUpdatedAt) csv += (entry.updatedAt || "") + ",";
    for (const field of fields) {
      csv += (entry as any).values[field.id] + ",";
    }
    csv = csv.slice(0, -1);
    csv += "\r\n";
  }
  return csv;
};
