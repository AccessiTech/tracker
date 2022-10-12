import React from "react";
import { PropTypes } from "prop-types";
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
      (value) => value && value.trim().length > 0
    ),
});

export const LogNameForm = ({ onSubmit, logName }) => {
  if (!onSubmit) {
    throw new Error("onSubmit is required");
  }
  return (
    <Formik
      initialValues={{ name: logName || "" }}
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

LogNameForm.propTypes = {
  logName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
