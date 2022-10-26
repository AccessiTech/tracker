import React, { FC, ReactElement } from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { FormikProps } from "formik";
import { TypeOptionSelect } from "./TypeOptionSelect";

export interface EditFieldSelectProps extends FormikProps<{ [key: string]: string }> {}

export const EditFieldSelect: FC<EditFieldSelectProps> = (formikProps): ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;

  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>Select Field Options</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...formikProps} />

            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>{"Select Options"}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="options"
                    placeholder="Option1, Option2, Option3"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.options}
                  />
                  {(touched.option && errors.option && (
                    <Form.Text className="text-danger">{errors.option}</Form.Text>
                  )) || (
                    <Form.Text className="text-muted">
                      {"Enter options separated by commas"}
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
}