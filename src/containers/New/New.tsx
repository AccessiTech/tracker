import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { v4 as uuidv4 } from "uuid";

import "./New.scss";

import { Form, Button } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";
import store from "../../store/store";
import { addLog } from "../../store/Log";

export const onCreateLog = (e: any, navigate: NavigateFunction) => {
  e.preventDefault();
  const log = {
    id: uuidv4(),
    name: e.target.form[0].value,
    fields: {},
    entries: {},
  };
  store.dispatch(addLog({ log }));
  navigate("/log/" + log.id + "/edit");
};

function New() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
          <h1>New Log</h1>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Log Name</Form.Label>
              <Form.Control type="text" placeholder="Enter log name" />
              <Form.Text className="text-muted">
                This is the name of the log.
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => onCreateLog(e, navigate)}
            >
              Create Log
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default New;
