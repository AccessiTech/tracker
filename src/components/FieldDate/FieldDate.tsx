import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { DateLogField } from "../../store/Log";

export interface FieldDateProps extends FormikProps<{ [key: string]: string }> {
  field: DateLogField;
}

export const FieldDate: FC<FieldDateProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, defaultValue, option } = props.field;

  const defaultValueString = `Default: ${
    typeof defaultValue === "undefined" ? "none" : defaultValue
  }`;
  const fieldLabel = `${name}${required ? "*" : ""}`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Control
          type={option}
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[fieldId] || ""}
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

export default FieldDate;
