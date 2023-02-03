import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { SelectLogField } from "../../store/Log";
import {
  ASTERISK,
  COMMA,
  EMPTY,
  HYPHEN,
  MANY,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export const SELECT_AN_OPTION = "Select an option";

export interface EditFieldSelectProps
  extends FormikProps<{ [key: string]: string|string[] }> {
  field: SelectLogField;
}

export const FieldSelect: FC<EditFieldSelectProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, option, options } = props.field;
  const fieldLabel = `${name}${required ? ASTERISK : EMPTY}`;
  const selectOptions = options.split(COMMA).map((option) => option.trim());
  const isMulti = option === MANY;
  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Select
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[fieldId] as string | string[]}
          required={required}
          multiple={isMulti}
        >
          {selectOptions.map((option) => (
            <option
              key={`${fieldId}-${option.replace(/ /g, HYPHEN)}`}
              value={option}
            >
              {option}
            </option>
          ))}
        </Form.Select>
        {(touched[fieldId] && errors[fieldId] && (
          <Form.Text className={TEXT_DANGER}>{errors[fieldId]}</Form.Text>
        )) || <Form.Text className={TEXT_MUTED}>{SELECT_AN_OPTION}</Form.Text>}
      </Form.Group>
    </>
  );
};

export default FieldSelect;
