import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { DateLogField } from "../../store/Log";
import {
  ASTERISK,
  DEFAULT,
  EMPTY,
  NONE,
  TEXT_DANGER,
  TEXT_MUTED,
  UNDEFINED,
} from "../../strings";

export interface FieldDateProps extends FormikProps<{ [key: string]: string }> {
  field: DateLogField;
}

export const FieldDate: FC<FieldDateProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, defaultValue, option } = props.field;

  const defaultValueString = `${DEFAULT}${
    typeof defaultValue === UNDEFINED ? NONE : defaultValue
  }`;
  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Control
          type={option}
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[fieldId] || EMPTY}
          required={required}
        />
        {(touched[fieldId] && errors[fieldId] && (
          <Form.Text className={TEXT_DANGER}>{errors[fieldId]}</Form.Text>
        )) || (
          <Form.Text className={TEXT_MUTED}>{defaultValueString}</Form.Text>
        )}
      </Form.Group>
    </>
  );
};

export default FieldDate;
