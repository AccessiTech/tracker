import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Log } from "../../store/Log";

export const LogNameFormValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .test(
      "is-valid-name",
      "Name cannot just be spaces",
      (value) => typeof value !== "undefined" && value.trim().length > 0
    ),
});

export interface LogNameFormProps {
  log: Log;
  onSubmit: (log:Log, values:any) => void;
}

export interface LogNameFormValues {
  name: string;
}

export const LogNameForm: FC<LogNameFormProps> = ({
  onSubmit,
  log,
}): ReactElement => {
  if (!onSubmit) {
    throw new Error("onSubmit is required");
  }
  const initialValues = {
    name: log.name || "",
  } as LogNameFormValues;
  return (
    <Formik
      initialValues={
        initialValues
      }
      onSubmit={(values:any) => onSubmit(log, values)}
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
                Object.keys(errors).length > 0 || values.name === log.name
              }
            >
              Save
            </Button>
          </InputGroup>
          {(touched.name && errors.name && (
            <Form.Text className="text-danger">{errors.name}</Form.Text>
          ))}
        </Form>
      )}
    </Formik>
  );
};

export default LogNameForm;
