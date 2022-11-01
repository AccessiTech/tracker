import {
  ADD_LOG_ACTION,
  ADD_LOG_ENTRY_ACTION,
  ADD_LOG_FIELD_ACTION,
  REMOVE_LOG_ACTION,
  REMOVE_LOG_ENTRY_ACTION,
  REMOVE_LOG_FIELD_ACTION,
  UPDATE_LOG_ACTION,
  UPDATE_LOG_ENTRY_ACTION,
  UPDATE_LOG_FIELD_ACTION,
} from "../../store/Log";
import { INFO, SUCCESS, WARNING } from "../../strings";

export type ToastTypes = "success" | "danger" | "warning" | "info";
export interface Toasts {
  [context: string]: {
    content: string;
    status: ToastTypes;
  };
}
export const toasts: Toasts = {
  [ADD_LOG_ACTION]: {
    content: "Creating Log...",
    status: SUCCESS,
  },
  [UPDATE_LOG_ACTION]: {
    content: "Log Updated",
    status: INFO,
  },
  [REMOVE_LOG_ACTION]: {
    content: "Deleting Log...",
    status: WARNING,
  },
  [ADD_LOG_FIELD_ACTION]: {
    content: "Field Added",
    status: SUCCESS,
  },
  [UPDATE_LOG_FIELD_ACTION]: {
    content: "Field Updated",
    status: INFO,
  },
  [REMOVE_LOG_FIELD_ACTION]: {
    content: "Field Deleted",
    status: WARNING,
  },
  [ADD_LOG_ENTRY_ACTION]: {
    content: "Entry Added",
    status: SUCCESS,
  },
  [UPDATE_LOG_ENTRY_ACTION]: {
    content: "Entry Updated",
    status: INFO,
  },
  [REMOVE_LOG_ENTRY_ACTION]: {
    content: "Entry Deleted",
    status: WARNING,
  },
};
