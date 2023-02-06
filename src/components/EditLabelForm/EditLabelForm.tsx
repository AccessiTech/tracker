import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { InputGroup, Form, Button } from "react-bootstrap";
import { Log, LogFields } from "../../store/Log";
import { getAuthenticated } from "../../store/Session";
import { OnUpdateLogParams } from "../../containers/Edit";
import { useDataSync } from "../../store/DataSync";
import {
  DATE,
  DATE_LABEL,
  DEFAULTS,
  FIELDS,
  LABEL_OPTION,
  PRIMARY,
  SAVE,
  SELECT,
  SUBMIT,
  TEXT,
  TEXT_LABEL,
} from "../../strings";
import store from "../../store/store";

export const ENTRY_LABEL = "Entry Label";

export interface EditLabelFormProps {
  log: Log;
  onSubmit: (params: OnUpdateLogParams) => void;
}

export const EditLabelForm: FC<EditLabelFormProps> = ({
  log,
  onSubmit,
}): ReactElement => {
  const { fields } = log as Log;
  const initialValues = {
    labelOption: log.labelOption || DATE,
  } as Log & { [key: string]: string };
  const logFields: LogFields[] = Object.values(fields || {});
  const dataSyncState = useDataSync();
  const authenticated = getAuthenticated(store.getState());
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) =>
        onSubmit({ log, values, authenticated, dataSyncState })
      }
    >
      {(formikProps) => {
        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <Form.Label>{ENTRY_LABEL}</Form.Label>
            <InputGroup>
              <Form.Control
                as={SELECT}
                name={LABEL_OPTION}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={formikProps.values.labelOption}
                required
              >
                <optgroup label={DEFAULTS}>
                  <option value={DATE}>{DATE_LABEL}</option>
                  <option value={TEXT}>{TEXT_LABEL}</option>
                </optgroup>
                <optgroup label={FIELDS}>
                  {logFields.map((field) => (
                    <option key={`label-options-${field.id}`} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </optgroup>
              </Form.Control>

              <Button
                variant={PRIMARY}
                type={SUBMIT}
                disabled={formikProps.values.labelOption === log.labelOption}
              >
                {SAVE}
              </Button>
            </InputGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditLabelForm;
