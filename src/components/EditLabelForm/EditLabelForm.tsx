import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Log, LogFields } from "../../store/Log";

export interface EditLabelFormProps {
  log: Log;
  onSubmit: (log: Log, values: any) => void;
}

export const EditLabelForm: FC<EditLabelFormProps> = ({
  log,
  onSubmit,
}): ReactElement => {
  const { fields } = log as Log;
  const initialValues = {
    labelOption: log.labelOption || "date",
  } as Log & { [key: string]: string };
  const logFields: LogFields[] = Object.values(fields || {});
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(log, values)}
    >
      {(formikProps) => {
        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <Form.Label>Entry Label</Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                name="labelOption"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.labelOption}
                required
              >
                <optgroup label="Defaults">
                  <option value="date">Date</option>
                  <option value="text">Text</option>
                </optgroup>
                <optgroup label="Fields">
                  {logFields.map((field) => (
                    <option key={`label-options-${field.id}`} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </optgroup>
              </Form.Control>

              <Button
                variant="primary"
                type="submit"
                disabled={formikProps.values.labelOption === log.labelOption}
              >
                Save
              </Button>
            </InputGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditLabelForm;
