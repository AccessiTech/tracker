import React from "react";
import { Log, LogEntry } from "../../store/Log";
import { Button, Form } from "react-bootstrap";
import { EMPTY, PRIMARY, RESET, RESET_STRING, SECONDARY, SUBMIT, SUBMIT_STRING } from "../../strings";

export interface LogEntryFilterProps {
  log: Log;
  setFilter: React.Dispatch<React.SetStateAction<never[]>>;
}

export type EntryFilterQuery = 
  [filterBy: "field",
    fieldOptions: [
      field: string, 
      fieldOperator: "includes" | "notIncluded" | "equals" | "notEqual",
      fieldValue: string
    ]
  ] |
  [filterBy: "dateCreated", 
    dateOptions: [
      dateCreatedOperator: "isBefore" | "isAfter" | "isOn",
      dateCreated: string
  ]
];

export const FIELD = "field";
export const INCLUDES = "includes";
export const NOT_INCLUDED = "notIncluded";
export const EQUALS = "equals";
export const NOT_EQUAL = "notEqual";
export const IS_BEFORE = "isBefore";
export const IS_AFTER = "isAfter";
export const IS_ON = "isOn";


export const entryFilter = (entry: LogEntry, filter: EntryFilterQuery):boolean => {
  if (!entry || !entry.values) return false;
  if (!filter.length) return true;
  if (filter[0] === FIELD) {
    const [field, operator, value] = filter[1];
    const entryValue = entry.values[field];
    if (!entryValue) return false;
    switch (operator) {
      case INCLUDES:
        return (entryValue as string).includes(value);
      case NOT_INCLUDED:
        return !(entryValue as string).includes(value);
      case EQUALS:
        return entryValue === value;
      case NOT_EQUAL:
        return entryValue !== value;
      default:
        return false;
    }
  } else {
    const [operator, date] = filter[1];
    const entryDate = entry.createdAt;
    switch (operator) {
      case IS_BEFORE:
        return new Date(entryDate) < new Date(date);
      case IS_AFTER:
        return new Date(entryDate) > new Date(date);
      case IS_ON:
        return new Date(entryDate) === new Date(date);
      default:
        return false;
    }
  }
}

export const LogEntryFilter: React.FC<LogEntryFilterProps> = ({ log, setFilter }) => {
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
              let filterQuery: EntryFilterQuery;
              if (filterBy === FIELD) {
                filterQuery = [
                  filterBy,
                  [field, fieldOperator, fieldValue],
                ] as EntryFilterQuery;
              } else {
                filterQuery = [
                  filterBy,
                  [dateCreatedOperator, dateCreated],
                ] as EntryFilterQuery;
              }
              setFilter(filterQuery as any);
              setShow(false);
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
            {/* form group for reset and submit buttons */}
            <Form.Group
              controlId="formFilterResetSubmit"
              className="log__entry_filter__reset_submit"
            >
              <Button
                type={RESET}
                variant={SECONDARY}
                onClick={() => {
                  resetFilterState();
                  setFilter([] as any);
                }}
              >
                {RESET_STRING}
              </Button>
              <Button variant={PRIMARY} type={SUBMIT}>
                {SUBMIT_STRING}
              </Button>
            </Form.Group>
          </Form>

        </div>
      )}
    </>
  );
};

export default LogEntryFilter;
