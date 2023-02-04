// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { FormikProps } from "formik";
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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
