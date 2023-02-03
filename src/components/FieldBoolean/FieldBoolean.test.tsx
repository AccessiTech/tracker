import React from "react";
import { render } from "@testing-library/react";
import { FieldBoolean } from "./FieldBoolean";
import { initialBooleanFieldState, BooleanLogField } from "../../store/Log";
import { mockFormikProps } from "../../setupTests";

const field = {
  ...initialBooleanFieldState,
  id: "test",
} as BooleanLogField;
const formikProps = {
  ...mockFormikProps,
  values: { [field.id]: true },
};

test("renders without crashing", () => {
  render(<FieldBoolean {...formikProps} field={field} />);
});

test("renders the field label", () => {
  const { getByText } = render(<FieldBoolean {...formikProps} field={field} />);
  expect(getByText(field.name)).toBeInTheDocument();
});

test("renders the required asterisk", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const { getByText } = render(<FieldBoolean {...formikProps} field={thisField} />);
  expect(getByText(`${field.name}*`)).toBeInTheDocument();
});

test("renders error message when field is required, touched, and empty", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [field.id]: false },
    touched: { [field.id]: true },
    errors: { [field.id]: `${field.name} is required` },
  };
  const { getByText } = render(
    <FieldBoolean {...thisFormikProps} field={thisField} />
  );
  expect(getByText(`${field.name} is required`)).toBeInTheDocument();
});

test("renders the true field value", () => {
  const { getByText } = render(
    <FieldBoolean {...formikProps} field={field} />
  );
  expect(getByText(`Value: ${field.trueLabel}`)).toBeInTheDocument();
});

test("renders the false field value", () => {
  const thisFormikProps = {
    ...formikProps,
    values: { [field.id]: false },
  };
  const { getByText } = render(
    <FieldBoolean {...thisFormikProps} field={field} />
  );
  expect(getByText(`Value: ${field.falseLabel}`)).toBeInTheDocument();
});

test("renders as a checkbox by default", () => {
  const { container } = render(
    <FieldBoolean {...formikProps} field={field} />
  );
  expect(container.querySelector("input[type=checkbox]")).toBeInTheDocument();
});

test("renders as a switch when specified", () => {
  const thisField = {
    ...field,
    option: "switch",
  };
  const { container } = render(
    <FieldBoolean {...formikProps} field={thisField} />
  );
  const input = container.querySelector(".form-switch");
  expect(input).toBeInTheDocument();
});
