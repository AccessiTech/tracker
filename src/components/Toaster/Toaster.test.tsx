import React from "react";
import { render } from "@testing-library/react";
import { Toaster, ToasterProps } from "./Toaster";
import { toasts } from "./helpers";

test("renders without crashing", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  render(<Toaster {...props} />);
});

test("renders the toast content", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByText } = render(<Toaster {...props} />);
  expect(getByText("Test")).toBeInTheDocument();
});

test("renders the toast status", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByRole } = render(<Toaster {...props} />);
  const element = getByRole("alert");
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass("bg-success");
});

test("renders toast with malformed status", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "asdfadsf" as any,
    },
    setToast: jest.fn(),
  };
  const { getByRole } = render(<Toaster {...props} />);
  const element = getByRole("alert");
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass("bg-asdfadsf");
});

test("renders toasts from contexts", () => {
  const props: ToasterProps = {
    toast: {},
    setToast: jest.fn(),
  };
  Object.values(toasts).forEach((toast) => {
    props.toast = toast;
    const { getByText } = render(<Toaster {...props} />);
    expect(getByText(toast.content as string)).toBeInTheDocument();
  });
});

test("renders the close button", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByRole } = render(<Toaster {...props} />);
  const element = getByRole("button");
  expect(element).toBeInTheDocument();
  expect(element).toHaveClass("btn-close");
});

test("renders the close button with the correct aria-label", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByLabelText } = render(<Toaster {...props} />);
  const element = getByLabelText("Close");
  expect(element).toBeInTheDocument();
});

test("renders and then closes the toast on click", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByRole, queryByRole } = render(<Toaster {...props} />);
  const element = getByRole("alert");
  expect(element).toBeInTheDocument();
  const button = getByRole("button");
  button.click();
  setTimeout(() => {
    expect(queryByRole("alert")).not.toBeInTheDocument();
  }, 1000);
});

test("renders and then closes the toast on timeout", () => {
  const props: ToasterProps = {
    toast: {
      content: "Test",
      status: "success",
    },
    setToast: jest.fn(),
  };
  const { getByRole, queryByRole } = render(<Toaster {...props} />);
  const element = getByRole("alert");
  expect(element).toBeInTheDocument();
  setTimeout(() => {
    expect(queryByRole("alert")).not.toBeInTheDocument();
  }, 3000);
});
