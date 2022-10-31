import React, { FC, ReactElement } from "react";
import { v4 as uuidv4 } from "uuid";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col } from "react-bootstrap";
import store from "../../store/store";
import {
  addLogField,
  updateLogField,
  initialFieldStates,
  initialTextFieldState,
  Log,
  LogFields,
} from "../../store/Log";
import { EditFieldText } from "./EditFieldText";
import { EditFieldNumber } from "./EditFieldNumber";
import { EditFieldDate } from "./EditFieldDate";
import "./editFieldForm.scss";
import { EditFieldSelect } from "./EditFieldSelect";
import {
  ADD,
  BOOLEAN,
  BOOLEAN_LABEL,
  CANCEL,
  CREATE_LABEL,
  DATE,
  DATE_LABEL,
  FIELD,
  NUMBER,
  NUMBER_LABEL,
  PRIMARY,
  REQUIRED_LABEL,
  RESET,
  SECONDARY,
  SELECT,
  SELECT_LABEL,
  SUBMIT,
  SWITCH,
  TEXT,
  TEXT_DANGER,
  TEXT_LABEL,
  TEXT_MUTED,
  TYPE,
  UPDATE_LABEL,
} from "../../strings";

export const NAME = "name";
export const REQUIRED = "required";

export const FIELD_NAME_LABEL = "Field Name";
export const FIELD_NAME_PLACEHOLDER = "Enter field name";
export const FIELD_NAME_HELP_TEXT = "What is the name of this field?";
export const FIELD_TYPE_LABEL = "Field Type";
export const FIELD_TYPE_HELP_TEXT = "What type of field is this?";
export const FIELD_REQUIRED_HELP_TEXT = "Is this field required?";

export interface HandleFieldsFunction {
  (values: { [key: string]: string }, log: Log, field: LogFields): void;
}
export const onHandleField: HandleFieldsFunction = (values, log, field) => {
  const { id, type } = values;
  const prevField = {
    ...(field.type === type
      ? field
      : { ...field, ...initialFieldStates[type] }),
  };

  const newField = {
    ...prevField,
    ...values,
    id: id || uuidv4(),
  };

  if (id) {
    store.dispatch(
      updateLogField({ logId: log.id, fieldId: id, field: newField })
    );
  } else {
    store.dispatch(addLogField({ logId: log.id, field: newField }));
  }
};

export interface EditFieldFormProps {
  log: Log;
  fieldId: string | undefined;
  modalMode: string;
  resetModal: () => void;
}
export interface EditFieldFormValues {
  [key: string]: any;
}

export const EditFieldForm: FC<EditFieldFormProps> = ({
  fieldId,
  log,
  modalMode,
  resetModal,
}): ReactElement => {
  const fieldState: EditFieldFormValues = fieldId
    ? log.fields[fieldId]
    : { ...initialTextFieldState };

  return (
    <Formik
      initialValues={{
        ...fieldState,
      }}
      validationSchema={Yup.object({
        name: Yup.string().required(REQUIRED_LABEL),
        type: Yup.string().required(REQUIRED_LABEL),
        option: Yup.string().when(TYPE, {
          is: SELECT,
          then: Yup.string().required(REQUIRED_LABEL),
        }),
      })}
      onSubmit={(values: { [key: string]: string }) => {
        onHandleField(values, log, fieldState as LogFields);
        resetModal();
      }}
    >
      {(props: FormikProps<{ [key: string]: string }>) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setValues,
        } = props;
        return (
          <Form onSubmit={handleSubmit} className="form__field_edit">
            {/* Name, Type, and Required inputs */}
            <Form.Group>
              <Form.Label>{FIELD_NAME_LABEL}</Form.Label>
              <Form.Control
                type={TEXT}
                name={NAME}
                placeholder={FIELD_NAME_PLACEHOLDER}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {(touched.name && errors.name && (
                <Form.Text className={TEXT_DANGER}>{errors.name}</Form.Text>
              )) || (
                <Form.Text className={TEXT_MUTED}>
                  {FIELD_NAME_HELP_TEXT}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{FIELD_TYPE_LABEL}</Form.Label>
                  <Form.Control
                    as={SELECT}
                    name={TYPE}
                    onChange={(e) => {
                      handleChange(e);
                      const prevValues = { ...values };
                      const newValues = {
                        ...initialFieldStates[e.target.value],
                      } as any;
                      setValues({
                        ...prevValues,
                        ...newValues,
                        id: prevValues.id,
                        name:
                          prevValues.name ===
                          initialFieldStates[prevValues.type].name
                            ? newValues.name
                            : prevValues.name,
                      });
                    }}
                    onBlur={handleBlur}
                    value={values.type}
                  >
                    <option value={TEXT}>{TEXT_LABEL}</option>
                    <option value={NUMBER}>{NUMBER_LABEL}</option>
                    <option value={DATE}>{DATE_LABEL}</option>
                    <option value={SELECT}>{SELECT_LABEL}</option>
                    {/* <option value="tags">Tags</option> */}
                    <option value={BOOLEAN}>{BOOLEAN_LABEL}</option>
                  </Form.Control>
                  {(touched.type && errors.type && (
                    <Form.Text className={TEXT_DANGER}>{errors.type}</Form.Text>
                  )) || (
                    <Form.Text className={TEXT_MUTED}>
                      {FIELD_TYPE_HELP_TEXT}
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>{REQUIRED_LABEL}</Form.Label>
                  <Form.Check
                    type={SWITCH}
                    name={REQUIRED}
                    className="form__field_edit__required"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultChecked={values.required as unknown as boolean}
                  />
                  {(touched.required && errors.required && (
                    <Form.Text className={TEXT_DANGER}>
                      {errors.required}
                    </Form.Text>
                  )) || (
                    <Form.Text className={TEXT_MUTED}>
                      {FIELD_REQUIRED_HELP_TEXT}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            {values.type === TEXT && <EditFieldText {...props} />}

            {values.type === NUMBER && <EditFieldNumber {...props} />}

            {values.type === DATE && <EditFieldDate {...props} />}

            {values.type === SELECT && <EditFieldSelect {...props} />}

            <hr />
            {/* Cancel and Submit Buttons */}
            <Form.Group>
              <Row className="form__field_edit__submit_row">
                <Col>
                  <Button
                    variant={SECONDARY}
                    type={RESET}
                    onClick={(e) => {
                      e.preventDefault();
                      resetModal();
                    }}
                  >
                    {CANCEL}
                  </Button>
                </Col>
                <Col>
                  <Button variant={PRIMARY} type={SUBMIT}>
                    {`${
                      modalMode === ADD ? CREATE_LABEL : UPDATE_LABEL
                    } ${FIELD}`}
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditFieldForm;
