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

export interface HandleFieldsFunction {
  (values: { [key: string]: string }, log: Log, field: LogFields): void;
}
export const onHandleField: HandleFieldsFunction = (values, log, field) => {
  const { id, name, type, required, option, defaultValue, unit } = values;

  const prevField = {
    ...(field.type === type
      ? field
      : { ...field, ...initialFieldStates[type] }),
  };

  const newField = {
    ...prevField,
    id: id || uuidv4(),
    name,
    type,
    required,
    defaultValue,
    unit,
    option,
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
        name: Yup.string().required("Required"),
        type: Yup.string().required("Required"),
        option: Yup.string().when("type", {
          is: "select",
          then: Yup.string().required("Required"),
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
        } = props;
        return (
          <Form onSubmit={handleSubmit} className="form__field_edit">
            {/* Name, Type, and Required inputs */}
            <Form.Group>
              <Form.Label>Field Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter field name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {(touched.name && errors.name && (
                <Form.Text className="text-danger">{errors.name}</Form.Text>
              )) || (
                <Form.Text className="text-muted">
                  This is the name of the field
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>Field Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.type}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Selection</option>
                    <option value="tags">Tags</option>
                    <option value="boolean">Boolean</option>
                  </Form.Control>
                  {(touched.type && errors.type && (
                    <Form.Text className="text-danger">{errors.type}</Form.Text>
                  )) || (
                    <Form.Text className="text-muted">
                      This is the type of the field.
                    </Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>Required</Form.Label>
                  <Form.Check
                    type="switch"
                    name="required"
                    className="form__field_edit__required"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultChecked={values.required as unknown as boolean}
                  />
                  {(touched.required && errors.required && (
                    <Form.Text className="text-danger">
                      {errors.required}
                    </Form.Text>
                  )) || (
                    <Form.Text className="text-muted">
                      Is this field required?
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            {values.type === "text" && <EditFieldText {...props} />}

            {values.type === "number" && <EditFieldNumber {...props} />}

            {values.type === "date" && <EditFieldDate {...props} />}

            <hr />
            {/* Cancel and Submit Buttons */}
            <Form.Group>
              <Row className="form__field_edit__submit_row">
                <Col>
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={(e) => {
                      e.preventDefault();
                      resetModal();
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                    {`${modalMode === "add" ? "Create" : "Update"} Field`}
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
