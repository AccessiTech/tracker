import React, { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./logEntry.scss";
import {
  addLogEntry,
  FieldValue,
  Log,
  LogEntry as LogEntryType,
  LogFields,
  removeLogEntry,
  updateLogEntry,
  useGetLog,
  useGetLogEntry,
} from "../../store/Log";
import { Formik } from "formik";
import store from "../../store/store";
import FieldText from "../../components/FieldText/FieldText";
import { FieldNumber } from "../../components/FieldNumber";

export const onLogEntrySubmit = (
  values: { [fieldId: string]: FieldValue },
  log: Log,
  entry: LogEntryType
) => {
  const newId: string = uuidv4();
  const payload = {
    logId: log.id,
    entryId: entry && entry.id ? entry.id : newId,
    entry: {
      ...values,
      id: values.id || newId,
    },
  };
  store.dispatch((entry ? updateLogEntry : addLogEntry)(payload));
};

export const onLogEntryDelete = (entry: LogEntryType, log: Log) => {
  store.dispatch(removeLogEntry({ logId: log.id, entryId: entry.id }));
};

export const LogEntry: FC = (): ReactElement | null => {
  const { id: logId, entry: entryId } = useParams() as {
    id: string;
    entry: string;
  };
  const navigate = useNavigate();
  const log: Log = useGetLog(logId);
  const entry: LogEntryType = useGetLogEntry(logId, entryId);
  const [cancel, setCancel] = React.useState(false);
  const [isNewEntry] = React.useState(
    typeof entryId === "undefined" || typeof entry === "undefined"
  );

  const { name, fields } = log;
  const logFields: LogFields[] = Object.values(fields || {});

  React.useEffect(() => {
    if (!log) {
      navigate("/");
    } else if (!logFields.length) {
      navigate(`/log/${logId}/edit`);
    }
  }, [log, logId, navigate, logFields.length]);

  React.useEffect(() => {
    if (cancel) {
      navigate(`/log/${logId}`);
    }
  }, [cancel, navigate]);

  const initialValues = {} as any;

  for (const f of logFields) {
    initialValues[f.id] = isNewEntry ? f.defaultValue : entry[f.id];
  }

  return !log || !logFields.length ? null : (
    <>
      <Container>
        <Row>
          <Col>
            <h1>{`${name} Entry`}</h1>
            <hr />
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => {
                onLogEntrySubmit(values, log, entry);
                setCancel(true);
              }}
            >
              {(formikProps) => {
                const { handleSubmit } = formikProps;

                return (
                  <Form onSubmit={handleSubmit} className="form__log_entry">
                    {logFields.map((field: LogFields) => {
                      const { id, type } = field;
                      <Form.Label>{log.name}</Form.Label>;

                      return (
                        <Form.Group key={id}>
                          {type === "text" && (
                            <FieldText {...formikProps} field={field} />
                          )}
                          {type === "number" && (
                            <FieldNumber {...formikProps} field={field} />
                          )}
                        </Form.Group>
                      );
                    })}
                    <Button
                      variant="secondary"
                      type="reset"
                      onClick={() => setCancel(true)}
                    >
                      Cancel
                    </Button>
                    &nbsp;
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LogEntry;
