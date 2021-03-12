import React from "react";
import styled from "styled-components";

const Item = ({ item, numOwned, handleClick }) => {
  return (
    <Button id={item.id} onClick={() => handleClick(item, numOwned)}>
      <div>
        <Name>{item.name}</Name>
        <Details>
          Cost: {item.cost} cookie(s). Produces {item.value} cookies/second.
        </Details>
      </div>
      <NumOwned>{numOwned}</NumOwned>
    </Button>
  );
};

const Button = styled.button`
  background: transparent;
  color: white;
  width: 400px;
  margin: 10px;
  padding: 10px 10px 10px 0;
  border-style: none;
  border-bottom: 1px solid white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
    color: #4db8ff;
  }
`;

const Name = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
`;

const Details = styled.p`
  text-align: left;
`;

const NumOwned = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: right;
  margin-left: 40px;
`;

export default Item;
