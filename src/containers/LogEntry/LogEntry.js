import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./logEntry.scss";
import { useGetLog } from "../../store/Log";
import { Formik } from "formik";
import FieldText from "../../components/FieldText/FieldText";
import { FieldNumber } from "../../components/FieldNumber";

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
      navigate(`/edit/${logId}`);
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
                console.log(values);
              }}
            >
              {(formikProps) => {
                const { handleSubmit } = formikProps;

                return (
                  <Form onSubmit={handleSubmit}>
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
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                    <Button
                      variant="secondary"
                      type="reset"
                      onClick={() => setCancel(true)}
                    >
                      Cancel
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
