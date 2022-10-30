import React, { FC, ReactElement } from "react";
import { FormikProps } from "formik";
import { Form } from "react-bootstrap";
import { SelectLogField } from "../../store/Log";

export interface EditFieldSelectProps
  extends FormikProps<{ [key: string]: string }> {
  field: SelectLogField;
}

export const FieldSelect: FC<EditFieldSelectProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  const { id: fieldId, name, required, option, options } = props.field;
  const fieldLabel = `${name}${required ? "*" : ""}`;
  const selectOptions = options.split(",").map((option) => option.trim());
  const isMulti = option === "many";
  return (
    <>
      <Form.Group>
        <Form.Label>{fieldLabel}</Form.Label>
        <Form.Select
          name={fieldId}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[fieldId]}
          required={required}
          multiple={isMulti}
        >
          {selectOptions.map((option) => (
            <option
              key={`${fieldId}-${option.replace(/ /g, "-")}`}
              value={option}
            >
              {option}
            </option>
          ))}
        </Form.Select>
        {(touched[fieldId] && errors[fieldId] && (
          <Form.Text className="text-danger">{errors[fieldId]}</Form.Text>
        )) || (
          <Form.Text className="text-muted">{"Select an option"}</Form.Text>
        )}
      </Form.Group>
    </>
  );
};

export default FieldSelect;
