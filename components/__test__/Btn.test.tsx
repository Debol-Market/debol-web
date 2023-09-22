import { render, screen } from "@testing-library/react";
import Btn from "../Btn";

describe("Btn", () => {
  test("renders button with label", () => {
    render(<Btn label="Submit" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("renders button with disabled state", () => {
    render(<Btn label="Submit" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("renders button with loading state", () => {
    render(<Btn label="Submit" isLoading />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders button with custom class name", () => {
    render(<Btn label="Submit" className="custom-btn" />);
    expect(screen.getByRole("button")).toHaveClass("custom-btn");
  });
});
