import React, { FC, ReactElement } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { FormikProps } from "formik";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { TEXTAREA, TEXT_DANGER, TEXT_MUTED } from "../../strings";

export const OPTIONS = "options";

export const SELECT_FIELD_OPTIONS = "Select Field Options";
export const SELECT_OPTIONS = "Select Options";
export const OPTIONS_PLACEHOLDER = "Option1, Option2, Option3";
export const OPTIONS_LABEL = "Enter options separated by commas";

export interface EditFieldSelectProps
  extends FormikProps<{ [key: string]: string }> {}

export const EditFieldSelect: FC<EditFieldSelectProps> = (
  formikProps
): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>{SELECT_FIELD_OPTIONS}</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...formikProps} />

            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{SELECT_OPTIONS}</Form.Label>
                  <Form.Control
                    as={TEXTAREA}
                    rows={3}
                    name={OPTIONS}
                    placeholder={OPTIONS_PLACEHOLDER}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.options}
                  />
                  {(touched.option && errors.option && (
                    <Form.Text className={TEXT_DANGER}>
                      {errors.option}
                    </Form.Text>
                  )) || (
                    <Form.Text className={TEXT_MUTED}>
                      {OPTIONS_LABEL}
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
