import React from "react";
import { render } from "@testing-library/react";
import { mockFormikProps } from "../../testUtils";
import { FieldNumber } from "./FieldNumber";
import { initialNumberFieldState, NumberLogField } from "../../store/Log";

const field = {
  ...initialNumberFieldState,
  id: "test",
} as NumberLogField;

const formikProps = {
  ...mockFormikProps,
  values: { [field.id]: 42 },
};

test("renders without crashing", () => {
  render(<FieldNumber {...formikProps} field={field} />);
});

test("renders the field label", () => {
  const { getByText } = render(<FieldNumber {...formikProps} field={field} />);
  expect(getByText(field.name)).toBeInTheDocument();
});

test("renders the required asterisk", () => {
  const thisField = {
    ...field,
    required: true,
  };
  const { getByText } = render(<FieldNumber {...formikProps} field={thisField} />);
  expect(getByText(`${field.name}*`)).toBeInTheDocument();
});

test("renders the field value", () => {
  const { getByDisplayValue } = render(
    <FieldNumber {...formikProps} field={field} />
  );
  expect(getByDisplayValue("42")).toBeInTheDocument();
});

test("renders the min and max values", () => {
  const { getByText } = render(<FieldNumber {...formikProps} field={field} />);
  expect(getByText(`Min: ${field.min}; Max: ${field.max};`)).toBeInTheDocument();
});

test("renders as number input by default", () => {
  const { container } = render(<FieldNumber {...formikProps} field={field} />);
  expect(container.querySelector("input[type=number]")).toBeInTheDocument();
});

test("renders as range input when specified", () => {
  const thisField = {
    ...field,
    option: "range" as typeof field.option,
  };
  const { container } = render(<FieldNumber {...formikProps} field={thisField} />);
  expect(container.querySelector("input[type=range]")).toBeInTheDocument();
});

test("does not allow values below the min", () => {
  const thisField = {
    ...field,
    min: 100,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [thisField.id]: 100 },
  };
  const { container, rerender } = render(
    <FieldNumber {...thisFormikProps} field={thisField} />
  );
  const input = container.querySelector("input[type=number]") as HTMLInputElement;
  input.focus();
  input.value = "99";
  input.blur();
  rerender(<FieldNumber {...thisFormikProps} field={thisField} />);
  expect(input.value).toBe("100");
});

test("does not allow values above the max", () => {
  const thisField = {
    ...field,
    max: 100,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [thisField.id]: 100 },
  };
  const { container, rerender } = render(
    <FieldNumber {...thisFormikProps} field={thisField} />
  );
  const input = container.querySelector("input[type=number]") as HTMLInputElement;
  input.focus();
  input.value = "101";
  input.blur();
  rerender(<FieldNumber {...thisFormikProps} field={thisField} />);
  expect(input.value).toBe("100");
});

test("does not allow non-numeric values", () => {
  const thisFormikProps = {
    ...formikProps,
    values: { [field.id]: 42 },
  };
  const { container, rerender } = render(
    <FieldNumber {...thisFormikProps} field={field} />
  );
  const input = container.querySelector("input[type=number]") as HTMLInputElement;
  input.focus();
  input.value = "abc";
  input.blur();
  rerender(<FieldNumber {...thisFormikProps} field={field} />);
  expect(input.value).toBe("42");
});

test("does not allow values outside the step", () => {
  const thisField = {
    ...field,
    step: 10,
  };
  const thisFormikProps = {
    ...formikProps,
    values: { [thisField.id]: 40 },
  };
  const { container, rerender } = render(
    <FieldNumber {...thisFormikProps} field={thisField} />
  );
  const input = container.querySelector("input[type=number]") as HTMLInputElement;
  input.focus();
  input.value = "41";
  input.blur();
  rerender(<FieldNumber {...thisFormikProps} field={thisField} />);
  expect(input.value).toBe("40");
});

test("renders error message when touched and invalid", () => {
  const thisFormikProps = {
    ...formikProps,
    errors: { [field.id]: "error" },
    touched: { [field.id]: true },
  };
  const { getByText } = render(<FieldNumber {...thisFormikProps} field={field} />);
  expect(getByText("error")).toBeInTheDocument();
});

test("does not render error message when not touched", () => { 
  const thisFormikProps = {
    ...formikProps,
    errors: { [field.id]: "error" },
    touched: { [field.id]: false },
  };
  const { queryByText } = render(
    <FieldNumber {...thisFormikProps} field={field} />
  );
  expect(queryByText("error")).not.toBeInTheDocument();
});

test("does not render error message when not invalid", () => {
  const thisFormikProps = {
    ...formikProps,
    errors: { [field.id]: undefined },
    touched: { [field.id]: true },
  };
  const { queryByText } = render(
    <FieldNumber {...thisFormikProps} field={field} />
  );
  expect(queryByText("error")).not.toBeInTheDocument();
});
