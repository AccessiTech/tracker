import React, { FC, ReactElement } from "react";
import { Accordion } from "react-bootstrap";
import { TypeOptionSelect } from "./TypeOptionSelect";
import { FormikProps } from "formik";

export interface EditFieldTextProps
  extends FormikProps<{ [key: string]: string }> {}

export const EditFieldDate: FC<EditFieldTextProps> = (props): ReactElement => {
  return (
    <>
      <hr />
      <Accordion flush className="form__modal_accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h5>Date Field Options</h5>
          </Accordion.Header>
          <Accordion.Body>
            <TypeOptionSelect {...props} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default EditFieldDate;
