import React from "react";
import { Form } from "react-bootstrap";
import { initialFieldStates } from "../../store/Log";
import { capitalizeFirstLetter, formikPartialPropTypes } from "./../../utils";

export const TypeOptionSelect = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}) => {
  const { typeOptions, typeOptionStrings } = initialFieldStates[values.type];
  if (!typeOptions || !typeOptions.length) return null;

  return (
    <Form.Group>
      <Form.Label>{capitalizeFirstLetter(values.type)} Field Type</Form.Label>
      <Form.Control
        as="select"
        name="option"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.option}
      >
        {typeOptions.map((option, i) => {
          const key = `${values.type}-${i}`;
          const displayValue = typeOptionStrings[i];
          return (
            <option key={key} value={option}>
              {displayValue}
            </option>
          );
        })}
      </Form.Control>
      {(touched.option && errors.option && (
        <Form.Text className="text-danger">{errors.option}</Form.Text>
      )) || (
        <Form.Text className="text-muted">
          {`What type of ${values.type} field is this?`}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default TypeOptionSelect;

TypeOptionSelect.propTypes = { ...formikPartialPropTypes };
