import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import cookieSrc from "../real-cookie.png";
import Item from "./Item";
import useInterval from "../hooks/use-interval.hook";

const upgrades = [
  { id: "cursor", name: "Cursor", cost: 10, value: 1 },
  {
    id: "megaCursor",
    name: "Mega Cursor",
    cost: 50,
    value: 5,
  },
  { id: "grandma", name: "Grandma", cost: 100, value: 10 },
  { id: "farm", name: "Farm", cost: 1000, value: 80 },
];

// REUSABLE CUSTOM HOOK
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

// REUSABLE CUSTOM HOOK
// switched to keyup to prevent holding down spacebar to make cookies
const useKeyUp = (code, callback) => {
  useEffect(() => {
    const handleKeyUp = (ev) => {
      if (ev.code === code) {
        callback();
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });
};

const Game = () => {
  const [numCookies, setNumCookies] = useState(100);
  const [cookiesPerClick, setCookiesPerClick] = useState(1);
  const [numUpgrades, setNumUpgrades] = useState({
    cursor: 0,
    megaCursor: 0,
    grandma: 0,
    farm: 0,
  });
  const [itemCost, setItemCost] = useState({
    cursor: 10,
    megaCursor: 50,
    grandma: 100,
    farm: 1000,
  });

  const makeCookies = () => {
    setNumCookies(numCookies + cookiesPerClick);
  };

  const buyItem = (item) => {
    if (numCookies < itemCost[item.id]) {
      alert("You do not have enough cookies to make this purchase!");
      return;
    } else if (item.id === "megaCursor") {
      setNumCookies(numCookies - itemCost[item.id]);
      setCookiesPerClick(cookiesPerClick + item.value);
      setNumUpgrades({
        // use spread operator to prevent overwriting other state values
        ...numUpgrades,
        [item.id]: numUpgrades[item.id] + 1,
      });
      setItemCost({
        ...itemCost,
        [item.id]: Math.floor(itemCost[item.id] * 1.25),
      });
    } else {
      setNumCookies(numCookies - itemCost[item.id]);
      setNumUpgrades({
        ...numUpgrades,
        [item.id]: numUpgrades[item.id] + 1,
      });
      setItemCost({
        ...itemCost,
        [item.id]: Math.floor(itemCost[item.id] * 1.25),
      });
    }
  };

  const calcCookiesPerSec = (numUpgrades) => {
    let num = 0;
    num =
      1 * numUpgrades["cursor"] +
      10 * numUpgrades["grandma"] +
      80 * numUpgrades["farm"];
    return num;
  };

  const cookiesPerSec = calcCookiesPerSec(numUpgrades);
  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    setNumCookies(numCookies + cookiesPerSec);
  }, 1000);

  // shorten display number of cookies when over threshold
  let displayNum = numCookies;
  const compactDisplayNum = (num) => {
    if (num >= 1000000000) {
      displayNum = (numCookies / 1000000000).toFixed(2) + "b"; // billions
    } else if (num >= 1000000) {
      displayNum = (numCookies / 1000000).toFixed(2) + "m"; // millions
    } else if (num >= 1000) {
      displayNum = (numCookies / 1000).toFixed(2) + "k"; // thousands
    }
  };
  compactDisplayNum(numCookies);

  // calling the custom hooks
  useDocumentTitle(`${displayNum} cookies - Cookie Heaven`, "Cookie Heaven");
  useKeyUp("Space", makeCookies);

  return (
    <Wrapper>
      <GameArea>
        <CookieBtn onMouseDown={makeCookies}>
          <Cookie src={cookieSrc} />
        </CookieBtn>
      </GameArea>

      <Factory>
        <Indicator>
          <Total>Cookies: {displayNum}</Total>
          <strong>{cookiesPerSec}</strong> cookies per second
          <div>
            <strong>{cookiesPerClick}</strong> cookies per click
          </div>
        </Indicator>
        <SectionTitle>Upgrades</SectionTitle>
        <Upgrades>
          {upgrades.map((item) => {
            let firstItem;
            if (upgrades.indexOf(item) === 0) {
              firstItem = true;
            }
            return (
              <Item
                item={item}
                firstItem={firstItem}
                itemCost={itemCost[item.id]}
                numOwned={numUpgrades[item.id]}
                buyItem={() => buyItem(item)}
              />
            );
          })}
        </Upgrades>
        <HomeLink to="/">Quit (Return Home)</HomeLink>
      </Factory>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const GameArea = styled.div``;

const CookieBtn = styled.button`
  border: none;
  background: transparent;
  margin-right: 50px;
  cursor: pointer;
  // removes the ugly focus ring (not accessibility-friendly)
  &:focus {
    outline: none;
  }
`;

const Cookie = styled.img`
  width: 300px;
`;

const Factory = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 6px solid white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
  background: linear-gradient(#b3daff, #ffb3d9);
`;

const Indicator = styled.div`
  text-align: center;
  margin: 30px;
`;

const Total = styled.h3`
  font-size: 3rem;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  background: #80c1ff;
  width: 100%;
  padding: 10px 0;
  border-top: 6px solid white;
  border-bottom: 5px solid #b3daff;
`;

const Upgrades = styled.div`
  border-bottom: 6px solid white;
`;

const HomeLink = styled(Link)`
  margin: 10px 0;
`;

export default Game;
