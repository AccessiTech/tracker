import React, { FC, ReactElement } from "react";
import { Dropdown } from "react-bootstrap";
import { initialFieldStates, LogFields } from "../../store/Log";

interface EditFieldClickFunction {
  (e: React.MouseEvent<HTMLElement, MouseEvent>, field: LogFields): void;
}
interface DeleteFieldClickFunction {
  (e: React.MouseEvent<HTMLElement, MouseEvent>, fieldId: string): void;
}

export interface EditFieldsTableProps {
  fields: LogFields[];
  onEditClick: EditFieldClickFunction;
  onDeleteClick: DeleteFieldClickFunction;
}

export const EditFieldsTable: FC<EditFieldsTableProps> = ({
  fields,
  onEditClick,
  onDeleteClick,
}): ReactElement => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Type Option</th>
          <th scope="col">Required</th>
          <th scope="col" style={{ width: "20%" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field: LogFields) => (
          <tr key={field.id} style={{ verticalAlign: "middle" }}>
            <td>{field.name}</td>
            <td>{field.type}</td>
            <td>
              {initialFieldStates[field.type].typeOptions ? field.option : ""}
            </td>
            <td>{field.required ? "Yes" : "No"}</td>
            <td>
              <Dropdown>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-basic"
                  size="sm"
                >
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      onEditClick(e, field);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteClick(e, field.id);
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditFieldsTable;
