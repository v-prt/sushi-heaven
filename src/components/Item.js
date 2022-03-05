import React, { useEffect, useRef } from "react";
import styled from "styled-components/macro";

const Item = ({
  item,
  firstItem,
  upgradeCost,
  available,
  upgradesOwned,
  buyUpgrade,
}) => {
  const upgrade = useRef(null);

  // FOCUSES ON FIRST ITEM ON LOAD
  useEffect(() => {
    if (firstItem) {
      upgrade.current.focus();
    }
  }, [firstItem]);

  // DISABLES & ENABLES UPGRADES
  useEffect(() => {
    if (available === false) {
      upgrade.current.disabled = true;
    } else if (available === true) {
      upgrade.current.disabled = false;
    }
  }, [available]);

  let itemUse = () => {
    if (item.id === "megaCursor") {
      return `Increases cookies per click by ${item.value}.`;
    } else {
      return `Produces ${item.value} cookies/second.`;
    }
  };

  return (
    <Button id={item.id} onMouseDown={buyUpgrade} ref={upgrade}>
      <ItemDetails>
        <Name>{item.name}</Name>
        <Cost>Cost: {upgradeCost} cookies.</Cost>
        <Use>{itemUse()}</Use>
      </ItemDetails>
      <NumOwned>{upgradesOwned}</NumOwned>
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
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    color: #ff4da6;
  }
  &:last-child {
    border-bottom: none;
  }
  &:disabled {
    pointer-events: none;
    opacity: 0.3;
    color: white;
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
