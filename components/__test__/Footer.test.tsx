import { render } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer component", () => {
  it("renders Footer component", () => {
    render(<Footer />);
  });

  it("renders Debol logo and name", () => {
    const { getByText } = render(<Footer />);
    getByText("Debol");
    getByText("Market");
  });

  it("renders description text", () => {
    const { getByText } = render(<Footer />);
    getByText(
      "Debol is an innovative delivery platform that aims to revolutionize the shopping experience in Ethiopia. It collaborates with multiple institutions to offer a comprehensive platform for selling and delivering various items and equipment."
    );
  });

  it("renders Contact Us link", () => {
    const { getByText } = render(<Footer />);
    getByText("Contact Us");
  });

  it("renders social media icons", () => {
    // Uncomment the lines below when the social media icons are added to the code
    // const { getByTestId } = render(<Footer />);
    // getByTestId('instagram-icon');
    // getByTestId('tiktok-icon');
    // getByTestId('telegram-icon');
    // getByTestId('twitter-icon');
  });

  it("renders copyright text", () => {
    const { getByText } = render(<Footer />);
    getByText("2023 - Debol Trading LLC. all right reserved");
  });
});
