import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditRecurrenceForm, EditRecurrenceFormProps } from "./EditRecurrenceForm";

describe("EditRecurrenceForm", () => {
  test("renders without crashing", () => {
    const props: EditRecurrenceFormProps = {
      log: {} as any,
      onSubmit: jest.fn(),
    };
    render(<EditRecurrenceForm {...props} />);
  });

  test("renders correctly", () => {
    const props: EditRecurrenceFormProps = {
      log: {} as any,
      onSubmit: jest.fn(),
    };
    render(<EditRecurrenceForm {...props} />);
    const enabledSwitch = document.querySelector("input[name='enabled']");
    expect(enabledSwitch).toBeInTheDocument();
    expect(enabledSwitch?.checked).toBe(false);
    const intervalInput = document.querySelector("input[name='interval']");
    expect(intervalInput).toBeInTheDocument();
    const unitSelect = document.querySelector("select[name='unit']");
    expect(unitSelect).toBeInTheDocument();
    const startInput = document.querySelector("input[name='start']");
    expect(startInput).toBeInTheDocument();
    const endInput = document.querySelector("input[name='end']");
    expect(endInput).toBeInTheDocument();
    const saveButton = document.querySelector("button[type='submit']");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton?.disabled).toBe(true);
    const resetButton = document.querySelector("button[type='reset']");
    expect(resetButton).toBeInTheDocument();
  });

  test("renders correctly when log has recurrence", () => {
    const props: EditRecurrenceFormProps = {
      log: {
        recurrence: {
          enabled: true,
          interval: 1,
          unit: "day",
          start: "2021-01-01",
          end: "2021-12-31",
        },
      } as any,
      onSubmit: jest.fn(),
    };
    render(<EditRecurrenceForm {...props} />);
    const enabledSwitch = document.querySelector("input[name='enabled']");
    expect(enabledSwitch).toBeInTheDocument();
    expect(enabledSwitch?.checked).toBe(true);
    const intervalInput = document.querySelector("input[name='interval']");
    expect(intervalInput).toBeInTheDocument();
    expect(intervalInput?.value).toBe("1");
    const unitSelect = document.querySelector("select[name='unit']");
    expect(unitSelect).toBeInTheDocument();
    const startInput = document.querySelector("input[name='start']");
    expect(startInput).toBeInTheDocument();
    expect(startInput?.value).toBe("2021-01-01");
    const endInput = document.querySelector("input[name='end']");
    expect(endInput).toBeInTheDocument();
    expect(endInput?.value).toBe("2021-12-31");
    const saveButton = document.querySelector("button[type='submit']");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton?.disabled).toBe(true);
    const resetButton = document.querySelector("button[type='reset']");
    expect(resetButton).toBeInTheDocument();
  });

  test("calls onSubmit when submitted", async () => {
    const props: EditRecurrenceFormProps = {
      log: {} as any,
      onSubmit: jest.fn(),
    };
    render(<EditRecurrenceForm {...props} />);
    const submit = document.getElementById("edit__recurrence__save_btn");
    expect(submit).toBeInTheDocument();
    const enabledSwitch = document.getElementById("edit__recurrence__enabled__switch");
    expect(enabledSwitch).toBeInTheDocument();
    act(() => {
      enabledSwitch?.click()
    });
    await waitFor(() => {
      expect(submit?.disabled).toBe(false);
    });
    act(() => {
      submit?.click()
    });
    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
