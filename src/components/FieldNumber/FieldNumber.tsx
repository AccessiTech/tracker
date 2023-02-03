import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form, InputGroup } from "react-bootstrap";
import { NumberLogField } from "../../store/Log";
import {
  ASTERISK,
  EMPTY,
  NUMBER,
  RANGE,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export const VALUE = "Value: ";
export const MIN = "Min: ";
export const MAX = "Max: ";

export interface FieldNumberProps
  extends FormikProps<{ [key: string]: string|number }> {
  field: NumberLogField;
}

export const FieldNumber: FC<FieldNumberProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const {
    id: fieldId,
    option,
    name,
    step,
    min,
    max,
    required,
    unit,
  } = props.field;

  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}${
    unit ? ` (${unit})` : EMPTY
  }`;
  const valueLabel = `${VALUE}${values[fieldId]}`;
  const minMaxLabel = `${MIN}${min}; ${MAX}${max};`;
  const isRange = option === RANGE;

  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        {(isRange && (
          <InputGroup>
            <InputGroup.Text>{min}</InputGroup.Text>
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
            <InputGroup.Text>{max}</InputGroup.Text>
          </InputGroup>
        )) || (
          <Form.Control
            type={NUMBER}
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
          <Form.Text className={TEXT_DANGER}>{errors[fieldId]}</Form.Text>
        )) || (
          <Form.Text className={TEXT_MUTED}>
            {isRange ? valueLabel : minMaxLabel}
          </Form.Text>
        )}
      </Form.Group>
    </>
  );
};

export default FieldNumber;
