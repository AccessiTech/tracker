import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import store from "../../store/store";
import { useGetLog, updateLog, removeLog } from "../../store/Log";
import "./Edit.scss";

// import { v4 as uuidv4 } from "uuid";

export const onUpdateLog = (e, navigate, log) => {
  e.preventDefault();
  const updatedLog = {
    ...log,
    name: e.target.form[0].value,
  };
  store.dispatch(updateLog({ logId: log.id, log: updatedLog }));
  navigate("/");
};

export const onDeleteLog = (e, navigate, log) => {
  e.preventDefault();
  store.dispatch(removeLog({ logId: log.id }));
  navigate("/");
}

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const log = useGetLog(id);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Edit Log</h1>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Log Name</Form.Label>
              <Form.Control type="text" placeholder="Enter log name" defaultValue={log.name} />
              <Form.Text className="text-muted">
                This is the name of the log.
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => onUpdateLog(e, navigate, log)}
            >Update Log</Button>
            <Button
              variant="danger"
              type="submit"
              onClick={(e) => onDeleteLog(e, navigate, log)}
            >Delete Log</Button>
            <Button
              variant="secondary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >Cancel</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Edit;
