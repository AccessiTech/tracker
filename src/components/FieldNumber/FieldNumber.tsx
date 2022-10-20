import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form, InputGroup } from "react-bootstrap";
import { NumberLogField } from "../../store/Log";

export interface FieldNumberProps
  extends FormikProps<{ [key: string]: string }> {
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

  const fieldLabel = `${name}${required ? "*" : ""}${unit ? ` (${unit})` : ""}`;
  const valueLabel = `Value: ${values[fieldId]}`;
  const minMaxLabel = `Min: ${min}; Max: ${max};`;
  const isRange = option === "range";

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
            type="number"
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
          <Form.Text className="text-danger">{errors[fieldId]}</Form.Text>
        )) || (
          <Form.Text className="text-muted">
            {isRange ? valueLabel : minMaxLabel}
          </Form.Text>
        )}
      </Form.Group>
    </>
  );
};

export default FieldNumber;
