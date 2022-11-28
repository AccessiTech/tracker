import React from "react";
import { Log } from "../../store/Log";
import { Button, Form } from "react-bootstrap";
import { EMPTY, PRIMARY } from "../../strings";

export interface LogEntryFilterProps {
  log: Log;
}

export const FIELD = "field";
export const INCLUDES = "includes";
export const NOT_INCLUDED = "notIncluded";
export const EQUALS = "equals";
export const NOT_EQUAL = "notEqual";
export const IS_BEFORE = "isBefore";
export const IS_AFTER = "isAfter";
export const IS_ON = "isOn";

export const LogEntryFilter: React.FC<LogEntryFilterProps> = ({ log }) => {
  console.log("LogEntryFilter", log);
  const [show, setShow] = React.useState(false);
  const [filterBy, setFilterBy] = React.useState(FIELD);
  const [field, setField] = React.useState(EMPTY);
  const [fieldOperator, setFieldOperator] = React.useState(INCLUDES);
  const [fieldValue, setFieldValue] = React.useState(EMPTY);
  const [dateCreated, setDateCreated] = React.useState(EMPTY);
  const [dateCreatedOperator, setDateCreatedOperator] = React.useState(
    IS_BEFORE
  );

  const resetFilterState = () => {
    setFilterBy(FIELD);
    setField(EMPTY);
    setFieldOperator(INCLUDES);
    setFieldValue(EMPTY);
    setDateCreated(EMPTY);
    setDateCreatedOperator(IS_BEFORE);
  };

  return (
    <>
      <Button
        variant={PRIMARY}
        onClick={() => {
          setShow(!show);
          resetFilterState();
        }}
      >
        Filter
      </Button>

      {show && (
        <div
          className={`log__entry_filter dropdown-menu${show ? " show" : EMPTY}`}
        >
          <Form
            className="log__entry_filter__form"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("submit");
              console.log("filterBy", filterBy);
              console.log(FIELD, field);
              console.log("fieldOperator", fieldOperator);
              console.log("fieldValue", fieldValue);
              console.log("dateCreated", dateCreated);
              console.log("dateCreatedOperator", dateCreatedOperator);
            }}>
            <Form.Group controlId="formFilterBy">
              <Form.Label>Filter By:</Form.Label>
              <Form.Control as="select" name="filterBy" onChange={
                (e) => setFilterBy(e.target.value)
              }>
                <option value={FIELD}>Field</option>
                <option value="dateCreated">Date Created</option>
              </Form.Control>
            </Form.Group>

            {filterBy === FIELD && (<>
              <Form.Group
                controlId="formFilterField"
                className="log__entry_filter__field"
              >
                <Form.Label>Field:</Form.Label>
                <Form.Control
                  name={FIELD}
                  as="select"
                  className="log__entry_filter_field"
                  onChange={(e) => setField(e.target.value)}
                >
                  <option></option>
                  {Object.keys(log.fields).map((key) => (
                    <option key={`entry_filter__${key}`} value={key}>
                      {`${log.fields[key].name}`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group
                controlId="formFilterOperator"
                className="log__entry_filter__operator"
              >
                <Form.Label>Does...</Form.Label>
                <Form.Select
                  name="operator"
                  className="log__entry_filter_operator"
                  onChange={(e) => setFieldOperator(e.target.value)}
                  defaultValue={fieldOperator}
                >
                  <option value={INCLUDES}>Include:</option>
                  <option value={NOT_INCLUDED}>Not Include:</option>
                  <option value={EQUALS}>Equal:</option>
                  <option value={NOT_EQUAL}>Not Equal:</option>
                </Form.Select>
              </Form.Group>

              <Form.Group
                controlId="formFilterValue"
                className="log__entry_filter__value"
              >
                <Form.Label>Value:</Form.Label>
                <Form.Control
                  name="value"
                  type="text"
                  className="log__entry_filter_value"
                  defaultValue={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                />
              </Form.Group>
            </>)}

            {filterBy === "dateCreated" && (<>
              <Form.Group
                controlId="formFilterDateCreatedOperator"
                className="log__entry_filter__date_created_operator"
              >
                <Form.Label>Is...</Form.Label>
                <Form.Control
                  name="dateCreatedOperator"
                  as="select"
                  className="log__entry_filter_date_created_operator"
                  defaultValue={dateCreatedOperator}
                  onChange={(e) => setDateCreatedOperator(e.target.value)}
                >
                  <option value={IS_BEFORE}>Before:</option>
                  <option value={IS_AFTER}>After:</option>
                  <option value={IS_ON}>On:</option>
                </Form.Control>
              </Form.Group>
              <Form.Group
                controlId="formFilterDateCreated"
                className="log__entry_filter__dateCreated"
              >
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  name="dateCreated"
                  type="datetime-local"
                  className="log__entry_filter_dateCreated"
                  defaultValue={dateCreated}
                  onChange={(e) => setDateCreated(e.target.value)}
                />
              </Form.Group>
            </>)}
          </Form>

        </div>
      )}
    </>
  );
};

export default LogEntryFilter;
