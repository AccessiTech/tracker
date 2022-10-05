/**
 * Initial CRUD state
  @typedef {Object} CrudState
  @property {string} createdAt - The date the object was created
  @property {string} updatedAt - The date the object was last updated
  @property {string} deletedAt - The date the object was deleted
  @property {string} archivedAt - The date the object was archived
  @property {string} restoredAt - The date the object was restored
  @property {boolean} deleted - Whether the object is deleted
  @property {boolean} archived - Whether the object is archived
  @property {boolean} restored - Whether the object is restored
 */
export const initialCRUDState = {
  createdAt: "",
  updatedAt: "",
  deletedAt: "",
  archivedAt: "",
  restoredAt: "",
  deleted: false,
  archived: false,
  restored: false,
};

/**
 * Initial state for a log in the store
 * @typedef {Object} Log
 * @property {string} id - The id of the log
 * @property {string} name - The name of the log
 * @property {Object.<string, LogField>} fields - The fields of the log
 * @property {Object.<string, LogEntry>} entries - The entries of the log
 */
export const initialLogState = {
  id: "",
  name: "",
  user: "",
  fields: {},
  entries: {},
  ...initialCRUDState,
};

/**
 * Initial state for a log field in the store
 * @typedef {Object} LogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {string} type - The type of the log field
 */
export const initialFieldState = {
  id: "",
  name: "",
  type: "",
  user: "",
  ...initialCRUDState,
};

/**
 * Initial state for a text log field in the store
 * @typedef {Object} TextLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"text"} type - The type of the log field
 * @property {string} value - The value of the log field
 * @property {"text"|"textarea"} option - The selected option of the log field
 * @property {["text"|"textarea"]} typeOptions - The options of the log field
 * @property {string} default - The default value of the log field
 */
export const initialTextFieldState = {
  ...initialFieldState,
  name: "New Text Field",
  type: "text",
  option: "text",
  typeOptions: ["text", "textarea"],
  value: "",
  default: "",
};

/**
 * Initial state for a number log field in the store
 * @typedef {Object} NumberLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"number"} type - The type of the log field
 * @property {number} value - The value of the log field
 * @property {number} min - The minimum value of the log field
 * @property {number} max - The maximum value of the log field
 * @property {number} default - The default value of the log field
 * @property {number} step - The step value of the log field
 * @property {["number", "range"]} typeOptions - The option of the log field
 * @property {"number"|"range"} option - The selected option of the log field
 * @property {string} unit - The unit of the log field
 */
export const initialNumberFieldState = {
  ...initialFieldState,
  name: "New Number Field",
  type: "number",
  option: "number",
  typeOptions: ["number", "range"],
  value: 0,
  default: 0,
  min: 0,
  step: 1,
  max: 100,
  unit: "",
};

/**
 * Initial state for a range log field in the store
 * @typedef {Object} RangeLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"range"} type - The type of the log field
 * @property {[number, number]} value - The value of the log field
 * @property {number} min - The minimum value of the log field
 * @property {number} max - The maximum value of the log field
 * @property {[number, number]} default - The default value of the log field
 * @property {number} step - The step value of the log field
 */
export const initialRangeFieldState = {
  ...initialNumberFieldState,
  name: "New Range Field",
  type: "range",
  option: "range",
  value: [0, 100],
  default: [0, 100],
};

/**
 * Initial state for a tags log field in the store
 * @typedef {Object} TagsLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"tags"} type - The type of the log field
 * @property {string[]} value - The value of the log field
 * @property {string[]} default - The default value of the log field
 */
export const initialTagsFieldState = {
  ...initialFieldState,
  name: "New Tags Field",
  type: "tags",
  value: [],
  default: [],
};

/**
 * Initial state for a boolean log field in the store
 * @typedef {Object} BooleanLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"boolean"} type - The type of the log field
 * @property {boolean} value - The value of the log field
 * @property {boolean} default - The default value of the log field
 */
export const initialBooleanFieldState = {
  ...initialFieldState,
  name: "New Boolean Field",
  type: "boolean",
  value: false,
  default: false,
};

/**
 * Initial state for a select log field in the store
 * @typedef {Object} SelectLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"select"} type - The type of the log field
 * @property {string[]} value - The value of the log field
 * @property {string[]} default - The default value of the log field
 * @property {string[]} options - The options of the select log field
 * @property {"one"|"many"} option - The selected option of the log field
 * @property {["one"|"many"]} typeOptions - The options of the log field
 */

export const initialSelectFieldState = {
  ...initialFieldState,
  name: "New Select Field",
  type: "select",
  option: "one",
  typeOptions: ["one", "many"],
  value: [],
  default: [],
  options: [],
};

/**
 * Initial state for a date log field in the store
 * @typedef {Object} DateLogField
 * @property {string} id - The id of the log field
 * @property {"_date"} name - The name of the log field
 * @property {"date"} type - The type of the log field
 * @property {string} value - The value of the log field
 */
export const initialDateFieldState = {
  ...initialFieldState,
  name: "_date",
  type: "date",
  value: new Date().toISOString().slice(0, 10),
};

/**
 * Initial state for a time log field in the store
 * @typedef {Object} TimeLogField
 * @property {string} id - The id of the log field
 * @property {"_time"} name - The name of the log field
 * @property {"time"} type - The type of the log field
 * @property {string} value - The value of the log field
 */
export const initialTimeFieldState = {
  ...initialFieldState,
  name: "_time",
  type: "time",
  value: new Date().toISOString().slice(11, 16),
};

/**
 * Initial state for a log entry in the store
 * @typedef {Object} LogEntry
 * @property {string} id - The id of the log entry
 * @property {string} user - The user of the log entry
 * @property {string} log - The log of the log entry
 * @property {Object.<string,TextLogField|NumberLogField|RangeLogField|TagsLogField|BooleanLogField|SelectLogField|DateLogField|TimeLogField>} values - The values of the log entry
 */
export const initialLogEntryState = {
  id: "",
  log: "",
  user: "",
  values: {},
  ...initialCRUDState,
};
