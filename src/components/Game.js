import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import cookieSrc from "../cookie.svg";
import Item from "./Item";
import useInterval from "../hooks/use-interval.hook";

const items = [
  { id: "cursor", name: "Cursor", cost: 10, value: 1 },
  { id: "grandma", name: "Grandma", cost: 100, value: 10 },
  { id: "farm", name: "Farm", cost: 1000, value: 80 },
];

// creating reusable hooks
const useKeyDown = (code, callback) => {
  useEffect(() => {
    const handleKeyDown = () => {
      if (code === "Space") {
        callback();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
};

const useDocumentTitle = (title, fallbackTitle) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = fallbackTitle;
    };
    // warning: "React Hook useEffect has a missing dependency: 'fallbackTitle'. Either include it or remove the dependency array"
    // not sure how to fix but seems to work anyway
  }, [title]);
};

const Game = () => {
  const [numCookies, setNumCookies] = useState(100);
  const [purchasedItems, setPurchasedItems] = useState({
    cursor: 0,
    grandma: 0,
    farm: 0,
  });

  const makeCookie = () => {
    setNumCookies(numCookies + 1);
  };

  const buyItem = (item) => {
    if (numCookies < item.cost) {
      alert("You do not have enough cookies to make this purchase!");
      return;
    } else {
      setNumCookies(numCookies - item.cost);
      setPurchasedItems({
        // use spread operator to prevent overwriting other state values
        ...purchasedItems,
        [item.id]: purchasedItems[item.id] + 1,
      });
    }
  };

  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerTick(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  const calculateCookiesPerTick = (purchasedItems) => {
    let sum = 0;
    // iterate through each item and figure out total value of items
    items.forEach((item) => {
      sum += purchasedItems[item.id] * item.value;
    });
    return sum;
  };

  // calling the hooks
  useDocumentTitle(
    `${numCookies} cookies - Cookie Clicker Workshop`,
    "Cookie Clicker Workshop"
  );
  useKeyDown("Space", makeCookie);

  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <strong>{calculateCookiesPerTick(purchasedItems)}</strong> cookies per
          second
        </Indicator>
        <Button onClick={makeCookie}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {items.map((item) => {
          let firstItem;
          if (items.indexOf(item) === 0) {
            firstItem = true;
          }
          return (
            <Item
              item={item}
              firstItem={firstItem}
              numOwned={purchasedItems[item.id]}
              buyItem={() => buyItem(item)}
            />
          );
        })}
      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
