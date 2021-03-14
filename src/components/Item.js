import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Item = ({ item, firstItem, itemCost, numOwned, buyItem }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (firstItem) {
      ref.current.focus();
    }
  }, [firstItem]);

  let itemUse = () => {
    if (item.id === "megaCursor") {
      return `Increases cookies per click by ${item.value}.`;
    } else {
      return `Produces ${item.value} cookies/second.`;
    }
  };

  return (
    <Button id={item.id} onMouseDown={buyItem} ref={ref}>
      <ItemDetails>
        <Name>{item.name}</Name>
        <Cost>Cost: {itemCost} cookies.</Cost>
        <Use>{itemUse()}</Use>
      </ItemDetails>
      <NumOwned>{numOwned}</NumOwned>
    </Button>
  );
};

const Button = styled.button`
  background: transparent;
  color: white;
  width: 100%;
  padding: 10px 0;
  border-style: none;
  border-bottom: 1px dashed white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    color: #ff4da6;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  padding-left: 10px;
  text-align: left;
`;

const Name = styled.p`
  font-family: "Merienda", cursive;
  font-weight: bold;
  font-size: 1.7rem;
  margin-bottom: 10px;
`;

const Cost = styled.p`
  font-size: 1.1rem;
`;

const Use = styled.p`
  font-size: 1.1rem;
`;

const NumOwned = styled.p`
  font-weight: bold;
  font-size: 3rem;
  padding-right: 10px;
`;

export default Item;
