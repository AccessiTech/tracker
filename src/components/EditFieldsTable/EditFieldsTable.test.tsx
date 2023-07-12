import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditFieldsTableProps, EditFieldsTable, YES, NO } from "./EditFieldsTable";
import { initialTextFieldState } from "../../store/Log";

const logFields = {
  "field1": { ...initialTextFieldState, id: "field1", required: true },
  "field2": { ...initialTextFieldState, id: "field2" },
}

describe("EditFieldsTable", () => {
  test("renders without crashing", () => {
    const props: EditFieldsTableProps = {
      fields:  Object.values(logFields) as any,
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      setToast: jest.fn(),
    };
    render(<EditFieldsTable {...props} />);
  });

  test("renders correctly", () => {
    const props: EditFieldsTableProps = {
      fields:  Object.values(logFields) as any,
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      setToast: jest.fn(),
    };
    const { getByText, getAllByText } = render(<EditFieldsTable {...props} />);
    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
    const tableHeaders = table?.querySelectorAll("th");
    expect(tableHeaders?.length).toBe(5);
    const tableRows = table?.querySelectorAll("tbody tr");
    expect(tableRows?.length).toBe(Object.keys(logFields).length);
    const required = getByText(YES)
    expect(required).toBeInTheDocument();
    const notRequired = getByText(NO);
    expect(notRequired).toBeInTheDocument();
    const dropdown = getAllByText("Actions")
    expect(dropdown[1].getAttribute('aria-expanded')).toBe("false");
  });

  test("renders correctly when no fields", () => {
    const props: EditFieldsTableProps = {
      fields:  [] as any,
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      setToast: jest.fn(),
    };
    render(<EditFieldsTable {...props} />);
    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
    const tableRows = table?.querySelectorAll("tbody tr");
    expect(tableRows?.length).toBe(0);
  });

  test("opens the dropdown when the actions button is clicked", async () => {
    const props: EditFieldsTableProps = {
      fields:  Object.values(logFields) as any,
      onEditClick: jest.fn(),
      onDeleteClick: jest.fn(),
      setToast: jest.fn(),
    };
    const { getAllByText } = render(<EditFieldsTable {...props} />);
    const dropdown = getAllByText("Actions")
    expect(dropdown[1].getAttribute('aria-expanded')).toBe("false");
    act(() => {
      dropdown[1].click();
    })
    let editButton:any;
    let deleteButton:any;
    await waitFor(() => {
      expect(dropdown[1].getAttribute('aria-expanded')).toBe("true");
      editButton = getAllByText("Edit");
      expect(editButton.length).toBe(1);
      deleteButton = getAllByText("Delete");
      expect(deleteButton.length).toBe(1);
    });
    act(() => {
      editButton[0].click();
    })
    await waitFor(() => {
      expect(props.onEditClick).toHaveBeenCalledTimes(1);
    });
    act(() => {
      deleteButton[0].click();
    });
    await waitFor(() => {
      expect(props.onDeleteClick).toHaveBeenCalledTimes(1);
      expect(props.setToast).toHaveBeenCalledTimes(1);
    });
  });
});
