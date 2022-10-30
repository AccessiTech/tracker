import React, { FC, ReactElement } from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { BooleanLogField } from "../../store/Log";

export interface FieldBooleanProps
  extends FormikProps<{ [key: string]: string }> {
  field: BooleanLogField;
}

export const FieldBoolean: FC<FieldBooleanProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, defaultValue } = props.field;

  const fieldLabel = `${name}${required ? "*" : ""}`;
  const defaultValueString = `Default: ${
    typeof defaultValue === "undefined" ? false : defaultValue
  }`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Check
          type="switch"
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          defaultChecked={
            ((values[fieldId] || defaultValue) as boolean) || false
          }
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

export default FieldBoolean;
