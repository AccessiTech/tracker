import React from "react";
import { PropTypes } from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Formik } from "formik";
import * as Yup from "yup";
import store from "../../store/store";
import {
  addLogField,
  updateLogField,
  initialFieldStates,
  // getNewFieldState,
  initialTextFieldState,
} from "../../store/Log";
import { Form, Button, Row, Col } from "react-bootstrap";

export const onAddField = (values, log) => {
  const { name, type, option } = values;
  const field = {
    ...initialFieldStates[type],
    id: uuidv4(),
    name,
    type,
  };

  if (field.option && option) {
    field.option = option;
  }

  store.dispatch(addLogField({ logId: log.id, field }));
};

export const onUpdateField = (values, log, field) => {
  const { name, type, option } = values;

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

export const EditFieldForm = ({ fieldId, log, modalMode, resetModal }) => {
  const fieldState = fieldId
    ? log.fields[fieldId]
    : { ...initialTextFieldState };

  return (
    <Formik
      initialValues={{
        ...fieldState,
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        option: Yup.string().when("type", {
          is: "select",
          then: Yup.string().required("Required"),
        }),
      })}
      onSubmit={(values) => {
        if (modalMode === "add") {
          onAddField(values, log);
        } else {
          onUpdateField(values, log, fieldState);
        }
        resetModal();
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          {/* Name, Type, and Option inputs */}
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Field Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter field name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {(touched.name && errors.name && (
                  <Form.Text className="text-danger">{errors.name}</Form.Text>
                )) || (
                  <Form.Text className="text-muted">
                    This is the name of the field
                  </Form.Text>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Field Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="select">Selection</option>
                  <option value="tags">Tags</option>
                  <option value="boolean">Boolean</option>
                </Form.Control>
                {(touched.type && errors.type && (
                  <Form.Text className="text-danger">{errors.type}</Form.Text>
                )) || (
                  <Form.Text className="text-muted">
                    This is the type of the field.
                  </Form.Text>
                )}
              </Col>
              {initialFieldStates[values.type].typeOptions &&
                values.typeOptions && (
                  <Col>
                    <Form.Label>Field Options</Form.Label>
                    <Form.Control
                      as="select"
                      name="option"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.option}
                    >
                      {values.typeOptions.map((option, i) => {
                        const key = `${values.type}-${i}`;
                        const displayValue =
                          initialFieldStates[values.type].typeOptionStrings[i];
                        return (
                          <option key={key} value={option}>
                            {displayValue}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                )}
            </Row>
          </Form.Group>

          {/* todo - include type-specific form inputs */}


          {/* Cancel and Submit Buttons */}
          <Form.Group>
            <Row>
              <Col
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  marginTop: "1rem",
                }}
              >
                <Button
                  variant="secondary"
                  type="reset"
                  style={{ width: "50%" }}
                  onClick={(e) => {
                    e.preventDefault();
                    resetModal();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "50%" }}
                >
                  {`${modalMode === "add" ? "Create" : "Update"} Field`}
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

EditFieldForm.propTypes = {
  fieldId: PropTypes.string.isRequired,
  log: PropTypes.object.isRequired,
  modalMode: PropTypes.string.isRequired,
  resetModal: PropTypes.func.isRequired,
};

export default EditFieldForm;
