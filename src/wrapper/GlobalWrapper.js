import { Nav } from "../components/Nav";

export const GlobalWrapper = ({ children }) => {
  return (
    <>
      <Nav />

      {children}
    </>
  );
};
