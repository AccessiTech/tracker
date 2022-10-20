import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { TextLogField } from "../../store/Log";

export interface FieldTextProps extends FormikProps<{ [key: string]: string }> {
  field: TextLogField;
}

export const FieldText: FC<FieldTextProps> = (props): ReactElement => {
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

export default FieldText;
