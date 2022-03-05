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
  // useEffect(() => {
  //   if (firstItem) {
  //     upgrade.current.focus();
  //   }
  // }, [firstItem]);

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
      return `Increases sushi per click by ${item.value}.`;
    } else {
      return `Produces ${item.value} sushi per second.`;
    }
  };

  return (
    <Button id={item.id} onMouseDown={buyUpgrade} ref={upgrade}>
      <ItemDetails>
        <Name>{item.name}</Name>
        <Cost>Cost: {upgradeCost} sushi</Cost>
        <Use>{itemUse()}</Use>
      </ItemDetails>
      <NumOwned>
        {upgradesOwned}
        <span>owned</span>
      </NumOwned>
    </Button>
  );
};

const Button = styled.button`
  background: #fff;
  color: #1a1a1a;
  width: 100%;
  padding: 10px;
  border-style: none;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s ease-in-out;
  &:hover,
  &:focus {
    background: #f7f7f7;
    cursor: pointer;
    outline: none;
  }
  &:last-child {
    border-bottom: none;
  }
  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }
`;

const ItemDetails = styled.div`
  padding-left: 10px;
  text-align: left;
`;

const Name = styled.p`
  font-family: "Merienda", cursive;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const Cost = styled.p`
  font-size: 1rem;
`;

const Use = styled.p`
  font-size: 0.8rem;
  color: #666;
`;

const NumOwned = styled.p`
  font-weight: bold;
  font-size: 2rem;
  padding-right: 10px;
  display: grid;
  place-content: center;
  span {
    font-size: 0.8rem;
    color: #999;
  }
`;

export default Item;
