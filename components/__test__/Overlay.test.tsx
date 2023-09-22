import Overlay from "@/components/Overlay";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const onClick = jest.fn();

describe("Overlay tests", () => {
  it("renders without crashing", () => {
    render(
      <Overlay onClick={() => {}}>
        <div>overlay</div>
      </Overlay>
    );

    expect(screen.getByText("overlay")).toBeInTheDocument();
  });

  it("click listener", async () => {
    render(
      <Overlay onClick={onClick}>
        <div>overlay</div>
      </Overlay>
    );

    const overlay = screen.getByText("overlay");
    await userEvent.click(overlay);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
