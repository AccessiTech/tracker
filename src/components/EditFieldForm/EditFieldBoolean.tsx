import React, { FC, ReactElement } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { FormikProps } from "formik";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { TEXT, TEXT_DANGER, TEXT_MUTED } from "../../strings";

// Magic Strings
export const FALSELABEL = "falseLabel";
export const TRUELABEL = "trueLabel";

// Display Strings
export const BOOLEAN_FIELD_OPTIONS = "Boolean Field Options";
export const FALSE_LABEL = "False Label";
export const FALSE_PLACEHOLDER = "Label for the false option";
export const TRUE_LABEL = "True Label";
export const TRUE_PLACEHOLDER = "Label for the true option";
export const TRUE = "True";
export const FALSE = "False";


export interface EditFieldBooleanProps extends FormikProps<{ [key: string]: string }> { }

export const EditFieldBoolean: FC<EditFieldBooleanProps> = (formikProps): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>{BOOLEAN_FIELD_OPTIONS}</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...formikProps} />

            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{FALSE_LABEL}</Form.Label>
                  <Form.Control
                    type={TEXT}
                    name={FALSELABEL}
                    placeholder={values.falseLabel || FALSE}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.falseLabel}
                  />
                  {(touched.falseLabel && errors.falseLabel && (
                    <Form.Text className={TEXT_DANGER}>
                      {errors.falseLabel}
                    </Form.Text>
                  )) || (
                      <Form.Text className={TEXT_MUTED}>
                        {FALSE_PLACEHOLDER}
                      </Form.Text>
                    )}
                </Col>
                <Col>
                  <Form.Label>{TRUE_LABEL}</Form.Label>
                  <Form.Control
                    type={TEXT}
                    name={TRUELABEL}
                    placeholder={values.trueLabel || TRUE}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.trueLabel}
                  />
                  {(touched.trueLabel && errors.trueLabel && (
                    <Form.Text className={TEXT_DANGER}>
                      {errors.trueLabel}
                    </Form.Text>
                  )) || (
                      <Form.Text className={TEXT_MUTED}>
                        {TRUE_PLACEHOLDER}
                      </Form.Text>
                    )}
                </Col>
              </Row>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default EditFieldBoolean;
