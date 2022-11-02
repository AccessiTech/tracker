import React, { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./logEntry.scss";
import {
  addLogEntry,
  ADD_LOG_ENTRY_ACTION,
  FieldValue,
  Log,
  LogEntry as LogEntryType,
  LogFields,
  removeLogEntry,
  updateLogEntry,
  UPDATE_LOG_ENTRY_ACTION,
  useGetLog,
  useGetLogEntry,
} from "../../store/Log";
import { Formik } from "formik";
import store from "../../store/store";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { FieldText } from "../../components/FieldText";
import { FieldNumber } from "../../components/FieldNumber";
import { FieldDate } from "../../components/FieldDate";
import { FieldBoolean } from "../../components/FieldBoolean";
import { FieldSelect } from "../../components/FieldSelect";
import {
  BOOLEAN,
  CANCEL,
  DATE,
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
  UNDEFINED,
  WARNING,
} from "../../strings";
import { SetToast } from "../../components/Toaster";

export const LABEL = "label";

export const ENTRY_HEADER = " Entry";
export const ENTRY_LABEL = "Entry Label";
export const NO_LOG_FIELDS = "This log doesn't have any fields yet";
export const ENTRY_NOT_SAVED = "Entry not saved";
export const ENTRY_NOT_UPDATED = "Entry not updated";

export const onLogEntrySubmit = (
  values: { [fieldId: string]: FieldValue; label: string },
  log: Log,
  entry: LogEntryType
) => {
  const entryId: string = entry && entry.id ? entry.id : uuidv4();
  const newValues = {
    ...values,
  };

  const newEntry: LogEntryType = {
    ...entry,
    id: entryId,
    values: newValues,
  };

  const payload = {
    logId: log.id,
    entryId,
    entry: newEntry,
  };
  store.dispatch((entry ? updateLogEntry : addLogEntry)(payload));
};

export const onLogEntryDelete = (entry: LogEntryType, log: Log) => {
  store.dispatch(removeLogEntry({ logId: log.id, entryId: entry.id }));
};

export interface LogEntryProps {
  setToast: SetToast;
}

export const LogEntry: FC<LogEntryProps> = ({
  setToast,
}): ReactElement | null => {
  const { id: logId, entry: entryId } = useParams() as {
    id: string;
    entry: string;
  };
  const navigate = useNavigate();
  const log: Log = useGetLog(logId);
  const entry: LogEntryType = useGetLogEntry(logId, entryId);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [isNewEntry] = React.useState(
    typeof entryId === UNDEFINED || typeof entry === UNDEFINED
  );

  const { name, fields, labelOption } = log || {};
  const logFields: LogFields[] = Object.values(fields || {});

  React.useEffect(() => {
    if (!log) {
      navigate("/");
      setToast({
        show: true,
        name: OOPS,
        context: LOG_NOT_FOUND,
        status: WARNING,
      });
    } else if (!logFields.length) {
      setToast({
        show: true,
        name: OOPS,
        context: NO_LOG_FIELDS,
        status: WARNING,
      });
      navigate(`/log/${logId}/edit`);
    }
  }, [log, logId, navigate, logFields.length]);

  React.useEffect(() => {
    if (cancel) {
      navigate(-1);
    }
  }, [cancel, navigate]);

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
          onSubmit={(values) => {
            onLogEntrySubmit(values, log, entry);
            setToast({
              show: true,
              name: log.name,
              context: isNewEntry ? ADD_LOG_ENTRY_ACTION : UPDATE_LOG_ENTRY_ACTION,
            })
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
                      <Form.Group>
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
                        <Form.Group key={id}>
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
                          context: isNewEntry ? ENTRY_NOT_SAVED : ENTRY_NOT_UPDATED,
                          status: SECONDARY,
                        })
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
