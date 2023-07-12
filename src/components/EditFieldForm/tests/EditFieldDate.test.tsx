import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditFieldDate, EditFieldDateProps } from "../EditFieldDate";
import { mockFormikProps } from "../../../testUtils";

describe("EditFieldDate", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "date",
      }
    } as EditFieldDateProps;
    render(<EditFieldDate {...mockProps} />);
  });
});
