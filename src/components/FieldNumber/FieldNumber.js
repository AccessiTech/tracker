import React from "react";
import { Form } from "react-bootstrap";
import { fieldPropTypes, formikPartialPropTypes } from "../../utils";

export const FieldNumber = (props) => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id:fieldId, option, name, step, min, max, required } = props.field;

  return (
    <>
      <Form.Group>
        <Form.Label>{name}</Form.Label>
        {(option === "range" && (
          <Form.Range
            name={fieldId}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[fieldId]}
            step={step || 1}
            min={min || 0}
            max={max || 100}
            required={required}
          />
        )) || (
          <Form.Control
            type="number"
            name={fieldId}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[fieldId]}
            step={step || 1}
            min={min || 0}
            max={max || 100}
            required={required}
          />
        )}

        {(touched[fieldId] && errors[fieldId] && (
          <Form.Text className="text-danger">{errors[fieldId]}</Form.Text>
        )) || <Form.Text className="text-muted">{"Default: none"}</Form.Text>}
      </Form.Group>
    </>
  );
}

FieldNumber.propTypes = {
  ...formikPartialPropTypes,
  ...fieldPropTypes,
};

export default FieldNumber;