import styled from "styled-components";

export const StyledAlert = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .alertContent {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: 45%;

    p {
      margin: 15px 0;
    }
  }
`;
