// Field Date component tests
import React from "react";
import { render } from "@testing-library/react";
import { FieldDate } from "./FieldDate";
import { initialDateFieldState, DateLogField } from "../../store/Log";
import { mockFormikProps } from "../../setupTests";

const field = {
  ...initialDateFieldState,
  id: "test",
} as DateLogField;
const formikProps = {
  ...mockFormikProps,
  values: { [field.id]: "2020-01-01" },
};

test("renders without crashing", () => {
  render(<FieldDate {...formikProps} field={field} />);
});

test("renders the field label", () => {
  const { getByText } = render(<FieldDate {...formikProps} field={field} />);
  expect(getByText(field.name)).toBeInTheDocument();
});

test("renders the required asterisk", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const { getByText } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(getByText(`${field.name}*`)).toBeInTheDocument();
});

test("renders error message when field is required, touched, and empty", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [field.id]: "" },
    touched: { [field.id]: true },
    errors: { [field.id]: `${field.name} is required` },
  };
  const { getByText } = render(
    <FieldDate {...thisFormikProps} field={thisField} />
  );
  expect(getByText(`${field.name} is required`)).toBeInTheDocument();
});

test("renders the field value", () => {
  const { getByDisplayValue } = render(
    <FieldDate {...formikProps} field={field} />
  );
  expect(getByDisplayValue("2020-01-01")).toBeInTheDocument();
});

test("renders datetime picker when specified", () => {
  const thisField = {
    ...field,
    option: "datetime-local" as typeof field.option,
  };
  const { container } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(container.querySelector("input[type=datetime-local]")).toBeInTheDocument();
});

test("renders time picker when specified", () => {
  const thisField = {
    ...field,
    option: "time" as typeof field.option,
  };
  const { container } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(container.querySelector("input[type=time]")).toBeInTheDocument();
});

test("renders date picker when specified", () => {
  const thisField = {
    ...field,
    option: "date" as typeof field.option,
  };
  const { container } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(container.querySelector("input[type=date]")).toBeInTheDocument();
});

test("renders the default value when none is provided", () => {
  const thisField = {
    ...field,
    defaultValue: undefined,
  };
  const { getByText } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(getByText("Default: none")).toBeInTheDocument();
});

test("renders the default value when one is provided", () => {
  const thisField = {
    ...field,
    defaultValue: "2020-01-01",
  };
  const { getByText } = render(<FieldDate {...formikProps} field={thisField} />);
  expect(getByText("Default: 2020-01-01")).toBeInTheDocument();
});
