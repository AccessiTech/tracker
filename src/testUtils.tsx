import React from "react";
import { FormikProps } from "formik";
import { render as rtlRender } from "@testing-library/react";
import store from "./store/store";
import { Provider } from "react-redux";

export const mockFormikProps = {
  initialValues: {},
  values: {},
  initialErrors: {},
  errors: {},
  initialTouched: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
  handleValidate: jest.fn(),
  isSubmitting: false,
  isValidating: false,
  dirty: false,
  isValid: false,
  status: undefined,
  setStatus: jest.fn(),
  setSubmitting: jest.fn(),
  setErrors: jest.fn(),
  setTouched: jest.fn(),
  setValues: jest.fn(),
  submitCount: 0,
  validateForm: jest.fn(),
  validateField: jest.fn(),
  resetForm: jest.fn(),
  getFieldProps: jest.fn(),
  getFieldMeta: jest.fn(),
  getFieldHelpers: jest.fn(),
  registerField: jest.fn(),
  unregisterField: jest.fn(),
  submitForm: jest.fn(),
  setFieldTouched: jest.fn(),
  setFieldError: jest.fn(),
  setFieldValue: jest.fn(),
  setFormikState: jest.fn(),
  validateOnBlur: false,
  validateOnChange: false,
  validateOnMount: false,
} as FormikProps<any>;


export function render(
  ui: React.ReactElement,
  options: any = {
    initialState: {},
    store: store,
  },
) {
  const { ...renderOptions } = options;
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}