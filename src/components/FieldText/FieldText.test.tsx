// Field text component tests
import React from "react";
import { render } from "@testing-library/react";
import { FieldText } from "./FieldText";
import { initialTextFieldState, TextLogField } from "../../store/Log";
import { mockFormikProps } from "../../setupTests";

const field = {
  ...initialTextFieldState,
  id: "test",
} as TextLogField;
const formikProps = {
  ...mockFormikProps,
  values: { [field.id]: "Hello World" },
};

test("renders without crashing", () => {
  render(<FieldText {...formikProps} field={field} />);
});

test("renders the field label", () => {
  const { getByText } = render(<FieldText {...formikProps} field={field} />);
  expect(getByText(field.name)).toBeInTheDocument();
});

test("renders the required asterisk", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const { getByText } = render(<FieldText {...formikProps} field={thisField} />);
  expect(getByText(`${field.name}*`)).toBeInTheDocument();
});

test("renders the field value", () => {
  const { getByDisplayValue } = render(
    <FieldText {...formikProps} field={field} />
  );
  expect(getByDisplayValue("Hello World")).toBeInTheDocument();
});

test("renders the default value when none is provided", () => {
  const { getByText } = render(<FieldText {...formikProps} field={field} />);
  expect(getByText(`Default: none`)).toBeInTheDocument();
});

test("renders the default value when one is provided", () => {
  const thisField = {
    ...field,
    defaultValue: "Test",
  };
  const { getByText } = render(<FieldText {...formikProps} field={thisField} />);
  expect(getByText(`Default: Test`)).toBeInTheDocument();
});

test("renders the field as a textarea when specified", () => {
  const thisField = {
    ...field,
    option: "textarea" as typeof field.option,
  };
  const { container } = render(<FieldText {...formikProps} field={thisField} />);
  const textArea = container.querySelector("textarea");
  expect(textArea).toBeInTheDocument();
});

test("renders the field as an input when not specified", () => {
  const { container } = render(<FieldText {...formikProps} field={field} />);
  const input = container.querySelector("input[type='text']");
  expect(input).toBeInTheDocument();
});

test("renders the field as an input when specified", () => {
  const thisField = {
    ...field,
    option: "input" as typeof field.option,
  };
  const { container } = render(<FieldText {...formikProps} field={thisField} />);
  const input = container.querySelector("input[type='text']");
  expect(input).toBeInTheDocument();
});
