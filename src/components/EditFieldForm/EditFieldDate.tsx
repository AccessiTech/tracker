import React, { FC, ReactElement } from "react";
// import { Col, Form, Row } from "react-bootstrap";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { FormikProps } from "formik";

export interface EditFieldTextProps
  extends FormikProps<{ [key: string]: string }> {}

export const EditFieldDate: FC<EditFieldTextProps> = (props): ReactElement => {
  return (
    <>
      <hr />
      <h5>Date Field Options</h5>

      <TypeOptionSelect {...props} />

    </>
  );
};

export default EditFieldDate; 
