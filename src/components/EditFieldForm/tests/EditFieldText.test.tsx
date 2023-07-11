import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditFieldText, EditFieldTextProps } from "../EditFieldText";
import { mockFormikProps } from "../../../testUtils";

describe("EditFieldText", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "text",
      }
    } as EditFieldTextProps;
    render(<EditFieldText {...mockProps} />);
  });
});