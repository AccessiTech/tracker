import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { TextLogField } from "../../store/Log";
import {
  ASTERISK,
  DEFAULT,
  EMPTY,
  INPUT,
  NONE,
  TEXT,
  TEXTAREA,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export interface FieldTextProps extends FormikProps<{ [key: string]: string }> {
  field: TextLogField;
}

export const FieldText: FC<FieldTextProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, option, name, required, defaultValue } = props.field;

  const inputAs = (option === TEXTAREA && TEXTAREA) || INPUT;
  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}`;
  const defaultValueString = `${DEFAULT} ${
    typeof defaultValue === "undefined" ? NONE : defaultValue
  }`;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Control
          type={TEXT}
          as={inputAs}
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

export default FieldText;
