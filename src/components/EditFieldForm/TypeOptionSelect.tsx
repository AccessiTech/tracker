import { FormikProps } from "formik";
import React, { FC, ReactElement} from "react";
import { Form } from "react-bootstrap";
import { initialFieldStates } from "../../store/Log";
import { capitalizeFirstLetter } from "./../../utils";

export interface TypeOptionSelectProps extends FormikProps<{[key:string]:string}> {}


export const TypeOptionSelect:FC<TypeOptionSelectProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}):ReactElement|null => {
  const { typeOptions, typeOptionStrings } = initialFieldStates[values.type];
  if (!typeOptions || !typeOptionStrings) return null;

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
