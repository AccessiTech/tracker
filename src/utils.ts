import { Log } from "./store/Log";
import { LogRecurrence } from "./store/Log/initialStates";
import { GRANTED } from "./strings";

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
  useIdsAsHeaders?: boolean;
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
    useIdsAsHeaders: false,
  }
) => {
  const { includeID, includeCreatedAt, includeUpdatedAt, useIdsAsHeaders } =
    options;
  let csv = "";
  if (includeID) csv += "ID,";
  if (includeCreatedAt) csv += "Created At,";
  if (includeUpdatedAt) csv += "Updated At,";

  const fields = Object.values(log.fields);
  for (const field of fields) {
    csv += (useIdsAsHeaders ? field.id : field.name) + ",";
  }
  csv = csv.slice(0, -1);
  csv += "\r\n";
  const entries: any[] = Object.values(log.entries);
  for (const entry of entries) {
    if (!entry || !entry.value) continue;
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

export const logToMetaCSV = (log: Log) => {
  const headers = [
    "id",
    "name",
    "type",
    "required",
    "option",
    "defaultValue",
    "min",
    "max",
    "step",
    "unit",
    "options",
  ];
  let csv = headers.join(",") + "\r\n";
  const fields = Object.values(log.fields);
  for (const field of fields) {
    for (const key of headers) {
      const value = String((field as any)[key]) || "";
      csv += value.replace(/,/g, ";") + ",";
    }
    csv = csv.slice(0, -1);
    csv += "\r\n";
  }
  return csv;
};

export const parseCSV = (csv: string): { [key: string]: any }[] => {
  const lines = csv.split("\r\n");
  const headers = lines[0].split(",");
  const entries = lines
    .slice(1)
    .map((line) => {
      const values = line.split(",");
      const entry: any = {};
      headers.forEach((header, index) => {
        entry[header] = (values[index] || "").trim();
        if (entry[header].toLowerCase() === "true") {
          entry[header] = true;
        } else if (entry[header].toLowerCase() === "false") {
          entry[header] = false;
        } else if (entry[header].toLowerCase() === "null") {
          entry[header] = null;
        } else if (entry[header].toLowerCase() === "undefined") {
          entry[header] = undefined;
        } else if (!Number.isNaN(Number(entry[header]))) {
          entry[header] = Number(entry[header]);
        }
      });
      return entry;
    })
    .filter((entry) => entry.type || entry.ID);
  return entries;
};

/**
 * Download CSV file
 * todo: expand to support other file types; add options; add error handling; extract to package;
 * @param {string} csv - The CSV string
 * @param {string} filename - The filename
 */
export const downloadCVS = (csv: string, filename: string = "log") => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.click();
};

export interface NotificationOptions {
  timestamp: number;
  title: string;
  body: string;
  tag: string;
  displayDuration?: number;
  onclick?: () => void;
}

/**
 * Set a notification
 * @param {NotificationOptions} options - The notification options to use
 * @returns {void}
 */
export const setNotification = async (options: NotificationOptions) => {
  const { timestamp, title, body, tag, displayDuration, onclick } = options;
  const now = Math.floor(Date.now());
  const duration = timestamp - now;

  const notificationTimeout = setTimeout(() => {
    const n = new Notification(title, {
      body,
      tag,
      timestamp: timestamp || now,
      onclick,
    } as any);

    if (displayDuration) {
      setTimeout(n.close.bind(n), displayDuration);
    }
    clearTimeout(notificationTimeout);
  }, duration);
};

/**
 * Attempt to set a notification
 * @param {NotificationOptions} options - The notification options to use
 * @returns {void}
 */
export const notify = (options: NotificationOptions) => {
  if ("Notification" in window) {
    if (Notification?.permission === GRANTED) {
      setNotification(options);
    } else {
      Notification.requestPermission((permission) => {
        if (permission === GRANTED) {
          setNotification(options);
        }
      });
    }
  } else {
    alert(
      `This browser does not support desktop notification.
      Please use a modern browser, such as "Google Chrome",
      "Mozilla Firefox", or "Microsoft Edge".`
    );
  }
};

/**
 * Get the timestamp for a log recurrence
 * @param {LogRecurrence} recurrence - The recurrence to use
 * @returns {number} - The timestamp
 */
export const getTimestamp = (recurrence?: LogRecurrence): number => {
  const now = Date.now();
  if (!recurrence) return now;
  const { interval, unit } = recurrence;
  let timestamp = now;
  switch (unit) {
    case "minute":
      timestamp = now + interval * 60 * 1000;
      break;
    case "hour":
      timestamp = now + interval * 60 * 60 * 1000;
      break;
    case "day":
      timestamp = now + interval * 24 * 60 * 60 * 1000;
      break;
    case "week":
      timestamp = now + interval * 7 * 24 * 60 * 60 * 1000;
      break;
    case "month":
      timestamp = now + interval * 30 * 24 * 60 * 60 * 1000;
      break;
    case "year":
      timestamp = now + interval * 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      break;
  }
  return timestamp;
};

export const decode = (data: string, depth = 1):string => {
  if (!data) throw new Error("No data to decode");
  let decoded = data;
  const dec = new TextDecoder();
  for (let i = 0; i < depth; i++) {
    const buffer = new Uint8Array([...(JSON.parse(`[${decoded}]`))]);
    decoded = dec.decode(buffer);
  }
  return decoded;
}

export const encode = (data: string, depth = 1):string => {
  if (!data) throw new Error("No data to encode");
  let encoded = data;
  const enc = new TextEncoder();
  for (let i = 0; i < depth; i++) {
    encoded = enc.encode(encoded).toString();
  }
  return encoded;
}
