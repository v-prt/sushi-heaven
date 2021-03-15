import React, { useState, useEffect, useRef } from "react";
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
    value: 3,
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
    // FIXME: warning - "React Hook useEffect has a missing dependency: 'fallbackTitle'. Either include it or remove the dependency array"
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
  const [upgradeCost, setUpgradeCost] = useState({
    cursor: 10,
    megaCursor: 50,
    grandma: 100,
    farm: 1000,
  });

  const points = useRef(null);
  const makeCookies = () => {
    setNumCookies(numCookies + cookiesPerClick);
    // points (cookiesPerClick) briefly appear on cookie
    let randomTop = Math.floor(Math.random() * 60) + 130;
    let randomLeft = Math.floor(Math.random() * 60) + 100;
    points.current.style.top = `${randomTop}px`;
    points.current.style.left = `${randomLeft}px`;
    points.current.style.visibility = "visible";
    setTimeout(() => {
      points.current.style.visibility = "hidden";
    }, 100);
  };

  const buyUpgrade = (item) => {
    if (numCookies < upgradeCost[item.id]) {
      // alert("You do not have enough cookies to make this purchase!");
      // return;
    } else if (item.id === "megaCursor") {
      setNumCookies(numCookies - upgradeCost[item.id]);
      setCookiesPerClick(cookiesPerClick + item.value);
      setNumUpgrades({
        // use spread operator to prevent overwriting other state values
        ...numUpgrades,
        [item.id]: numUpgrades[item.id] + 1,
      });
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
      });
    } else {
      setNumCookies(numCookies - upgradeCost[item.id]);
      setNumUpgrades({
        ...numUpgrades,
        [item.id]: numUpgrades[item.id] + 1,
      });
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
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
      displayNum = (numCookies / 1000000000).toFixed(1) + "b"; // billions
    } else if (num >= 1000000) {
      displayNum = (numCookies / 1000000).toFixed(1) + "m"; // millions
    } else if (num >= 1000) {
      displayNum = (numCookies / 1000).toFixed(1) + "k"; // thousands
    }
  };
  compactDisplayNum(numCookies);

  // calling the custom hooks
  useDocumentTitle(`${displayNum} cookies - Cookie Heaven`, "Cookie Heaven");
  useKeyUp("Space", makeCookies);

  return (
    <Wrapper>
      <GameArea>
        <Points ref={points}>+{cookiesPerClick}</Points>
        <CookieBtn onMouseDown={makeCookies}>
          <Cookie src={cookieSrc} />
        </CookieBtn>
      </GameArea>

      <Factory>
        <Indicator>
          <Total>COOKIES: {displayNum}</Total>
          <p>
            <strong>{cookiesPerSec}</strong> cookies per second
          </p>
          <p>
            <strong>{cookiesPerClick}</strong> cookies per click
          </p>
        </Indicator>
        <SectionTitle>UPGRADES</SectionTitle>
        <Upgrades>
          {upgrades.map((item) => {
            let firstItem;
            if (upgrades.indexOf(item) === 0) {
              firstItem = true;
            }
            let available = false;
            if (numCookies >= upgradeCost[item.id]) {
              available = true;
            }
            return (
              <Item
                item={item}
                firstItem={firstItem}
                upgradeCost={upgradeCost[item.id]}
                available={available}
                numOwned={numUpgrades[item.id]}
                buyUpgrade={() => buyUpgrade(item)}
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
`;

const GameArea = styled.div`
  margin: 30px;
`;

const Points = styled.p`
  visibility: hidden;
  position: relative;
  z-index: 10;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px #ff4da6;
`;

const CookieBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  // removes the ugly focus ring (not accessibility-friendly)
  &:focus {
    outline: none;
  }
`;

const Cookie = styled.img`
  width: 300px;
  transition: 0.2s ease-in-out;
  &:active {
    transform: scale(0.9);
  }
`;

const Factory = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
  border: 6px solid white;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
  background: linear-gradient(#b3daff, #ffb3d9);
`;

const Indicator = styled.div`
  text-align: center;
  margin: 30px;
  p {
    font-size: 1.2rem;
  }
`;

const Total = styled.h3`
  font-size: 2.3rem;
  font-family: "Merienda", cursive;
  font-weight: bold;
  text-shadow: 0 0 10px white;
`;

const SectionTitle = styled.h3`
  font-family: "Merienda", cursive;
  text-align: center;
  font-size: 1.8rem;
  background: #80c1ff;
  width: 100%;
  padding: 10px 0;
  border-top: 6px solid white;
  border-bottom: 5px solid #b3daff;
`;

const Upgrades = styled.div`
  border-bottom: 6px solid white;
  width: 100%;
`;

const HomeLink = styled(Link)`
  margin: 10px 0;
`;

export default Game;
