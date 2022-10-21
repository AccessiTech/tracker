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
import { FieldDate } from "../../components/FieldDate";

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

  const initialValues = {
    label: entry ? entry.values.label : new Date().toLocaleString(),
    labelOption: entry ? entry.values.labelOption : "date",
  } as any;

  for (const f of logFields) {
    initialValues[f.id] = isNewEntry ? f.defaultValue : entry.values[f.id];
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

                // define label value
                const isLabelDate = formikProps.values.labelOption === "date";
                const isLabelValue =
                  !isLabelDate && formikProps.values.labelOption !== "text";
                const labelValue = isLabelDate
                  ? new Date().toLocaleString()
                  : isLabelValue
                  ? formikProps.values[formikProps.values.labelOption] || ""
                  : formikProps.values.label;

                return (
                  <Form onSubmit={handleSubmit} className="form__log_entry">
                    <Form.Group>
                      <Row>
                        <Col>
                          <Form.Label>Entry Label</Form.Label>
                          <Form.Control
                            type="text"
                            name="label"
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            value={labelValue}
                            required
                          />
                        </Col>
                        <Col>
                          <Form.Label>Options</Form.Label>
                          <Form.Control
                            as="select"
                            name="labelOption"
                            onChange={formikProps.handleChange}
                            onBlur={formikProps.handleBlur}
                            value={formikProps.values.labelOption}
                            required
                          >
                            <option value="text">Text</option>
                            <option value="date">Date</option>
                            {logFields.map((field) => (
                              <option
                                key={`label-options-${field.id}`}
                                value={field.id}
                              >
                                {field.name}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>
                    {logFields.map((field: LogFields) => {
                      const { id, type } = field;

                      return (
                        <Form.Group key={id}>
                          {type === "text" && (
                            <FieldText {...formikProps} field={field} />
                          )}
                          {type === "number" && (
                            <FieldNumber {...formikProps} field={field} />
                          )}
                          {type === "date" && (
                            <FieldDate {...formikProps} field={field} />
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
