import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import { InputGroup, Form, Button, Row, Col } from "react-bootstrap";

import { Log, LogFields } from "../../store/Log";
import { getAuthenticated } from "../../store/Session";
import { getDataSync } from "../../store/DataSync";

import { OnUpdateLogParams } from "../../containers/Edit";

import {
  CREATED_AT,
  FIELDS,
  ORDER,
  PRIMARY,
  SAVE,
  SELECT,
  SORT,
  SORT_ASC,
  SORT_DESC,
  SUBMIT,
} from "../../strings";
import store from "../../store/store";

export const SORT_BY = "Sort By";
export const SORT_ORDER = "Sort Order";
export const DATE_CREATED = "Date Created";

export interface EditSortFormProps {
  log: Log;
  onSubmit: (params: OnUpdateLogParams) => void;
}

export const EditSortForm: FC<EditSortFormProps> = ({
  log,
  onSubmit,
}): ReactElement => {
  const { fields } = log as Log;
  const initialValues = {
    sort: log.sort || CREATED_AT,
    order: log.order || SORT_DESC,
  } as Log & { [key: string]: string };
  const logFields: LogFields[] = Object.values(fields || {});
  const authenticated = getAuthenticated(store.getState());
  const dataSyncState = getDataSync(store.getState());
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) =>
        onSubmit({ log, values, authenticated, dataSyncState })
      }
    >
      {(formikProps) => {
        return (
          <Form onSubmit={formikProps.handleSubmit}>
            <Form.Label>{SORT_BY}</Form.Label>
            <Row>
              <Col>
                <InputGroup>
                  <Form.Control
                    as={SELECT}
                    name={SORT}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.sort}
                  >
                    <option value={CREATED_AT}>{DATE_CREATED}</option>
                    <optgroup label={FIELDS}>
                      {logFields.map((field) => (
                        <option
                          key={`sort-options-${field.id}`}
                          value={field.id}
                        >
                          {field.name}
                        </option>
                      ))}
                    </optgroup>
                  </Form.Control>
                  <Button
                    variant={PRIMARY}
                    type={SUBMIT}
                    disabled={formikProps.values.sort === log.sort}
                  >
                    {SAVE}
                  </Button>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <Form.Control
                    as={SELECT}
                    name={ORDER}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={formikProps.values.order}
                  >
                    <option value={SORT_DESC}>Forward</option>
                    <option value={SORT_ASC}>Reversed</option>
                  </Form.Control>
                  <Button
                    variant={PRIMARY}
                    type={SUBMIT}
                    disabled={formikProps.values.order === log.order}
                  >
                    {SAVE}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};
