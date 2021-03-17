import styled from "styled-components";

export const GridWrapper = styled.div`
  display: grid;
  margin-left: 10vw;
  margin-right: 10vw;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3rem;
  grid-auto-columns: minmax(125px, auto);
  grid-auto-rows: minmax(125px, auto);
  justify-content: "center";
  @media (max-width: 1440) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 768) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650) {
    grid-template-columns: 1fr;
  }
`;
