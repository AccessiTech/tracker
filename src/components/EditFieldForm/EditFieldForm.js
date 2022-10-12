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
  initialTextFieldState,
} from "../../store/Log";
import { Form, Button, Row, Col } from "react-bootstrap";
import { EditFieldText } from "./EditFieldText";
import "./editFieldForm.scss";
import EditFieldNumber from "./EditFieldNumber";

export const onHandleField = (values, log, field) => {
  const { id, name, type, required, option, defaultValue } = values;

  const prevField = {
    ...(field.type === type
      ? field
      : { ...field, ...initialFieldStates[type] }),
  };

  const newField = {
    ...prevField,
    id: id || uuidv4(),
    name,
    type,
    required,
    defaultValue,
  };

  if (field.option) {
    newField.option = option;
  }

  if (id) {
    store.dispatch(
      updateLogField({ logId: log.id, fieldId: id, field: newField })
    );
  } else {
    store.dispatch(addLogField({ logId: log.id, field: newField }));
  }
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
        onHandleField(values, log, fieldState);
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
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit} className="form__field_edit">
          {/* Name, Type, and Required inputs */}
          <Form.Group>
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
          </Form.Group>
          <Form.Group>
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
              <Col>
                <Form.Label>Required</Form.Label>
                <Form.Check
                  type="switch"
                  name="required"
                  className="form__field_edit__required"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultChecked={values.required}
                />
                {(touched.required && errors.required && (
                  <Form.Text className="text-danger">
                    {errors.required}
                  </Form.Text>
                )) || (
                  <Form.Text className="text-muted">
                    Is this field required?
                  </Form.Text>
                )}
              </Col>
            </Row>
          </Form.Group>

          {values.type === "text" && (
            <EditFieldText
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
            />
          )}

          {values.type === "number" && (
            <EditFieldNumber
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}

          <hr />
          {/* Cancel and Submit Buttons */}
          <Form.Group>
            <Row className="form__field_edit__submit_row">
              <Col>
                <Button
                  variant="secondary"
                  type="reset"
                  onClick={(e) => {
                    e.preventDefault();
                    resetModal();
                  }}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button variant="primary" type="submit">
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
