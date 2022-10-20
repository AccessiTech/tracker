import React, { FC, ReactElement } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormikProps } from "formik";
import { formikPartialPropTypes } from "../../utils";
import { TypeOptionSelect } from "./TypeOptionSelect";

export interface EditFieldTextProps extends FormikProps<{[key:string]:string}> {}

export const EditFieldNumber:FC<EditFieldTextProps> = (formikProps):ReactElement => {
  const { values, errors, touched, handleChange, handleBlur } = formikProps;
  
  return (
    <>
      <hr />
      <h5>Number Field Options</h5>

      <TypeOptionSelect {...formikProps} />

      <Form.Group>
        <Row>
          <Col>
            <Form.Label>{"Min Value"}</Form.Label>
            <Form.Control
              type="number"
              name="min"
              placeholder="Min"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.min}
            />
            {(touched.min && errors.min && (
              <Form.Text className="text-danger">{errors.min}</Form.Text>
            )) || <Form.Text className="text-muted">{"Default: 0"}</Form.Text>}
          </Col>
          <Col>
            <Form.Label>{"Max Value"}</Form.Label>
            <Form.Control
              type="number"
              name="max"
              placeholder="Max"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.max}
            />
            {(touched.max && errors.max && (
              <Form.Text className="text-danger">{errors.max}</Form.Text>
            )) || (
              <Form.Text className="text-muted">{"Default: 100"}</Form.Text>
            )}
          </Col>
        </Row>
      </Form.Group>

      <Form.Group>
        <Row>
          <Col>
            <Form.Label>{"Steps"}</Form.Label>
            <Form.Control
              type="number"
              name="step"
              placeholder="Steps"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.step}
            />
            {(touched.step && errors.step && (
              <Form.Text className="text-danger">{errors.step}</Form.Text>
            )) || (
              <Form.Text className="text-muted">{"Default: 1"}</Form.Text>
            )}
          </Col>
          <Col>
            <Form.Label>{"Unit"}</Form.Label>
            <Form.Control
              type="text"
              name="unit"
              placeholder="Degrees, meters, etc."
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.unit}
            />
            {(touched.unit && errors.unit && (
              <Form.Text className="text-danger">{errors.unit}</Form.Text>
            )) || (
              <Form.Text className="text-muted">{"Default: None"}</Form.Text>
            )}
          </Col>
        </Row>
      </Form.Group>

      <Form.Group>
        <Form.Label>{"Default Value"}</Form.Label>
        <Form.Control
          type="number"
          name="defaultValue"
          placeholder="Enter the default number for this field"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.defaultValue}
        />
        {(touched.defaultValue && errors.defaultValue && (
          <Form.Text className="text-danger">{errors.defaultValue}</Form.Text>
        )) || (
          <Form.Text className="text-muted">
            {"This is the default value of the field"}
          </Form.Text>
        )}
      </Form.Group>
    </>
  );
}

export default EditFieldNumber;

EditFieldNumber.propTypes = { ...formikPartialPropTypes };
