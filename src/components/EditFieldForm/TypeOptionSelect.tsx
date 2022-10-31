import { FormikProps } from "formik";
import React, { FC, ReactElement } from "react";
import { Form } from "react-bootstrap";
import { initialFieldStates } from "../../store/Log";
import { SELECT, TEXT_DANGER, TEXT_MUTED } from "../../strings";
import { capitalizeFirstLetter } from "./../../utils";

export const OPTION = "option";
export const FIELD_TYPE = " Field Type";

export interface TypeOptionSelectProps
  extends FormikProps<{ [key: string]: string }> {}

export const TypeOptionSelect: FC<TypeOptionSelectProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}): ReactElement | null => {
  const { typeOptions, typeOptionStrings } = initialFieldStates[values.type];
  if (!typeOptions || !typeOptionStrings) return null;

  return (
    <Form.Group>
      <Form.Label>
        {capitalizeFirstLetter(values.type)}
        {FIELD_TYPE}
      </Form.Label>
      <Form.Control
        as={SELECT}
        name={OPTION}
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
        <Form.Text className={TEXT_DANGER}>{errors.option}</Form.Text>
      )) || (
        <Form.Text className={TEXT_MUTED}>
          {`What type of ${values.type} field is this?`}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default TypeOptionSelect;
