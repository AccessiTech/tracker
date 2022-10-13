import React from "react";
import { Form } from "react-bootstrap";
import { fieldPropTypes, formikPartialPropTypes } from "../../utils";

export const FieldText = (props) => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id:fieldId, option, name, required } = props.field;

  const inputAs = (option === "textarea" && "textarea") || "input";
  return (
    <>
      <Form.Group>
        <Form.Label>{name}</Form.Label>
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
        )) || <Form.Text className="text-muted">{"Default: none"}</Form.Text>}
      </Form.Group>
    </>
  );
};

FieldText.propTypes = {
  ...formikPartialPropTypes,
  ...fieldPropTypes,
};

export default FieldText;


