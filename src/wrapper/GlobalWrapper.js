import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

export const GlobalWrapper = ({ children }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </>
  );
};
