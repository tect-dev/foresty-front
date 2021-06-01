import { LargeText, XXXLargeText } from "../components/Texts";
import { DefaultButton } from "../components/Buttons";

import { Link } from "react-router-dom";
export const ContactPage = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        margin: "auto",
      }}
    >
      <XXXLargeText>Contact</XXXLargeText>
      <br />
      <br />
      If you have any questions or feedbacks, then please get in touch using the
      following email.
      <br />
      <br />
      <LargeText>contact@foresty.net</LargeText>
    </div>
  );
};
