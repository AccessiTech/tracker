import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import './logEntry.scss';
import { useGetLog } from "../../store/Log";
import { Formik } from "formik";

function LogEntry () {
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

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>{`${name} Entry`}</h1>
            <hr />
            <Formik
              initialValues={{}}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {(formikProps) => {
                const {
                  values,
                  // handleBlur,
                  // handleChange,
                  handleSubmit
                } = formikProps;

                return (
                  <Form onSubmit={handleSubmit}>
                    {fields.map((field) => {
                      const { id, name, type } = field;
                      const value = values[id] || "";

                      return (
                        <Form.Group key={id}>
                          <Form.Label>{name}</Form.Label>
                          <Form.Label>{type}</Form.Label>
                          <Form.Label>{value}</Form.Label>
                          {/* <Form.Control
                            type={type}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          /> */}
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
