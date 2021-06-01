import { DefaultButton } from "../components/Buttons";

import { Link } from "react-router-dom";
export const ErrorPage = () => {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: "24px",
        margin: "auto",
      }}
    >
      Sorry, something we didn't expect happened.
      <br />
      <DefaultButton>
        <Link to="/">back to home page</Link>
      </DefaultButton>
    </div>
  );
};
