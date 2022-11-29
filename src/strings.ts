// Magic Strings
export const PRIMARY = "primary";
export const SECONDARY = "secondary";
export const DANGER = "danger";
export const MUTED = "muted";
export const SUCCESS = "success";
export const WARNING = "warning";
export const INFO = "info";
export const DARK = "dark";
export const OUTLINE_PRIMARY = `outline-${PRIMARY}`;
export const OUTLINE_SECONDARY = `outline-${SECONDARY}`;
export const OUTLINE_DANGER = `outline-${DANGER}`;
export const OUTLINE_DARK = `outline-${DARK}`;
export const TEXT_DANGER = `text-${DANGER}`;
export const TEXT_MUTED = `text-${MUTED}`;
export const TEXT_SUCCESS = `text-${SUCCESS}`;
export const TYPE = "type";
export const SUBMIT = "submit";
export const RESET = "reset";
export const MODAL = "modal";
export const DATE = "date";
export const TIME = "time";
export const DATETIME = "datetime";
export const DATETIME_LOCAL = "datetime-local";
export const TEXT = "text";
export const TEXTAREA = "textarea";
export const INPUT = "input";
export const NUMBER = "number";
export const RANGE = "range";
export const BOOLEAN = "boolean";
export const SWITCH = "switch";
export const CHECKBOX = "checkbox";
export const SELECT = "select";
export const TRUE = "true";
export const FALSE = "false";
export const EMPTY = "";
export const ASTERISK = "*";
export const HYPHEN = "-";
export const NONE = "none";
export const MANY = "many";
export const LABEL_OPTION = "labelOption";
export const MIDDLE = "middle";
export const SM = "sm";
export const MIN = "min";
export const MAX = "max";
export const STEP = "step";
export const COMMA = ",";
export const COMMA_SPACE = ", ";
export const ADD = "add";
export const END = "end";
export const ID = "ID";
export const CREATED_AT = "createdAt";
export const UPDATED_AT = "updatedAt";
export const SORT_DESC = "desc";
export const SORT_ASC = "asc";
export const SORT = "sort";
export const ORDER = "order";
export const EXPORT = "export";
export const IMPORT = "import";
export const FILE = "file";
export const DOT_CSV = ".csv";
export const DOT_JSON = ".json";
export const NEW = "new";
export const EDIT = "edit";

// Display Strings
export const HOME = "Home";
export const EDIT_LOG = "Edit Log";
export const VIEW_LOG = "View Log";
export const ADD_ENTRY = "Add Entry";
export const EDIT_ENTRY = "Edit Entry";
export const DELETE_ENTRY = "Delete Entry";
export const ACTIONS = "Actions";
export const SUBMIT_STRING = "Submit";
export const RESET_STRING = "Reset";
export const SAVE = "Save";
export const CANCEL = "Cancel";
export const DELETE = "Delete";
export const DEFAULT = "Default: ";
export const DEFAULTS = "Defaults";
export const FIELD = "Field";
export const FIELDS = "Fields";
export const NAME_LABEL = "Name";
export const DATE_LABEL = "Date";
export const TEXT_LABEL = "Text";
export const NUMBER_LABEL = "Number";
export const SELECT_LABEL = "Select";
export const BOOLEAN_LABEL = "Boolean";
export const TYPE_LABEL = "Type";
export const TYPE_OPTION_LABEL = "Type Option";
export const REQUIRED_LABEL = "Required";
export const EDIT_LABEL = "Edit";
export const NONE_LABEL = "None";
export const STEPS_LABEL = "Steps";
export const CREATE_LABEL = "Create";
export const UPDATE_LABEL = "Update";
export const SIDEBAR_HEADER = "About the App";
export const OOPS = "Oops!";
export const LOG_NOT_FOUND = "Log not found";
export const DATA = "Data";
export const CSV = "CSV";

// Route Strings
export const WILDCARD = "*";
export const HOME_URL = "/";
export const NEW_URL = "/new";
export const LOG_URL = "/log/";
export const LOG_ID_URL_PARAM = ":id";
export const LOG_ID_URL = LOG_ID_URL_PARAM;
export const ENTRY_URL = "entry/";
export const ENTRY_ID_URL_PARAM = ":entry";
export const ENTRY_EDIT_URL = ENTRY_URL + ENTRY_ID_URL_PARAM;
export const EDIT_URL = "edit/";
export const FIELD_URL_PARAM = ":field";
export const FIELD_URL = `field/${FIELD_URL_PARAM}`;
export const EDIT_LOG_URL = LOG_URL + LOG_ID_URL_PARAM + "/edit";
export const EDIT_LOG_FIELD_URL = EDIT_LOG_URL + "/" + FIELD_URL;
export const ADD_LOG_FIELD_URL = EDIT_LOG_URL + "/field/new";
export const ADD_LOG_ENTRY_URL = LOG_URL + LOG_ID_URL_PARAM + "/entry";
export const EDIT_LOG_ENTRY_URL =
  LOG_URL + LOG_ID_URL_PARAM + "/entry/" + ENTRY_ID_URL_PARAM;

export const getLogUrl = (id: string) => {
  return LOG_URL + id;
};

export const getEditLogURL = (id: string): string =>
  EDIT_LOG_URL.replace(LOG_ID_URL_PARAM, id);

export const getEditLogFieldURL = (id: string, field: string): string =>
  EDIT_LOG_FIELD_URL.replace(LOG_ID_URL_PARAM, id).replace(FIELD_URL_PARAM, field);

export const getAddLogFieldURL = (id: string): string =>
  ADD_LOG_FIELD_URL.replace(LOG_ID_URL_PARAM, id);

export const getAddLogEntryURL = (id: string): string =>
  ADD_LOG_ENTRY_URL.replace(LOG_ID_URL_PARAM, id);

export const getEditLogEntryURL = (id: string, entry: string): string =>
  EDIT_LOG_ENTRY_URL.replace(LOG_ID_URL_PARAM, id).replace(
    ENTRY_ID_URL_PARAM,
    entry
  );