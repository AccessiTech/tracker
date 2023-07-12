import React from "react";
import { act, render } from "@testing-library/react";
import { initialDateFieldState, initialLogEntryState, initialLogState, initialNumberFieldState, initialTextFieldState, Log } from "../../store/Log";
import { testLog } from "../../store/Log/testLogData";
import { DATE_CREATED, DATE_CREATED_LABEL, entryFilter, EQUALS, FILTER, FILTER_BY_LABEL, getIsFieldDate, getIsFieldEmpty, getIsFieldNumber, GREATER_THAN, INCLUDES, IS_AFTER, IS_BEFORE, LESS_THAN, LogEntryFilter, LogEntryFilterProps, NOT_EQUAL, NOT_INCLUDED } from "./LogEntryFilter";
import { DATE, NUMBER } from "../../strings";

describe("LogEntryFilter", () => {
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

  test("filter dropdown has all the filter options", async () => {
    const props: LogEntryFilterProps = {
      log: { ...testLog } as any,
      setFilter: jest.fn(),
    };
    const { getByText, container } = render(<LogEntryFilter {...props} />);
    const button = getByText(FILTER);
    expect(button).toBeInTheDocument();

    await act(() => button.click());
    const filterSelect = container.querySelector("select");
    expect(filterSelect).toBeInTheDocument();
    const options = container.querySelectorAll(".log__entry_filter_field option");
    expect(options.length).toBe(Object.keys(testLog.fields).length + 1);

    const operators = container.querySelectorAll(".log__entry_filter_operator option");
    expect(operators.length).toBe(4);

    const byDate = getByText(DATE_CREATED_LABEL);
    expect(byDate).toBeInTheDocument();
    if (!filterSelect) throw new Error("filterSelect is null");
    expect(filterSelect.value).not.toBe(DATE_CREATED)

    // await act(() => filterSelect.click());
    // await act(() => byDate.click());
    // // expect(filterSelect.value).toBe(DATE_CREATED);
    // const dateOperators = container.querySelectorAll(".log__entry_filter_operator option");
    // expect(dateOperators.length).toBe(3);

  });

  test("helpers correctly identify field types", async () => {
    const empty = getIsFieldEmpty("", {} as any);
    expect(empty).toBe(true);
    const empty2 = getIsFieldEmpty("not empty", {} as any);
    expect(empty2).toBe(false);
    const empty3 = getIsFieldEmpty("not empty", undefined as any);
    expect(empty3).toBe(true);
    const empty4 = getIsFieldEmpty(DATE_CREATED, {} as any);
    expect(empty4).toBe(false);

    const date = getIsFieldDate("", {} as any);
    expect(date).toBe(false);
    const date2 = getIsFieldDate("not empty", {} as any);
    expect(date2).toBe(false);
    const date3 = getIsFieldDate("not empty", undefined as any);
    expect(date3).toBe(false);
    const date4 = getIsFieldDate(DATE_CREATED, {} as any);
    expect(date4).toBe(true);
    const date5 = getIsFieldDate("not empty", { type: DATE } as any);
    expect(date5).toBe(true);

    const num = getIsFieldNumber("", {} as any);
    expect(num).toBe(false);
    const num2 = getIsFieldNumber("not empty", {} as any);
    expect(num2).toBe(false);
    const num3 = getIsFieldNumber(DATE_CREATED, {} as any);
    expect(num3).toBe(false);
    const num4 = getIsFieldNumber("not empty", { type: NUMBER } as any);
    expect(num4).toBe(true);
  });

  test('entryFilter helper correctly filters entries', () => {
    const log: Log = {
      ...initialLogState,
      id: 'test',
      fields: {
        "field1": { ...initialTextFieldState },
        "field2": { ...initialNumberFieldState },
        "field3": { ...initialDateFieldState },
      },
      entries: {
        "entry1": {
          ...initialLogEntryState,
          createdAt: "1",
          values: {
            "label": "",
            "field1": "value1",
            "field2": 2,
            "field3": "2020-01-01",
          },
        },
        "entry2": {
          ...initialLogEntryState,
          values: {
            "label": "",
            "field1": "value2",
            "field2": 3,
            "field3": "2020-01-02",
          },
        },
        "entry3": {
          ...initialLogEntryState,
          values: {
            "label": "",
            "field1": "value3",
            "field2": 4,
            "field3": "2020-01-03",
          },
        },
      },
    };

    const pass = entryFilter(log.entries.entry1, ["field1", EQUALS, "value1"]);
    expect(pass).toBe(true);
    const fail = entryFilter(log.entries.entry1, ["field1", EQUALS, "value2"]);
    expect(fail).toBe(false);
    const fail2 = entryFilter(log.entries.entry4, ["field2", EQUALS, "value4"]);
    expect(fail2).toBe(false);
    const pass2 = entryFilter(log.entries.entry1, [] as any);
    expect(pass2).toBe(true);
    const fail3 = entryFilter(log.entries.entry1, ["field4", EQUALS, "value1"]);
    expect(fail3).toBe(false);
    const pass3 = entryFilter(log.entries.entry1, [DATE_CREATED, EQUALS, "1"]);
    expect(pass3).toBe(true);

    const pass4 = entryFilter(log.entries.entry1, ["field1", INCLUDES, "val"]);
    expect(pass4).toBe(true);
    const fail4 = entryFilter(log.entries.entry1, ["field1", INCLUDES, "val2"]);
    expect(fail4).toBe(false);
    const pass5 = entryFilter(log.entries.entry1, ["field1", NOT_INCLUDED, "val2"]);
    expect(pass5).toBe(true);
    const fail5 = entryFilter(log.entries.entry1, ["field1", NOT_INCLUDED, "val"]);
    expect(fail5).toBe(false);
    const pass6 = entryFilter(log.entries.entry1, ["field1", NOT_EQUAL, "val2"]);
    expect(pass6).toBe(true);
    const fail6 = entryFilter(log.entries.entry1, ["field1", NOT_EQUAL, "value1"]);
    expect(fail6).toBe(false);

    const pass7 = entryFilter(log.entries.entry1, ["field2", GREATER_THAN, 1] as any);
    expect(pass7).toBe(true);
    const fail7 = entryFilter(log.entries.entry1, ["field2", GREATER_THAN, 2] as any);
    expect(fail7).toBe(false);
    const pass8 = entryFilter(log.entries.entry1, ["field2", LESS_THAN, 3] as any);
    expect(pass8).toBe(true);
    const fail8 = entryFilter(log.entries.entry1, ["field2", LESS_THAN, 2] as any);
    expect(fail8).toBe(false);

    const pass9 = entryFilter(log.entries.entry1, ["field3", IS_BEFORE, "2020-01-02"]);
    expect(pass9).toBe(true);
    const fail9 = entryFilter(log.entries.entry1, ["field3", IS_BEFORE, "2020-01-01"]);
    expect(fail9).toBe(false);
    const pass10 = entryFilter(log.entries.entry1, ["field3", IS_AFTER, "2019-01-01"]);
    expect(pass10).toBe(true);
    const fail10 = entryFilter(log.entries.entry1, ["field3", IS_AFTER, "2020-01-02"]);
    expect(fail10).toBe(false);

    const fail11 = entryFilter(log.entries.entry1, ["field1", "ASDF", "value1"] as any);
    expect(fail11).toBe(false);
  });
});
