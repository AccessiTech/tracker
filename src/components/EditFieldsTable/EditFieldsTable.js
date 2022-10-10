import React from "react";
import { PropTypes } from "prop-types";
import { Dropdown } from "react-bootstrap";

export const EditFieldsTable = ({ fields, onEditClick, onDeleteClick }) => {

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col" style={{ width: "20%" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.id} style={{ verticalAlign: "middle" }}>
            <td>{field.name}</td>
            <td>{field.type}</td>
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

EditFieldsTable.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};