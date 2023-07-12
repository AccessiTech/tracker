import React from "react"; 
import { render, act, waitFor } from "@testing-library/react";
import { mockFormikProps } from "../../../testUtils";
import { EditFieldSelect, EditFieldSelectProps } from "../EditFieldSelect";

describe("EditFieldSelect", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "select",
      }
    } as EditFieldSelectProps;
    render(<EditFieldSelect {...mockProps} />);
  });
});