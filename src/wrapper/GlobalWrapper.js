import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

export const GlobalWrapper = ({ children }) => {
  return (
    <>
      <Nav />

      {children}
      <Footer />
    </>
  );
};
