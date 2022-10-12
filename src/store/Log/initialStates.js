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
 * @property {boolean} required - Whether the log field is required
 * @property {undefined|string|number|boolean|[number,number]|string[]} defaultValue - The default value of the log field
 */
export const initialFieldState = {
  id: "",
  name: "",
  type: "",
  user: "",
  required: false,
  defaultValue: undefined,
  ...initialCRUDState,
};

/**
 * Initial state for a text log field in the store
 * @typedef {Object} TextLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"text"} type - The type of the log field
 * @property {"text"|"textarea"} option - The selected option of the log field
 * @property {["text"|"textarea"]} typeOptions - The options of the log field
 * @property {[string,string]} typeOptionStrings - The human readable options of the log field
 * @property {number} min - The minimum character length of the text field
 * @property {number} max - The maximum character length of the text field
 */
export const initialTextFieldState = {
  ...initialFieldState,
  name: "New Text Field",
  type: "text",
  option: "text",
  typeOptions: ["text", "textarea"],
  typeOptionStrings: ["Single Line", "Multi Line"],
  min: 0,
  max: 0,
};

/**
 * Initial state for a number log field in the store
 * @typedef {Object} NumberLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"number"} type - The type of the log field
 * @property {number} min - The minimum value of the log field
 * @property {number} max - The maximum value of the log field
 * @property {number} step - The step value of the log field
 * @property {["number", "range"]} typeOptions - The option of the log field
 * @property {[string,string]} typeOptionStrings - The human readable options of the log field
 * @property {"number"|"range"} option - The selected option of the log field
 * @property {string} unit - The unit of the log field
 */
export const initialNumberFieldState = {
  ...initialFieldState,
  name: "New Number Field",
  type: "number",
  option: "number",
  typeOptions: ["number", "range"],
  typeOptionStrings: ["Number Input", "Range Slider"],
  defaultValue: 0,
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
 * @property {number} min - The minimum value of the log field
 * @property {number} max - The maximum value of the log field
 * @property {number} step - The step value of the log field
 */
export const initialRangeFieldState = {
  ...initialNumberFieldState,
  name: "New Range Field",
  option: "range",
  defaultValue: [0, 100],
};

/**
 * Initial state for a tags log field in the store
 * @typedef {Object} TagsLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"tags"} type - The type of the log field
 */
export const initialTagsFieldState = {
  ...initialFieldState,
  name: "New Tags Field",
  type: "tags",
  defaultValue: [],
};

/**
 * Initial state for a boolean log field in the store
 * @typedef {Object} BooleanLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"boolean"} type - The type of the log field
 */
export const initialBooleanFieldState = {
  ...initialFieldState,
  name: "New Boolean Field",
  type: "boolean",
  defaultValue: false,
};

/**
 * Initial state for a select log field in the store
 * @typedef {Object} SelectLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"select"} type - The type of the log field
 * @property {string[]} value - The value of the log field
 * @property {string[]} options - The options of the select log field
 * @property {"one"|"many"} option - The selected option of the log field
 * @property {["one"|"many"]} typeOptions - The options of the log field
 * @property {[string,string]} typeOptionStrings - The human readable options of the log field
 */

export const initialSelectFieldState = {
  ...initialFieldState,
  name: "New Select Field",
  type: "select",
  option: "one",
  typeOptions: ["one", "many"],
  typeOptionStrings: ["Select One", "Select Many"],
  defaultValue: [],
  options: [],
};

/**
 * Initial state for a date log field in the store
 * @typedef {Object} DateLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"date"} type - The type of the log field
 */
export const initialDateFieldState = {
  ...initialFieldState,
  name: "New Date Field",
  type: "date",
  defaultValue: new Date().toISOString().slice(0, 10),
};

/**
 * Initial state for a time log field in the store
 * @typedef {Object} TimeLogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {"time"} type - The type of the log field
 */
export const initialTimeFieldState = {
  ...initialFieldState,
  name: "New Time Field",
  type: "time",
  defaultValue: new Date().toISOString().slice(11, 16),
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

export const initialFieldStates = {
  text: initialTextFieldState,
  number: initialNumberFieldState,
  range: initialRangeFieldState,
  tags: initialTagsFieldState,
  boolean: initialBooleanFieldState,
  select: initialSelectFieldState,
  date: initialDateFieldState,
  time: initialTimeFieldState,
};

/**
 * Get the initial state for a log field based on type
 * @param {string} type - The type of the log field
 * @returns {TextLogField|NumberLogField|RangeLogField|TagsLogField|BooleanLogField|SelectLogField|DateLogField|TimeLogField} The initial state for the log field
 * @example var newTextFieldState = getInitialFieldState("text")
 * @example var newNumberFieldState = getInitialFieldState("number")
 */
export const getNewFieldState = (type) => {
  let newFieldState = {};
  switch (type) {
    case "number":
      newFieldState = { ...initialNumberFieldState };
      break;
    case "tags":
      newFieldState = { ...initialTagsFieldState };
      break;
    case "boolean":
      newFieldState = { ...initialBooleanFieldState };
      break;
    case "select":
      newFieldState = { ...initialSelectFieldState };
      break;
    case "date":
      newFieldState = { ...initialDateFieldState };
      break;
    case "time":
      newFieldState = { ...initialTimeFieldState };
      break;
    case "text":
    default:
      newFieldState = { ...initialTextFieldState };
      break;
  }
  return newFieldState;
};
