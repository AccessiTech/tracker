import React, { FC, ReactElement } from "react";
import { Form } from "react-bootstrap";
import { FormikProps } from "formik";
import { BooleanLogField } from "../../store/Log";
import {
  ASTERISK,
  CHECKBOX,
  EMPTY,
  SWITCH,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";
import "./fieldBoolean.scss";

export interface FieldBooleanProps
  extends FormikProps<{ [key: string]: boolean }> {
  field: BooleanLogField;
}

export const FieldBoolean: FC<FieldBooleanProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const {
    id: fieldId,
    name,
    required,
    defaultValue,
    option,
    trueLabel,
    falseLabel,
  } = props.field;

  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}`;
  const valueString = "Value: " + (values[fieldId] ? trueLabel : falseLabel);

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <br />
        <Form.Check
          className={`entry__field_boolean__${option}`}
          type={option === SWITCH ? SWITCH : CHECKBOX}
          inline={option !== SWITCH}
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
        )) || <Form.Text className={TEXT_MUTED}>{valueString}</Form.Text>}
      </Form.Group>
    </>
  );
};

export default FieldBoolean;
