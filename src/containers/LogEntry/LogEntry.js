import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./logEntry.scss";
import { useGetLog } from "../../store/Log";
import { Formik } from "formik";
import FieldText from "../../components/FieldText/FieldText";
import { FieldNumber } from "../../components/FieldNumber";

function LogEntry() {
  const { logId } = useParams();
  const navigate = useNavigate();
  const log = useGetLog(logId);

  if (!log) {
    return navigate("/");
  } else if (!log.fields || !Object.keys(log.fields).length) {
    return navigate(`/edit/${logId}`);
  }

  const { name } = log;
  const fields = Object.values(log.fields);
  const initialValues = {};

  for (const f of fields) {
    initialValues[f.id] = f.defaultValue;
  }

  return (
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
                    {fields.map((field) => {
                      const { id, name, type } = field;

                      return (
                        <Form.Group key={id}>
                          <Form.Label>{name}</Form.Label>
                          {type === "text" && (
                            <FieldText {...formikProps} field={field} />
                          )}
                          {type === "number" && (
                            <FieldNumber {...formikProps} field={field} />
                          )}
                        </Form.Group>
                      );
                    })}
                    <Button type="submit">Submit</Button>
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
