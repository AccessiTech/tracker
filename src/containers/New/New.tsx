import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { v4 as uuidv4 } from "uuid";

import "./New.scss";

import { Form, Button } from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";
import store from "../../store/store";
import { addLog } from "../../store/Log";
import { CANCEL, PRIMARY, SECONDARY, SUBMIT, TEXT, TEXT_MUTED } from "../../strings";

export const NEW_LOG = "New Log";
export const LOG_NAME_LABEL = "Log Name";
export const LOG_NAME_PLACEHOLDER = "Enter log name";
export const LOG_NAME_HELP_TEXT = "What is the name of this log?";
export const CREATE_LOG = "Create Log";

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

export const New: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
          <h1>{NEW_LOG}</h1>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>{LOG_NAME_LABEL}</Form.Label>
              <Form.Control type={TEXT} placeholder={LOG_NAME_PLACEHOLDER} />
              <Form.Text className={TEXT_MUTED}>
                {LOG_NAME_HELP_TEXT}
              </Form.Text>
            </Form.Group>
            <br />
            <Button
              variant={SECONDARY}
              onClick={() => navigate("/")}
              className="mr-2"
            >
              {CANCEL}
            </Button>
            &nbsp;
            <Button
              variant={PRIMARY}
              type={SUBMIT}
              onClick={(e) => onCreateLog(e, navigate)}
            >
              {CREATE_LOG}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default New;
