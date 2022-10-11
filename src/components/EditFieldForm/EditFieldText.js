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
    <>
      <hr />
      <h5>Text Field Options</h5>
      <Form.Group>
        <Form.Label>Text Field Type</Form.Label>
        <Form.Control
          as="select"
          name="option"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.option}
        >
          {values.typeOptions.map((option, i) => {
            const key = `${values.type}-${i}`;
            const displayValue = values.typeOptionStrings[i];
            return (
              <option key={key} value={option}>
                {displayValue}
              </option>
            );
          })}
        </Form.Control>
        {(touched.option && errors.option && (
          <Form.Text className="text-danger">{errors.option}</Form.Text>
        )) || (
          <Form.Text className="text-muted">
            What type of text field is this?
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group>
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
    </>
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
