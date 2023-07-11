import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { EditFieldBoolean, EditFieldBooleanProps } from "../EditFieldBoolean";
import { mockFormikProps } from "../../../testUtils";

describe("EditFieldBoolean", () => {
  test("renders without crashing", () => {
    const mockProps = {
      ...mockFormikProps,
      values: {
        type: "boolean",
      }
    } as EditFieldBooleanProps;
    render(<EditFieldBoolean {...mockProps} />);
  });
})
