// Field Select component tests
import React from "react";
import { render } from "@testing-library/react";
import { FieldSelect } from "./FieldSelect";
import { initialSelectFieldState, SelectLogField } from "../../store/Log";
import { mockFormikProps } from "../../setupTests";

const field = {
  ...initialSelectFieldState,
  options: "one,two,three",
  id: "test",
} as SelectLogField;

const formikProps = {
  ...mockFormikProps,
  values: { [field.id]: "one" },
};

test("renders without crashing", () => {
  render(<FieldSelect {...formikProps} field={field} />);
});

test("renders the field label", () => {
  const { getByText } = render(<FieldSelect {...formikProps} field={field} />);
  expect(getByText(field.name)).toBeInTheDocument();
});

test("renders the required asterisk", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const { getByText } = render(<FieldSelect {...formikProps} field={thisField} />);
  expect(getByText(`${field.name}*`)).toBeInTheDocument();
});

test("renders the field value", () => {
  const { getByDisplayValue } = render(
    <FieldSelect {...formikProps} field={field} />
  );
  expect(getByDisplayValue("one")).toBeInTheDocument();
});

test("renders an option element for each option", () => {
  const { getAllByRole } = render(<FieldSelect {...formikProps} field={field} />);
  expect(getAllByRole("option")).toHaveLength(3);
});

test("select one only allows one option to be selected", () => {
  const thisField = {
    ...field,
    option: "select-one" as typeof field.option,
  };
  const { container } = render(<FieldSelect {...formikProps} field={thisField} />);
  const select = container.querySelector("select");
  expect(select).toBeInTheDocument();
  expect(select?.multiple).toBe(false);
  const options = container.querySelectorAll("option");
  options[1].selected = true;
  expect(select?.value).toBe("two");
});

test("select multiple allows multiple options to be selected", () => {
  const thisField = {
    ...field,
    option: "many" as typeof field.option,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [thisField.id]: ["two","three"] },
  };
  const { container } = render(<FieldSelect {...thisFormikProps} field={thisField} />);
  const select = container.querySelector("select");
  const options = container.querySelectorAll("option");
  expect(select).toBeInTheDocument();
  expect(select?.multiple).toBe(true);
  expect(options[0].selected).toBe(false);
  expect(options[1].selected).toBe(true);
  expect(options[2].selected).toBe(true);
});

test("renders error message when field is touched and has an error", () => {
  const thisFormikProps = {
    ...formikProps,
    errors: { [field.id]: "Required" },
    touched: { [field.id]: true },
  };
  const { getByText } = render(<FieldSelect {...thisFormikProps} field={field} />);
  expect(getByText("Required")).toBeInTheDocument();
});
