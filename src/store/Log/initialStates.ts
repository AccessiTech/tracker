/**
 * Initial CRUD state
  @typedef {Object} CrudState
  @property {string} createdAt - The date the object was created
  @property {string} updatedAt - The date the object was last updated
 */
export interface CrudState {
  createdAt: string;
  updatedAt: string;
}
export const initialCRUDState: CrudState = {
  createdAt: "",
  updatedAt: "",
  // deletedAt: "",
  // archivedAt: "",
  // restoredAt: "",
  // deleted: false,
  // archived: false,
  // restored: false,
};

/**
 * Initial state for a log in the store
 * @typedef {Object} Log
 * @property {string} id - The id of the log
 * @property {string} name - The name of the log
 * @property {Object.<string, LogField>} fields - The fields of the log
 * @property {Object.<string, LogEntry>} entries - The entries of the log
 */
export interface Log extends CrudState {
  id: string;
  name: string;
  user?: string;
  fields: { [fieldId: string]: LogFields };
  entries: { [entryId: string]: LogEntry };
}
export const initialLogState: Log = {
  id: "",
  name: "",
  user: "",
  fields: {},
  entries: {},
  ...initialCRUDState,
};

export type FieldValue = string | number | boolean | [number, number] | string[];

/**
 * Initial state for a log field in the store
 * @typedef {Object} LogField
 * @property {string} id - The id of the log field
 * @property {string} name - The name of the log field
 * @property {string} type - The type of the log field
 * @property {boolean} required - Whether the log field is required
 * @property {FieldValue|undefined} defaultValue - The default value of the log field
 */
export interface LogField extends CrudState {
  id: string;
  name: string;
  type: string;
  required: boolean;
  user?: string;
  option?: string;
  typeOptions?: string[];
  typeOptionStrings?: string[];
  defaultValue: undefined | FieldValue;
}
export const initialFieldState: LogField = {
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
export interface TextLogField extends LogField {
  type: "text";
  option: "text" | "textarea";
  typeOptions: ["text", "textarea"];
  typeOptionStrings: ["Single Line", "Multi Line"];
  min: number;
  max: number;
}
export const initialTextFieldState: TextLogField = {
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
export interface NumberLogField extends LogField {
  type: "number";
  min: number;
  max: number;  
  step: number;
  typeOptions: ["number", "range"];
  typeOptionStrings: ["Number Input", "Range Slider"],
  option: "number" | "range";
  unit: string;
}

export const initialNumberFieldState: NumberLogField = {
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
export interface RangeLogField extends NumberLogField {
  option: "range";
}
export const initialRangeFieldState: RangeLogField = {
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
export interface TagsLogField extends LogField {
  type: "tags";
}
export const initialTagsFieldState: TagsLogField = {
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
export interface BooleanLogField extends LogField {
  type: "boolean";
}
export const initialBooleanFieldState: BooleanLogField = {
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
 * @property {string[]} options - The options of the select log field
 * @property {"one"|"many"} option - The selected option of the log field
 * @property {["one"|"many"]} typeOptions - The options of the log field
 * @property {[string,string]} typeOptionStrings - The human readable options of the log field
 */
export interface SelectLogField extends LogField {
  type: "select";
  options: string[];
  option: "one" | "many";
  typeOptions: ["one", "many"];
  typeOptionStrings: ["Select One", "Select Many"];
}
export const initialSelectFieldState: SelectLogField = {
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
export interface DateLogField extends LogField {
  type: "date";
}
export const initialDateFieldState: DateLogField = {
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
export interface TimeLogField extends LogField {
  type: "time";
}
export const initialTimeFieldState: TimeLogField = {
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
 */
export interface EntryValues extends CrudState {
  [fieldId: string]: FieldValue;
}

export interface LogEntry extends EntryValues {
  id: string;
  user: string;
  log: string;
}
export const initialLogEntryState: LogEntry = {
  id: "",
  log: "",
  user: "",
  ...initialCRUDState,
};
export type LogFields = TextLogField | NumberLogField | RangeLogField | TagsLogField | BooleanLogField | SelectLogField | DateLogField | TimeLogField;
export interface LogEntryStates {
  [type: string]: LogFields;
}
export const initialFieldStates: LogEntryStates = {
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
 * @returns {LogFields|LogField} The initial state for the log field
 * @example var newTextFieldState = getInitialFieldState("text")
 * @example var newNumberFieldState = getInitialFieldState("number")
 */
export const getNewFieldState = (type:string = "text"):LogField => {
  let newFieldState = {} as LogField;
  switch (type) {
    case "number":
      newFieldState = { ...initialNumberFieldState } as NumberLogField;
      break;
    case "tags":
      newFieldState = { ...initialTagsFieldState } as TagsLogField;
      break;
    case "boolean":
      newFieldState = { ...initialBooleanFieldState } as BooleanLogField;
      break;
    case "select":
      newFieldState = { ...initialSelectFieldState } as SelectLogField;
      break;
    case "date":
      newFieldState = { ...initialDateFieldState } as DateLogField;
      break;
    case "time":
      newFieldState = { ...initialTimeFieldState } as TimeLogField;
      break;
    case "text":
    default:
      newFieldState = { ...initialTextFieldState } as TextLogField;
      break;
  }
  return newFieldState;
};
