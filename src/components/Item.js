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
        <Info>
          Cost: {itemCost} cookies. {itemUse()}
        </Info>
      </ItemDetails>
      <NumOwned>{numOwned}</NumOwned>
    </Button>
  );
};

const Button = styled.button`
  background: transparent;
  color: white;
  width: 400px;
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

const Name = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: left;
`;

const ItemDetails = styled.div`
  padding-left: 10px;
`;

const Info = styled.p`
  text-align: left;
`;

const NumOwned = styled.p`
  font-weight: bold;
  font-size: 1.5rem;
  text-align: right;
  padding-right: 10px;
`;

export default Item;
