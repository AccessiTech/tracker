import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditFieldNumber, EditFieldNumberProps } from "../EditFieldNumber";
import { mockFormikProps } from "../../../testUtils";

describe("EditFieldNumber", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "number",
      }
    } as EditFieldNumberProps;
    render(<EditFieldNumber {...mockProps} />);
  });
});