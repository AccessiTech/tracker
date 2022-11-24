import React from "react";
import { Formik } from "formik";
import { Log } from "../../store/Log";
import { Button, Form } from "react-bootstrap";

export interface LogEntryFilterProps {
  log: Log;
}

export const LogEntryFilter: React.FC<LogEntryFilterProps> = ({ log }) => {
  console.log("LogEntryFilter", log);
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setShow(!show);
        }}
      >
        Filter
      </Button>

      {show && (
        <div
          className={`log__entry_filter dropdown-menu${show ? " show" : ""}`}
        >
          <Formik
            initialValues={{
              name: "",
              type: "",
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="log__entry_filter__form">
                <Form.Group
                  controlId="formFilterField"
                  className="log__entry_filter__field"
                >
                  <Form.Label>Field</Form.Label>
                  <Form.Control
                    name="field"
                    as="select"
                    className="log__entry_filter_field"
                  >
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group
                  controlId="formFilterOperator"
                  className="log__entry_filter__operator"
                >
                  <Form.Label>Operator</Form.Label>
                  <Form.Control
                    name="operator"
                    as="select"
                    className="log__entry_filter_operator"
                  >
                    <option value="eq">=</option>
                    <option value="neq">!=</option>
                    <option value="gt">&gt;</option>
                    <option value="gte">&gt;=</option>
                    <option value="lt">&lt;</option>
                    <option value="lte">&lt;=</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group
                  controlId="formFilterValue"
                  className="log__entry_filter__value"
                >
                  <Form.Label>Value</Form.Label>
                  <Form.Control
                    name="value"
                    type="text"
                    className="log__entry_filter_value"
                  />
                </Form.Group>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default LogEntryFilter;
