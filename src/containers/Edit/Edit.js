import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import store from "../../store/store";
import {
  useGetLog,
  updateLog,
  removeLog,
  initialTextFieldState,
  initialNumberFieldState,
  initialTagsFieldState,
  initialBooleanFieldState,
  initialSelectFieldState,
} from "../../store/Log";
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
  const name = e.target.form[0].value;
  const type = e.target.form[1].value;
  const option = e.target.form[2].value;
  const field = {
    ...(initialFieldStates[type]),
    id: uuidv4(),
    name,
    type,
  };

  if (field.option && option) {
    field.option = option;
  }

  store.dispatch(addLogField({ logId: log.id, field }));
};

export const onUpdateField = (e, log, field) => {
  e.preventDefault();
  const name = e.target.form[0].value;
  const type = e.target.form[1].value;
  const option = e.target.form[2].value;

  const updatedField = {
    ...(field.type === type ? field : initialFieldStates[type]),
    id: field.id,
    name,
    type,
  };

  if (field.option) {
    updatedField.option = option;
  }

  store.dispatch(
    updateLogField({ logId: log.id, fieldId: field.id, field: updatedField })
  );
};

export const onDeleteField = (e, log, fieldId) => {
  e.preventDefault();
  store.dispatch(removeLogField({ logId: log.id, fieldId }));
};

export const getNewFieldState = (type) => {
  let newFieldState = {};
  switch (type) {
    case "number":
      newFieldState = { ...initialNumberFieldState };
      break;
    case "tags":
      newFieldState = { ...initialTagsFieldState };
      break;
    case "boolean":
      newFieldState = { ...initialBooleanFieldState };
      break;
    case "select":
      newFieldState = { ...initialSelectFieldState };
      break;
    case "text":
    default:
      newFieldState = { ...initialTextFieldState };
      break;
  }
  return newFieldState;
};

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const log = useGetLog(id);

  if (!log || id !== log.id || !log.fields) {
    return navigate("/");
  }

  const [newFieldType, setNewFieldType] = React.useState("text");
  const [newFieldState, setNewFieldState] = React.useState({
    ...initialTextFieldState,
  });

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
                  <Form.Control
                    type="text"
                    placeholder="Enter field name"
                    required
                  />
                  <Form.Text className="text-muted">
                    This is the name of the field.
                  </Form.Text>
                </Col>
                <Col>
                  <Form.Label>Add Field Type</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      const newFieldState = getNewFieldState(e.target.value);
                      setNewFieldType(e.target.value);
                      setNewFieldState(newFieldState);
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Selection</option>
                    <option value="tags">Tags</option>
                    <option value="boolean">Boolean</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    This is the type of the field.
                  </Form.Text>
                </Col>
                {newFieldState.typeOptions && (
                  <Col>
                    <Form.Label>Field Options</Form.Label>
                    <Form.Control as="select">
                      {newFieldState.typeOptions &&
                        newFieldState.typeOptions.map((option, i) => {
                          const key = `${newFieldType}-${i}`;
                          const displayValue =
                            newFieldState.typeOptionStrings[i];
                          return (
                            <option key={key} value={option}>
                              {displayValue}
                            </option>
                          );
                        })}
                    </Form.Control>
                  </Col>
                )}
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
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Edit;
