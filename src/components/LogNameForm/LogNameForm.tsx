import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Form, Button, InputGroup } from "react-bootstrap";
import { Log } from "../../store/Log";
import { EMPTY, PRIMARY, SAVE, SUBMIT, TEXT, TEXT_DANGER } from "../../strings";
import { OnUpdateLogParams } from "../../containers/Edit";
import { useAuthenticated } from "../../store/Session";
import { useDataSync } from "../../store/DataSync";

export const NAME = "name";

export const NAME_IS_REQUIRED = "Name is required";
export const NAME_IS_SPACES = "Name cannot be spaces";
export const LOG_NAME = "Log Name";

export const LogNameFormValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required(NAME_IS_REQUIRED)
    .test(
      "is-valid-name",
      NAME_IS_SPACES,
      (value) => typeof value !== "undefined" && value.trim().length > 0
    ),
});

export interface LogNameFormProps {
  log: Log;
  onSubmit: (params:OnUpdateLogParams) => void;
}

export interface LogNameFormValues {
  name: string;
}

export const LogNameForm: FC<LogNameFormProps> = ({
  onSubmit,
  log,
}): ReactElement => {
  const initialValues = {
    name: log.name || EMPTY,
  } as LogNameFormValues;
  const authenticated = useAuthenticated();
  const dataSyncState = useDataSync();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) => onSubmit({ log, values, authenticated, dataSyncState })}
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
        <Form onSubmit={handleSubmit} className="edit__form_row">
          <Form.Label>{LOG_NAME}</Form.Label>
          <InputGroup>
            <Form.Control
              type={TEXT}
              name={NAME}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <Button
              variant={PRIMARY}
              type={SUBMIT}
              disabled={
                Object.keys(errors).length > 0 || values.name === log.name
              }
            >
              {SAVE}
            </Button>
          </InputGroup>
          {touched.name && errors.name && (
            <Form.Text className={TEXT_DANGER}>{errors.name}</Form.Text>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LogNameForm;
