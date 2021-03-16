import styled from "styled-components";

const Button = styled.button`
  background: transparent;
  font-family: "Raleway", sans-serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: #66b5ff;
  flex: 1 1 auto;
  border: none;
  padding: 10px;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    background: #66b5ff;
    color: white;
  }
`;

export default Button;
