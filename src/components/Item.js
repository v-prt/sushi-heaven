import React, { useEffect, useRef } from "react";
import styled from "styled-components/macro";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const Item = ({
  item,
  firstItem,
  upgradeCost,
  available,
  upgradesOwned,
  buyUpgrade,
}) => {
  const upgrade = useRef(null);
  console.log(item, available);

  let itemUse = () => {
    if (item.id === "megaCursor") {
      return `Increases sushi per click by ${item.value}.`;
    } else {
      return `Produces ${item.value} sushi per second.`;
    }
  };

  return (
    <Wrapper id={item.id} ref={upgrade}>
      <ItemDetails>
        <Name>{item.name}</Name>
        <div className="purchase">
          <BuyBtn onClick={buyUpgrade} disabled={!available}>
            Buy
          </BuyBtn>
          <div className="info">
            <Cost className={!available && "not-available"}>
              <RiMoneyDollarCircleLine /> {upgradeCost} sushi
            </Cost>
            <Use>{itemUse()}</Use>
          </div>
        </div>
      </ItemDetails>
      <NumOwned className={upgradesOwned === 0 && "none"}>
        {upgradesOwned}
        <span>owned</span>
      </NumOwned>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: #fff;
  color: #1a1a1a;
  width: 100%;
  padding: 20px;
  border-style: none;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .purchase {
    display: flex;
    align-items: center;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  text-align: left;
`;

const Name = styled.p`
  font-family: "Merienda", cursive;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const BuyBtn = styled.button`
  background: #ccc;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  transition: 0.3s ease-in-out;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  &:focus,
  &:hover {
    outline: none;
    background: #66b5ff;
    color: white;
  }
`;

const Cost = styled.p`
  color: #373737;
  display: flex;
  align-items: center;
  &.not-available {
    color: #fd6743;
  }
`;

const Use = styled.p`
  font-size: 0.8rem;
  color: #666;
`;

const NumOwned = styled.div`
  color: #373737;
  font-weight: bold;
  font-size: 2rem;
  display: grid;
  place-content: center;
  text-align: center;
  &.none {
    color: #ccc;
  }
  span {
    font-size: 0.8rem;
  }
`;

export default Item;
