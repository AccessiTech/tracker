import React from "react";
import { Log, LogEntry, LogFields } from "../../store/Log";
import { Button, Form } from "react-bootstrap";
import {
  DATE,
  DATETIME_LOCAL,
  EMPTY,
  NUMBER,
  PRIMARY,
  RESET,
  RESET_STRING,
  SECONDARY,
  SELECT,
  SUBMIT,
  SUBMIT_STRING,
  TEXT,
} from "../../strings";

// Magic Strings
export const FIELD = "field";
export const INCLUDES = "includes";
export const NOT_INCLUDED = "notIncluded";
export const EQUALS = "equals";
export const NOT_EQUAL = "notEqual";
export const GREATER_THAN = "greaterThan";
export const LESS_THAN = "lessThan";
export const IS_BEFORE = "isBefore";
export const IS_AFTER = "isAfter";
export const IS_ON = "isOn";
export const DATE_CREATED = "dateCreated";

// Display Strings
export const FILTER = "Filter";
export const FILTER_BY_LABEL = "Filter By:";
export const FIELD_LABEL = "Field";
export const DATE_CREATED_LABEL = "Date Created";
export const OPERATOR_LABEL = "Operator";
export const NUMBER_OPERATORS = "Number Operators";
export const TEXT_OPERATORS = "Text Operators";
export const EQUAL_LABEL = "Equals";
export const NOT_EQUAL_LABEL = "Not Equal";
export const GREATER_THAN_LABEL = "Greater Than";
export const LESS_THAN_LABEL = "Less Than";
export const INCLUDE_LABEL = "Includes";
export const NOT_INCLUDE_LABEL = "Excludes";
export const VALUE_LABEL = "Value";
export const DATE_OPERATORS = "Date Operators";
export const BEFORE_LABEL = "Before";
export const AFTER_LABEL = "After";
export const ON_LABEL = "On";
export const DATE_LABEL = "Date";

export interface LogEntryFilterProps {
  log: Log;
  setFilter: React.Dispatch<React.SetStateAction<never[]>>;
}

export type EntryFilterQuery =
  | [
    filterBy: string,
    fieldOptions: [
      fieldOperator:
      | typeof INCLUDES
      | typeof NOT_INCLUDED
      | typeof EQUALS
      | typeof NOT_EQUAL,
      fieldValue: string
    ]
  ]
  | [
    filterBy: typeof DATE_CREATED,
    dateOptions: [
      dateCreatedOperator: typeof IS_BEFORE | typeof IS_AFTER | typeof IS_ON,
      dateCreated: string
    ]
  ];

export const entryFilter = (
  entry: LogEntry,
  filter: EntryFilterQuery
): boolean => {
  if (!entry || !entry.values) return false;
  if (!filter.length) return true;
  if (filter[0] !== DATE_CREATED) {
    const field = filter[0];
    const [operator, value] = filter[1];
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
};

export const getIsFieldEmpty = (
  filterBy: string,
  field: LogFields
): boolean => {
  if (filterBy === EMPTY) return true;
  if (filterBy === DATE_CREATED) return false;
  return typeof field === "undefined";
};

export const getIsFieldDate = (filterBy: string, field: LogFields): boolean => {
  if (getIsFieldEmpty(filterBy, field)) return false;
  if (filterBy === DATE_CREATED) return true;
  return field.type === DATE;
};

export const getIsFieldNumber = (
  filterBy: string,
  field: LogFields
): boolean => {
  if (getIsFieldEmpty(filterBy, field)) return false;
  if (filterBy === DATE_CREATED) return false;
  return field.type === NUMBER;
};

export const LogEntryFilter: React.FC<LogEntryFilterProps> = ({
  log,
  setFilter,
}) => {
  // Component state
  const [show, setShow] = React.useState(false);
  const [filterBy, setFilterBy] = React.useState(EMPTY);
  const [fieldOperator, setFieldOperator] = React.useState(INCLUDES);
  const [fieldValue, setFieldValue] = React.useState(EMPTY);
  const [dateCreated, setDateCreated] = React.useState(EMPTY);
  const [dateCreatedOperator, setDateCreatedOperator] =
    React.useState(IS_BEFORE);
  const [isFieldNumber, setIsFieldNumber] = React.useState(
    getIsFieldNumber(filterBy, log.fields[filterBy])
  );
  const [isFieldDate, setIsFieldDate] = React.useState(
    getIsFieldDate(filterBy, log.fields[filterBy])
  );

  // Component methods
  const resetFilterState = () => {
    setFilterBy(EMPTY);
    setIsFieldNumber(false);
    setIsFieldDate(false);
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
        {FILTER}
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
              if (filterBy !== DATE_CREATED) {
                filterQuery = [
                  filterBy,
                  [fieldOperator, fieldValue],
                ] as EntryFilterQuery;
              } else {
                filterQuery = [
                  filterBy,
                  [dateCreatedOperator, dateCreated],
                ] as EntryFilterQuery;
              }
              setFilter(filterQuery as any);
              setShow(false);
            }}
          >
            {/* FILTER_BY SELECT */}
            <Form.Group
              controlId="formFilterField"
              className="log__entry_filter__field"
            >
              <Form.Label>{FIELD_LABEL}</Form.Label>
              <Form.Control
                name={FIELD}
                as={SELECT}
                className="log__entry_filter_field"
                required
                defaultValue={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value);
                  setIsFieldNumber(getIsFieldNumber(e.target.value, log.fields[e.target.value]));
                  setIsFieldDate(
                    getIsFieldDate(e.target.value, log.fields[e.target.value])
                  );
                }}
              >
                <optgroup label={"Entry Fields"}>
                  {Object.keys(log.fields).map((key) => (
                    <option key={`entry_filter__${key}`} value={key}>
                      {`${log.fields[key].name}`}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={"Meta Fields"}>
                  <option value={DATE_CREATED}>{DATE_CREATED_LABEL}</option>
                </optgroup>
              </Form.Control>
            </Form.Group>

            {/* TEXT & NUMBER FIELD OPERATOR SELECT */}
            {!isFieldDate && (
              <>
                <Form.Group
                  controlId="formFilterOperator"
                  className="log__entry_filter__operator"
                >
                  <Form.Label>{OPERATOR_LABEL}</Form.Label>
                  <Form.Select
                    name="operator"
                    className="log__entry_filter_operator"
                    onChange={(e) => setFieldOperator(e.target.value)}
                    defaultValue={fieldOperator}
                  >
                    {isFieldNumber ? (
                      <optgroup label={NUMBER_OPERATORS}>
                        <option value={EQUALS}>{EQUAL_LABEL}</option>
                        <option value={NOT_EQUAL}>{NOT_EQUAL_LABEL}</option>
                        <option value={GREATER_THAN}>
                          {GREATER_THAN_LABEL}
                        </option>
                        <option value={LESS_THAN}>{LESS_THAN_LABEL}</option>
                      </optgroup>
                    ) : (
                      <optgroup label={TEXT_OPERATORS}>
                        <option value={INCLUDES}>{INCLUDE_LABEL}</option>
                        <option value={NOT_INCLUDED}>
                          {NOT_INCLUDE_LABEL}
                        </option>
                        <option value={EQUALS}>{EQUAL_LABEL}</option>
                        <option value={NOT_EQUAL}>{NOT_EQUAL_LABEL}</option>
                      </optgroup>
                    )}
                  </Form.Select>
                </Form.Group>

                <Form.Group
                  controlId="formFilterValue"
                  className="log__entry_filter__value"
                >
                  <Form.Label>{VALUE_LABEL}</Form.Label>
                  <Form.Control
                    name="value"
                    type={TEXT}
                    className="log__entry_filter_value"
                    defaultValue={fieldValue}
                    required
                    onChange={(e) => setFieldValue(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {/* DATE FIELD OPERATOR SELECT */}
            {(filterBy === DATE_CREATED || isFieldDate) && (
              <>
                <Form.Group
                  controlId="formFilterDateCreatedOperator"
                  className="log__entry_filter__date_created_operator"
                >
                  <Form.Label>{OPERATOR_LABEL}</Form.Label>
                  <Form.Control
                    name="dateCreatedOperator"
                    as={SELECT}
                    className="log__entry_filter_date_created_operator"
                    defaultValue={dateCreatedOperator}
                    onChange={(e) => setDateCreatedOperator(e.target.value)}
                  >
                    <option value={IS_BEFORE}>{BEFORE_LABEL}</option>
                    <option value={IS_AFTER}>{AFTER_LABEL}</option>
                    <option value={IS_ON}>{ON_LABEL}</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group
                  controlId="formFilterDateCreated"
                  className="log__entry_filter__dateCreated"
                >
                  <Form.Label>{DATE_LABEL}</Form.Label>
                  <Form.Control
                    name={DATE_CREATED}
                    type={DATETIME_LOCAL}
                    className="log__entry_filter_dateCreated"
                    defaultValue={dateCreated}
                    onChange={(e) => setDateCreated(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {/* SUBMIT & RESET BUTTONS */}
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
