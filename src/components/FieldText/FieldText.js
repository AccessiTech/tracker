import React from "react";
import { Form } from "react-bootstrap";
import { fieldPropTypes, formikPartialPropTypes } from "../../utils";

export const FieldText = (props) => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, option, name, required, defaultValue } = props.field;

  const inputAs = (option === "textarea" && "textarea") || "input";
  const fieldLabel = `${name}${required ? "*" : ""}`;
  const defaultValueString = `Default: ${
    typeof defaultValue === "undefined" ? "none" : defaultValue
  }`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Control
          type="text"
          as={inputAs}
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[fieldId]}
          required={required}
        />
        {(touched[fieldId] && errors[fieldId] && (
          <Form.Text className="text-danger">{errors[fieldId]}</Form.Text>
        )) || (
          <Form.Text className="text-muted">{defaultValueString}</Form.Text>
        )}
      </Form.Group>
    </>
  );
};

FieldText.propTypes = {
  ...formikPartialPropTypes,
  ...fieldPropTypes,
};

export default FieldText;
