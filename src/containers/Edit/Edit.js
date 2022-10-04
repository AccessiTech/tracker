import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import store from "../../store/store";
import { useGetLog, updateLog, removeLog } from "../../store/Log";
import "./Edit.scss";
import { addLogField, removeLogField } from "../../store/Log/reducer";

export const onUpdateLog = (e, log) => {
  e.preventDefault();
  const updatedLog = {
    ...log,
    name: e.target.form[0].value,
  };
  store.dispatch(updateLog({ logId: log.id, log: updatedLog }));
};

export const onDeleteLog = (e, log) => {
  e.preventDefault();
  store.dispatch(removeLog({ logId: log.id }));
};

export const onAddField = (e, log) => {
  e.preventDefault();
  const field = {
    id: uuidv4(),
    name: e.target.form[0].value,
    type: e.target.form[1].value,
  };

  store.dispatch(addLogField({ logId: log.id, field }));
};

export const onDeleteField = (e, log, fieldId) => {
  e.preventDefault();
  store.dispatch(removeLogField({ logId: log.id, fieldId }));
};

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const log = useGetLog(id);

  if (!log || id !== log.id || !log.fields) {
    return navigate("/");
  }

  const fields = Object.values(log.fields);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Edit Log</h1>
          <Form>
            <Form.Group>
              <Form.Label>Log Name</Form.Label>
              <InputGroup>
                <Form.Control type="text" defaultValue={log.name} />
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => onUpdateLog(e, log)}
                >
                  Save
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                This is the name of the log.
              </Form.Text>
            </Form.Group>
          </Form>
          <h2>Fields</h2>
          {fields && fields.length ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col" style={{ width: "20%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.name}</td>
                    <td>{field.type}</td>
                    <td>
                      <Button variant="secondary">Edit</Button>&nbsp;
                      <Button
                        variant="danger"
                        onClick={(e) => onDeleteField(e, log, field.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No fields yet.</p>
          )}
          <Form>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>Field Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter field name" />
                  <Form.Text className="text-muted">
                    This is the name of the field.
                  </Form.Text>
                </Col>
                <Col>
                  <Form.Label>Add Field Type</Form.Label>
                  <Form.Control as="select">
                    <option>Text</option>
                    <option>Tag</option>
                    <option>Number</option>
                    <option>Date</option>
                    <option>Time</option>
                    <option>Boolean</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    This is the type of the field.
                  </Form.Text>
                </Col>
                <Col md={2}>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => onAddField(e, log)}
                    style={{ marginTop: "2rem", width: "100%" }}
                  >
                    Add Field
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <br />
          <Button
            variant="danger"
            type="submit"
            onClick={(e) => (onDeleteLog(e, log), navigate("/"))}
          >
            Delete Log
          </Button>
          &nbsp;
          <Button
            variant="secondary"
            type="submit"
            onClick={(e) => (e.preventDefault(), navigate("/"))}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Edit;
