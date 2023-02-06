import React, { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Formik } from "formik";

import store from "../../store/store";
import {
  addLogEntry,
  ADD_LOG_ENTRY_ACTION,
  FieldValue,
  getLog,
  Log,
  LogEntry as LogEntryType,
  LogFields,
  updateLogEntry,
  UPDATE_LOG_ENTRY_ACTION,
  useGetLog,
  useGetLogEntry,
} from "../../store/Log";
import { DataSyncState, useDataSync } from "../../store/DataSync";
import { getAuthenticated } from "../../store/Session";

import { syncLogSheet, SyncLogSheetResponse } from "../../services/DataSync";

import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { FieldText } from "../../components/FieldText";
import { FieldNumber } from "../../components/FieldNumber";
import { FieldDate } from "../../components/FieldDate";
import { FieldBoolean } from "../../components/FieldBoolean";
import { FieldSelect } from "../../components/FieldSelect";
import { SetToast } from "../../components/Toaster";
import { handleError, updateLocalLog } from "../../components/DataSync";

// import { getTimestamp, notify } from "../../utils";
import {
  BOOLEAN,
  CANCEL,
  DATE,
  getEditLogURL,
  HOME_URL,
  LOG_NOT_FOUND,
  NUMBER,
  OOPS,
  PRIMARY,
  RESET,
  SECONDARY,
  SELECT,
  SUBMIT,
  SUBMIT_STRING,
  TEXT,
  WARNING,
} from "../../strings";
import "./logEntry.scss";

// Magic strings
export const LABEL = "label";

// Display strings
export const ENTRY_HEADER = " Entry";
export const ENTRY_LABEL = "Entry Label";
export const NO_LOG_FIELDS = "This log doesn't have any fields yet";
export const ENTRY_NOT_SAVED = "Entry not saved";
export const ENTRY_NOT_UPDATED = "Entry not updated";

/**
 * Log Entry Submission Callback
 */
export interface OnLogEntrySubmitParams {
  values: { [fieldId: string]: FieldValue; label: string };
  log: Log;
  entry: LogEntryType;
  authenticated?: boolean;
  dataSyncState?: DataSyncState;
}
export const onLogEntrySubmit = async ({
  values,
  log,
  entry,
  authenticated,
  dataSyncState,
}: OnLogEntrySubmitParams) => {
  const entryId: string = entry && entry.id ? entry.id : uuidv4();
  const newValues = {
    ...values,
  };

  const newEntry: LogEntryType = {
    ...entry,
    id: entryId,
    values: newValues,
  };

  await store.dispatch(
    (entry ? updateLogEntry : addLogEntry)({
      logId: log.id,
      entryId,
      entry: newEntry,
    })
  );
  // sync log entries
  if (authenticated && dataSyncState?.syncSettings) {
    const sync = dataSyncState[dataSyncState.syncMethod];
    if (sync?.logSheets && sync.logSheets[log.id]) {
      const { onAddEntry, onEditEntry } = dataSyncState.syncSettings;
      if (onAddEntry || onEditEntry) {
        const newLog = getLog(store.getState(), log.id)
        syncLogSheet({
          log: newLog,
          logSheetId: sync.logSheets[log.id].id,
          onError: handleError,
        }).then((updates: SyncLogSheetResponse) => {
          updateLocalLog({ log: newLog, updates, store })
        }).catch((error) => {
          const syncMethod = entry ? 'onEditEntry' : 'onAddEntry';
          console.error(`Error syncing ${syncMethod}: `, error);
        });
      }
    }
  }
};


/**
 * Log Entry Page
 * @param {LogEntryProps} logEntryProps - props
 */

export interface LogEntryProps {
  setToast: SetToast;
}

export interface LogEntryValues {
  [fieldId: string]: FieldValue;
  label: string;
}

export const LogEntry: FC<LogEntryProps> = ({
  setToast,
}): ReactElement | null => {
  const navigate = useNavigate();
  const dataSyncState = useDataSync();
  const authenticated = getAuthenticated(store.getState());

  // Get log and entry from store
  const { id: logId, entry: entryId } = useParams() as {
    id: string;
    entry: string;
  };
  const log: Log = useGetLog(logId);
  const entry: LogEntryType = useGetLogEntry(logId, entryId);
  const { name, fields, labelOption } = log || {};
  const logFields: LogFields[] = Object.values(fields || {});

  // Page state
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [isNewEntry] = React.useState(
    typeof entryId === "undefined" || typeof entry === "undefined"
  );

  React.useEffect(() => {
    // If log doesn't exist, redirect to Home
    if (!log) {
      navigate(HOME_URL);
      setToast({
        show: true,
        name: OOPS,
        context: LOG_NOT_FOUND,
        status: WARNING,
      });
    } else if (!logFields.length) {
      // If log doesn't have any fields, redirect to Edit page
      setToast({
        show: true,
        name: OOPS,
        context: NO_LOG_FIELDS,
        status: WARNING,
      });
      navigate(getEditLogURL(logId));
    }
  }, [log, logId, navigate, logFields.length]);

  React.useEffect(() => {
    // If cancel is true, redirect to back
    if (cancel) {
      navigate(-1);
    }
  }, [cancel, navigate]);

  // populate initial entry values
  const initialValues = {} as any;
  for (const f of logFields) {
    initialValues[f.id] = isNewEntry ? f.defaultValue : entry.values[f.id];
  }

  return !log || !logFields.length ? null : (
    <>
      <Container>
        <Row>
          <Col>
            <Header
              title={`${name}${ENTRY_HEADER}`}
              toggleSidebar={setShowSidebar}
            />
            <hr />
          </Col>
        </Row>
        <Formik
          initialValues={initialValues}
          // todo: add validation
          onSubmit={(values) => {
            // todo: Implement recurrence and reminders when there is a backend
            // todo: Add checkbox to confirm setting the reminder on submit
            // if (isNewEntry && log.recurrence?.enabled) {
            //   notify({
            //     title: `Log Reminder: ${log.name}`,
            //     body: `You have a log entry for ${log.name} due today!`,
            //     timestamp: getTimestamp(log.recurrence),
            //     tag: log.id,
            //   });
            // }
            onLogEntrySubmit({ values, log, entry, authenticated, dataSyncState, });
            setToast({
              show: true,
              name: log.name,
              context: isNewEntry
                ? ADD_LOG_ENTRY_ACTION
                : UPDATE_LOG_ENTRY_ACTION,
            });
            setCancel(true);
          }}
        >
          {(formikProps) => {
            const isTextLabel = labelOption === TEXT;
            return (
              <Form
                onSubmit={formikProps.handleSubmit}
                className="form__log_entry"
              >
                <Row>
                  <Col>
                    {isTextLabel && (
                      <Form.Group className="entry__field_container">
                        <Form.Label>{ENTRY_LABEL}</Form.Label>
                        <Form.Control
                          type={TEXT}
                          name={LABEL}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          value={formikProps.values.label}
                        />
                      </Form.Group>
                    )}
                    {logFields.map((field: LogFields) => {
                      const { id, type } = field;

                      return (
                        <Form.Group key={id} className="entry__field_container">
                          {type === TEXT && (
                            <FieldText {...formikProps} field={field} />
                          )}
                          {type === NUMBER && (
                            <FieldNumber {...formikProps} field={field} />
                          )}
                          {type === DATE && (
                            <FieldDate {...formikProps} field={field} />
                          )}
                          {type === BOOLEAN && (
                            <FieldBoolean {...formikProps} field={field} />
                          )}
                          {type === SELECT && (
                            <FieldSelect {...formikProps} field={field} />
                          )}
                        </Form.Group>
                      );
                    })}
                  </Col>
                </Row>

                <Row className="form__button_row">
                  <Col>
                    <Button
                      variant={SECONDARY}
                      type={RESET}
                      onClick={() => {
                        setCancel(true);
                        setToast({
                          show: true,
                          name: log.name,
                          context: isNewEntry
                            ? ENTRY_NOT_SAVED
                            : ENTRY_NOT_UPDATED,
                          status: SECONDARY,
                        });
                      }}
                    >
                      {CANCEL}
                    </Button>
                  </Col>
                  <Col>
                    <Button variant={PRIMARY} type={SUBMIT}>
                      {SUBMIT_STRING}
                    </Button>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
        <Sidebar showSidebar={showSidebar} toggleSidebar={setShowSidebar} />
      </Container>
    </>
  );
};

export default LogEntry;
