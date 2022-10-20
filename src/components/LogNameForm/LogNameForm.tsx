import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, InputGroup } from "react-bootstrap"

export const LogNameFormValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .test(
      "is-valid-name",
      "Name cannot just be spaces",
      (value) => (typeof value !== 'undefined') && value.trim().length > 0
    ),
});

export interface LogNameFormProps {
  logName: string;
  onSubmit: () => void;
}

export interface LogNameFormValues {
  name: string;
}

export const LogNameForm = ({ onSubmit, logName }:LogNameFormProps) => {
  if (!onSubmit) {
    throw new Error("onSubmit is required");
  }
  const initialValues: LogNameFormValues = {
    name: logName || "",
  };
  return (
    <Formik
      initialValues={initialValues as React.FormEvent<HTMLFormElement> & LogNameFormValues}
      onSubmit={onSubmit}
      validationSchema={LogNameFormValidationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Label>Log Name</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={
                Object.keys(errors).length > 0 || values.name === logName
              }
            >
              Save
            </Button>
          </InputGroup>
          {touched.name && errors.name && (
            <Form.Text className="text-danger">{errors.name}</Form.Text>
          ) || (
            <Form.Text className="text-muted">
              This is the name of the log.
            </Form.Text>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default LogNameForm;
