import React, { FC, ReactElement } from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { BooleanLogField } from "../../store/Log";
import {
  ASTERISK,
  CHECKBOX,
  DEFAULT,
  EMPTY,
  SWITCH,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export interface FieldBooleanProps
  extends FormikProps<{ [key: string]: string }> {
  field: BooleanLogField;
}

export const FieldBoolean: FC<FieldBooleanProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, defaultValue, option } = props.field;

  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}`; 
  const defaultValueString = `${DEFAULT}${
    typeof defaultValue === "undefined" ? false : defaultValue
  }`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Check
          type={option === SWITCH ? SWITCH : CHECKBOX}
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          defaultChecked={
            ((values[fieldId] || defaultValue) as boolean) || false
          }
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

export default FieldBoolean;
