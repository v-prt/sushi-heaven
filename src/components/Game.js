import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import useInterval from "../hooks/use-interval.hook";
import useDocumentTitle from "../hooks/use-document-title.hook";
import useKeyUp from "../hooks/use-key-up.hook";
import usePersistedState from "../hooks/use-persisted-state.hook";

import cookieSrc from "../real-cookie.png";
import Item from "./Item";
import upgrades from "../data";

const Game = () => {
  const [cookiesPerClick, setCookiesPerClick] = useState(1);
  const [numCookies, setNumCookies] = usePersistedState(1000, "num-cookies");
  const [upgradesOwned, setUpgradesOwned] = usePersistedState(
    {
      cursor: 0,
      megaCursor: 0,
      grandma: 0,
      farm: 0,
    },
    "upgrades-owned"
  );
  const [upgradeCost, setUpgradeCost] = usePersistedState(
    {
      cursor: 10,
      megaCursor: 50,
      grandma: 100,
      farm: 1000,
    },
    "upgrade-cost"
  );

  // points (cookiesPerClick) briefly appear on cookie
  const points = useRef(null);
  const makeCookies = () => {
    setNumCookies(numCookies + cookiesPerClick);
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
      setUpgradesOwned({
        // use spread operator to prevent overwriting other state values
        ...upgradesOwned,
        [item.id]: upgradesOwned[item.id] + 1,
      });
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
      });
    } else {
      setNumCookies(numCookies - upgradeCost[item.id]);
      setUpgradesOwned({
        ...upgradesOwned,
        [item.id]: upgradesOwned[item.id] + 1,
      });
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
      });
    }
  };

  const calcCookiesPerSec = (upgradesOwned) => {
    let num = 0;
    num =
      1 * upgradesOwned["cursor"] +
      10 * upgradesOwned["grandma"] +
      80 * upgradesOwned["farm"];
    return num;
  };

  const cookiesPerSec = calcCookiesPerSec(upgradesOwned);
  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    setNumCookies(numCookies + cookiesPerSec);
    // stores the number of milliseconds since midnight 1/1/1970
    localStorage.setItem("timer", new Date().getTime());
  }, 1000);

  useEffect(() => {
    let timer = localStorage.getItem("timer");
    let timeElapsed = new Date().getTime() - timer;
    timeElapsed = Math.floor(timeElapsed / 1000);
    const cookiesEarned = cookiesPerSec * timeElapsed;
    setNumCookies(numCookies + cookiesEarned);
    // FIXME: "warning - React Hook useEffect has missing dependencies: 'cookiesPerSec', 'numCookies', and 'setNumCookies'. Either include them or remove the dependency array"
    // not sure how to fix, works anyway (if I remove the [] it breaks)
  }, []);

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

  const handleRestart = () => {
    localStorage.clear();
    setCookiesPerClick(1);
    setNumCookies(1000);
    setUpgradeCost({
      cursor: 10,
      megaCursor: 50,
      grandma: 100,
      farm: 1000,
    });
    setUpgradesOwned({
      cursor: 0,
      megaCursor: 0,
      grandma: 0,
      farm: 0,
    });
  };

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
                upgradesOwned={upgradesOwned[item.id]}
                buyUpgrade={() => buyUpgrade(item)}
              />
            );
          })}
        </Upgrades>
        <HomeLink to="/">Home</HomeLink>
        <RestartBtn onClick={handleRestart}>Restart</RestartBtn>
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
  margin: 10px 0 5px 0;
`;

const RestartBtn = styled.button`
  border: none;
  background: transparent;
  margin: 5px 0 10px 0;
  font-family: "Raleway", sans-serif;
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
  transition: 0.3s ease-in-out;
  &:hover {
    cursor: pointer;
    color: #ff4da6;
    font-weight: bold;
  }
`;

export default Game;
