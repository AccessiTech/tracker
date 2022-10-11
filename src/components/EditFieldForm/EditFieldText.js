import React from "react";
import { Form } from "react-bootstrap";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { formikPartialPropTypes } from "./../../utils";

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

      <TypeOptionSelect
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

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

EditFieldText.propTypes = { ...formikPartialPropTypes };
