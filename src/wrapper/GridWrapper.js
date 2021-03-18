import styled from "styled-components";

export const GridWrapper = styled.div`
  display: grid;
  margin-left: 10vw;
  margin-right: 10vw;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 3rem;

  justify-content: center;
  @media (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;
