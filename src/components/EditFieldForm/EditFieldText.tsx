import React, { FC, ReactElement } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { FormikProps } from "formik";
import {
  NUMBER,
  MAX,
  MIN,
  DEFAULT,
  NONE_LABEL,
  NONE,
  TEXT,
  TEXT_DANGER,
  TEXT_MUTED,
} from "../../strings";

export const TEXT_FIELD_OPTIONS = "Text Field Options";
export const MIN_LENGTH = "Min Length";
export const MAX_LENGTH = "Max Length";
export const DEFAULT_VALUE = "defaultValue";
export const DEFAULT_VALUE_LABEL = "Default Value";
export const DEFAULT_TEXT_VALUE_PLACEHOLDER =
  "Enter the default text for this field";
export const DEFAULT_TEXT_LABEL = "This is the default value of the field";

export interface EditFieldTextProps
  extends FormikProps<{ [key: string]: string }> {}

export const EditFieldText: FC<EditFieldTextProps> = (props): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = props;
  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>{TEXT_FIELD_OPTIONS}</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...props} />
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{MIN_LENGTH}</Form.Label>
                  <Form.Control
                    type={NUMBER}
                    name={MIN}
                    placeholder={values.min || NONE_LABEL}
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
                  <Form.Label>{MAX_LENGTH}</Form.Label>
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
                      {`${DEFAULT}0 (${NONE})`}
                    </Form.Text>
                  )}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group>
              <Form.Label>{DEFAULT_VALUE_LABEL}</Form.Label>
              <Form.Control
                type={TEXT}
                name={DEFAULT_VALUE}
                placeholder={DEFAULT_TEXT_VALUE_PLACEHOLDER}
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
                  {DEFAULT_TEXT_LABEL}
                </Form.Text>
              )}
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default EditFieldText;
