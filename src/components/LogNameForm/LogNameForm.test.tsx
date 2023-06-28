import React from "react";
import { act, render } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { LogNameForm, LogNameFormProps, LOG_NAME } from "./LogNameForm";
import { initialLogState } from "../../store/Log";
import { SAVE, TEXT_DANGER } from "../../strings";

test("renders without crashing", () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  render(<LogNameForm {...props} />);
});

test("renders with an input for the log name", () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByLabelText, } = render(<LogNameForm {...props} />);
  const label = getByLabelText(LOG_NAME);
  expect(label).toBeInTheDocument();
  const input = document.getElementById("logNameFormInput")
  expect(input).toBeInTheDocument();
  expect(input).toHaveValue("Test");
});

test("renders with a submit button", () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      id: "1",
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = render(<LogNameForm {...props} />);
  const button = getByText(SAVE);
  expect(button).toBeInTheDocument();
});

test("enables the submit button when the input is not empty", async () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = await act(async () => render(<LogNameForm {...props} />));
  const user =  userEvent.setup();
  const input = document.getElementById("logNameFormInput")
  const button = getByText(SAVE);
  expect(button).toBeDisabled();
  
  await user.type(input!, "Test Name");
  expect(input).toHaveValue("Test Name");
  expect(button).toBeEnabled();
});

test("calls the onSubmit function when the form is submitted", async () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      name: "Test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  const { getByText } = await act(async () => render(<LogNameForm {...props} />));
  const input = document.getElementById("logNameFormInput")
  const button = getByText(SAVE);
  const user = userEvent.setup();

  expect(props.onSubmit).not.toHaveBeenCalled();
  await user.type(input!, "Test Name");

  await act(async () => {
    button.click();
  });

  expect(props.onSubmit).toHaveBeenCalled();
});

test("renders error message when the input is invalid", async () => {
  const props: LogNameFormProps = {
    log: {
      ...initialLogState,
      name: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    onSubmit: jest.fn(),
  };
  await act(async () => render(<LogNameForm {...props} />));
  const input = document.getElementById("logNameFormInput");
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(0);
  await act(() => input!.focus());
  await act(() => input!.blur());
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(1);

  const user = userEvent.setup();
  await user.type(input!, "Test Name");
  expect(document.getElementsByClassName(TEXT_DANGER)).toHaveLength(0);
});