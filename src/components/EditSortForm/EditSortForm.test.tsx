import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { EditSortForm, EditSortFormProps } from "./EditSortForm";
import { initialTextFieldState } from "../../store/Log";

const log = {
  fields: {
    "field1": { ...initialTextFieldState, id: "field1" },
    "field2": { ...initialTextFieldState, id: "field2" },
  }
};

describe("EditSortForm", () => {
  test("renders without crashing", () => {
    const props: EditSortFormProps = {
      log: { ...log } as any,
      onSubmit: jest.fn(),
    };
    render(<EditSortForm {...props} />);
  });

  test("renders correctly when no fields", () => {
    const props: EditSortFormProps = {
      log: { ...log, fields: {} } as any,
      onSubmit: jest.fn(),
    };
    render(<EditSortForm {...props} />);
    const sort = document.querySelector("select[name='sort']");
    expect(sort).toBeInTheDocument();
    const sortOptions = sort?.querySelectorAll("option");
    expect(sortOptions?.length).toBe(1);
  });

  test("renders correctly", () => {
    const props: EditSortFormProps = {
      log: { ...log } as any,
      onSubmit: jest.fn(),
    };
    const { getByText, getAllByText } = render(<EditSortForm {...props} />);
    expect(getByText("Sort By")).toBeInTheDocument();
    expect(getByText("Date Created")).toBeInTheDocument();
    expect(getAllByText("Save")).toHaveLength(2);
    const sort = document.querySelector("select[name='sort']");
    expect(sort).toBeInTheDocument();
    const sortOptions = sort?.querySelectorAll("option");
    expect(sortOptions?.length).toBe(Object.keys(log.fields).length + 1);
  });

  test("calls onSubmit when submitted", async () => {
    const props: EditSortFormProps = {
      log: { ...log } as any,
      onSubmit: jest.fn(),
    };
    render(<EditSortForm {...props} />);
    act(() => {
      document.getElementById("sort-submit")?.click()
    });
    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
