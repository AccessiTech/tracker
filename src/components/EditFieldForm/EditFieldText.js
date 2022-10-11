import React from "react";
import { PropTypes } from "prop-types";
import { Form } from "react-bootstrap";

export const EditFieldText = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  return (
    <Form.Group>
      <hr />
      <h5>Text Field Options</h5>
      <Form.Label>{"Default Value"}</Form.Label>
      <Form.Control
        type="text"
        name="defaultValue"
        placeholder="Enter the default text for this field"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.defaultValue}
      />
      {(touched.defaultValue && errors.defaultValue && (
        <Form.Text className="text-danger">{errors.defaultValue}</Form.Text>
      )) || (
        <Form.Text className="text-muted">
          {"This is the default value of the field"}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default EditFieldText;

EditFieldText.propTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
};
