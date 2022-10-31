import React, { FC, ReactElement } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { FormikProps } from "formik";
import { TypeOptionSelect } from "./TypeOptionSelect";
import {
  DEFAULT,
  MAX,
  MIN,
  NONE_LABEL,
  NUMBER,
  STEP,
  STEPS_LABEL,
  TEXT,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export const NUMBER_FIELD_OPTIONS = "Number Field Options";
export const MIN_VALUE = "Min Value";
export const MAX_VALUE = "Max Value";
export const UNIT = "unit";
export const UNIT_LABEL = "Unit";
export const UNIT_PLACEHOLDER = "Degrees, meters, etc.";
export const DEFAULT_VALUE = "defaultValue";
export const DEFAULT_VALUE_LABEL = "Default Value";
export const DEFAULT_VALUE_TEXT = "This is the default value of the field";

export interface EditFieldTextProps
  extends FormikProps<{ [key: string]: string }> {}

export const EditFieldNumber: FC<EditFieldTextProps> = (
  formikProps
): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>{NUMBER_FIELD_OPTIONS}</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...formikProps} />

            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{MIN_VALUE}</Form.Label>
                  <Form.Control
                    type={NUMBER}
                    name={MIN}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.min}
                  />
                  {(touched.min && errors.min && (
                    <Form.Text className={TEXT_DANGER}>{errors.min}</Form.Text>
                  )) || (
                    <Form.Text
                      className={TEXT_MUTED}
                    >{`${DEFAULT}0`}</Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>{MAX_VALUE}</Form.Label>
                  <Form.Control
                    type={NUMBER}
                    name={MAX}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.max}
                  />
                  {(touched.max && errors.max && (
                    <Form.Text className={TEXT_DANGER}>{errors.max}</Form.Text>
                  )) || (
                    <Form.Text className={TEXT_MUTED}>
                      {`${DEFAULT}100`}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{STEPS_LABEL}</Form.Label>
                  <Form.Control
                    type={NUMBER}
                    name={STEP}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.step}
                  />
                  {(touched.step && errors.step && (
                    <Form.Text className={TEXT_DANGER}>{errors.step}</Form.Text>
                  )) || (
                    <Form.Text
                      className={TEXT_MUTED}
                    >{`${DEFAULT}1`}</Form.Text>
                  )}
                </Col>
                <Col>
                  <Form.Label>{UNIT_LABEL}</Form.Label>
                  <Form.Control
                    type={TEXT}
                    name={UNIT}
                    placeholder={UNIT_PLACEHOLDER}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                  />
                  {(touched.unit && errors.unit && (
                    <Form.Text className={TEXT_DANGER}>{errors.unit}</Form.Text>
                  )) || (
                    <Form.Text className={TEXT_MUTED}>
                      {`${DEFAULT}${NONE_LABEL}`}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>{DEFAULT_VALUE_LABEL}</Form.Label>
              <Form.Control
                type={NUMBER}
                name={DEFAULT_VALUE}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.defaultValue}
              />
              {(touched.defaultValue && errors.defaultValue && (
                <Form.Text className={TEXT_DANGER}>
                  {errors.defaultValue}
                </Form.Text>
              )) || (
                <Form.Text className={TEXT_MUTED}>
                  {DEFAULT_VALUE_TEXT}
                </Form.Text>
              )}
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default EditFieldNumber;
