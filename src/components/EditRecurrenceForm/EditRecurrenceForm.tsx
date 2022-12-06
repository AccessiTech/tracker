import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { Form, Button, Col, Row } from "react-bootstrap";
import { Log } from "../../store/Log";
import {
  PRIMARY,
  RESET,
  RESET_STRING,
  SAVE,
  SECONDARY,
  SUBMIT,
  SWITCH,
} from "../../strings";

export interface EditRecurrenceFormProps {
  log: Log;
  onSubmit: (log: Log, values: any) => void;
}

export const EditRecurrenceForm: FC<EditRecurrenceFormProps> = ({
  log,
  onSubmit,
}): ReactElement => {
  const { enabled, interval, unit, start, end } = log.recurrence || {};
  const initialValues = {
    enabled: enabled || false,
    interval: interval || 1,
    unit: unit || "day",
    start: start || "",
    end: end || "",
  } as {
    [key: string]: any;
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(log, { recurrence: values})}
    >
      {(formikProps) => {
        const { dirty, values } = formikProps;
        const areButtonsDisabled =
          !dirty ||
          (values.enabled === initialValues.enabled &&
            values.interval === initialValues.interval &&
            values.unit === initialValues.unit &&
            values.start === initialValues.start &&
            values.end === initialValues.end);

        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <h4>{"Recurrence"}</h4>
            <Form.Group className="edit__form_row">
              <Form.Label>{"Enabled"}</Form.Label>
              <Form.Check
                type={SWITCH}
                name="enabled"
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                value={values.enabled}
                checked={values.enabled}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{"Interval"}*</Form.Label>
              <br />
              <Row className="edit__form_row">
                <Col>
                  <Form.Control
                    type={"number"}
                    name="interval"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={values.interval}
                    required={values.enabled}
                    disabled={!values.enabled}
                  />
                </Col>
                <Col>
                  <Form.Control
                    as={"select"}
                    name="unit"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={values.unit}
                    required={values.enabled}
                    disabled={!values.enabled}
                  >
                    <option value={"day"}>{"Days"}</option>
                    <option value={"week"}>{"Weeks"}</option>
                    <option value={"month"}>{"Months"}</option>
                    <option value={"year"}>{"Years"}</option>
                  </Form.Control>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>{"Start"}</Form.Label>
                  <Form.Control
                    type={"date"}
                    name="start"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={values.start}
                    disabled={!values.enabled}
                  />
                </Col>
                <Col>
                  <Form.Label>{"End"}</Form.Label>
                  <Form.Control
                    type={"date"}
                    name="end"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={values.end}
                    disabled={!values.enabled}
                  />
                </Col>
              </Row>
              <br />
            </Form.Group>
            <div className="edit__recurrence__btn_row">
              <Button
                variant={SECONDARY}
                type={RESET}
                disabled={areButtonsDisabled}
                onClick={formikProps.handleReset}
              >
                {RESET_STRING}
              </Button>
              <Button
                variant={PRIMARY}
                type={SUBMIT}
                disabled={areButtonsDisabled}
              >
                {SAVE}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditRecurrenceForm;
