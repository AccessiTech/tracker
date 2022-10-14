import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./logEntry.scss";
import { addLogEntry, useGetLog } from "../../store/Log";
import { Formik } from "formik";
import store from "../../store/store";
import FieldText from "../../components/FieldText/FieldText";
import { FieldNumber } from "../../components/FieldNumber";

export const onLogEntrySubmit = (values, log) => {
  const { id } = values;
  store.dispatch(
    addLogEntry({
      logId: log.id,
      entry: {
        ...values,
        id: id || uuidv4(),
      },
    })
  );
};

function LogEntry() {
  const { id: logId } = useParams();
  const navigate = useNavigate();
  const log = useGetLog(logId);
  const [cancel, setCancel] = React.useState(false);

  const { name, fields } = log || {};
  const logFields = Object.values(fields || {});

  React.useEffect(() => {
    if (!log) {
      navigate("/");
    } else if (!fields) {
      navigate(`/log/${logId}/edit`);
    }
  }, [log, fields, logId, navigate]);

  React.useEffect(() => {
    if (cancel) {
      navigate(`/`);
    }
  }, [cancel, navigate]);

  const initialValues = {};

  for (const f of logFields) {
    initialValues[f.id] = f.defaultValue;
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
                onLogEntrySubmit(values, log);
                setCancel(true);
              }}
            >
              {(formikProps) => {
                const { handleSubmit } = formikProps;

                return (
                  <Form onSubmit={handleSubmit} className="form__log_entry">
                    {logFields.map((field) => {
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
}

export default LogEntry;
