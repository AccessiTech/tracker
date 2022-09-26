import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./New.scss";

import { Form, Button } from "react-bootstrap";

function New() {

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
            <Button variant="primary" type="submit">Create Log</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default New;
