import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { TypeOptionSelect, TypeOptionSelectProps } from "../TypeOptionSelect"
import { mockFormikProps } from "../../../testUtils";

describe("TypeOptionSelect", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "text",
      }
    } as TypeOptionSelectProps
    render(<TypeOptionSelect {...mockProps} />);
  });
});