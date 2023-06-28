import React from "react";
import { act, render } from "@testing-library/react";
import { FILTER, FILTER_BY_LABEL, LogEntryFilter, LogEntryFilterProps } from "./LogEntryFilter";
import { initialLogState } from "../../store/Log";

test("renders without crashing", () => {
  const props: LogEntryFilterProps = {
    log: { ...initialLogState },
    setFilter: jest.fn(),
  };
  render(<LogEntryFilter {...props} />);
});

test("filter button toggles the filter dropdown on click", async () => {
  const props: LogEntryFilterProps = {
    log: { ...initialLogState },
    setFilter: jest.fn(),
  };
  const { getByText } = render(<LogEntryFilter {...props} />);
  const button = getByText(FILTER);
  expect(button).toBeInTheDocument();
  
  await act(() => button.click());
  const dropdown = getByText(FILTER_BY_LABEL);
  expect(dropdown).toBeInTheDocument();

  await act(() => button.click());
  expect(dropdown).not.toBeInTheDocument();
});

// todo: test functionality with mock data
