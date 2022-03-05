import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";

import useInterval from "../hooks/use-interval.hook";
import useDocumentTitle from "../hooks/use-document-title.hook";
import useKeyUp from "../hooks/use-key-up.hook";
import usePersistedState from "../hooks/use-persisted-state.hook";

import sushi from "../assets/cute-sushi.png";
import Item from "./Item";
import upgrades from "../data";

const Game = () => {
  const [sushiPerClick, setSushiPerClick] = useState(1);
  const [numSushi, setNumSushi] = usePersistedState(1000, "num-sushi");
  const [upgradesOwned, setUpgradesOwned] = usePersistedState(
    {
      cursor: 0,
      megaCursor: 0,
      jiro: 0,
      farm: 0,
      factory: 0,
    },
    "upgrades-owned"
  );
  const [upgradeCost, setUpgradeCost] = usePersistedState(
    {
      cursor: 10,
      megaCursor: 100,
      jiro: 1500,
      farm: 20000,
      factory: 500000,
    },
    "upgrade-cost"
  );

  // points (sushiPerClick) briefly appear on sushi in random spots
  const points = useRef(null);
  const makeSushi = () => {
    if (sushiPerClick === 0) {
      return;
    } else {
      setNumSushi(numSushi + sushiPerClick);
      let randomTop = Math.floor(Math.random() * 60) + 130;
      let randomLeft = Math.floor(Math.random() * 60) + 100;
      points.current.style.top = `${randomTop}px`;
      points.current.style.left = `${randomLeft}px`;
      points.current.style.visibility = "visible";
      setTimeout(() => {
        points.current.style.visibility = "hidden";
      }, 100);
    }
  };

  const buyUpgrade = (item) => {
    if (item.id === "megaCursor") {
      setNumSushi(numSushi - upgradeCost[item.id]);
      setSushiPerClick(sushiPerClick + item.value);
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
      setNumSushi(numSushi - upgradeCost[item.id]);
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

  const calcSushiPerSec = (upgradesOwned) => {
    let num = 0;
    num =
      1 * upgradesOwned["cursor"] +
      10 * upgradesOwned["jiro"] +
      80 * upgradesOwned["farm"] +
      150 * upgradesOwned["factory"];
    return num;
  };

  const sushiPerSec = calcSushiPerSec(upgradesOwned);

  useEffect(() => {
    setSushiPerClick(3 * upgradesOwned["megaCursor"] + 1);
  }, [upgradesOwned]);

  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    setNumSushi(numSushi + sushiPerSec);
    // stores the number of milliseconds since midnight 1/1/1970
    localStorage.setItem("timer", new Date().getTime());
  }, 1000);

  useEffect(() => {
    let timer = localStorage.getItem("timer");
    let timeElapsed = new Date().getTime() - timer;
    timeElapsed = Math.floor(timeElapsed / 1000);
    const sushiEarned = sushiPerSec * timeElapsed;
    setNumSushi(numSushi + sushiEarned);
  }, [sushiPerSec, numSushi, setNumSushi]);

  // shorten display number of sushi when over threshold
  let displayNum = numSushi;
  const compactDisplayNum = (num) => {
    if (num >= 1000000000000) {
      displayNum = (numSushi / 1000000000000).toFixed(1) + "t"; // trillions
    } else if (num >= 1000000000) {
      displayNum = (numSushi / 1000000000).toFixed(1) + "b"; // billions
    } else if (num >= 1000000) {
      displayNum = (numSushi / 1000000).toFixed(1) + "m"; // millions
    } else if (num >= 1000) {
      displayNum = (numSushi / 1000).toFixed(1) + "k"; // thousands
    }
  };
  compactDisplayNum(numSushi);

  const handleReset = () => {
    localStorage.clear();
    setSushiPerClick(1);
    setNumSushi(0);
    setUpgradeCost({
      cursor: 10,
      megaCursor: 100,
      jiro: 1500,
      farm: 20000,
      factory: 500000,
    });
    setUpgradesOwned({
      cursor: 0,
      megaCursor: 0,
      jiro: 0,
      farm: 0,
      factory: 0,
    });
  };

  // calling the custom hooks
  useDocumentTitle(`Sushi Heaven - ${displayNum} sushi`, "Sushi Heaven");
  useKeyUp("Space", makeSushi);

  return (
    <Wrapper>
      <GameArea>
        <Points ref={points}>+{sushiPerClick}</Points>
        <SushiBtn onMouseDown={makeSushi}>
          <Sushi src={sushi} />
        </SushiBtn>
      </GameArea>
      <Factory>
        <Options>
          <HomeLink to="/">Home</HomeLink>
          <Button onClick={handleReset}>Reset</Button>
        </Options>
        <Indicator>
          <Total>{displayNum} sushi</Total>
          <p>
            <strong>+{sushiPerSec}</strong> per second
          </p>
          <p>
            <strong>+{sushiPerClick}</strong> per click
          </p>
        </Indicator>
        <SectionTitle>Upgrades</SectionTitle>
        <Upgrades>
          {upgrades.map((item, i) => {
            let firstItem;
            if (upgrades.indexOf(item) === 0) {
              firstItem = true;
            }
            let available = false;
            if (numSushi >= upgradeCost[item.id]) {
              available = true;
            }
            return (
              <Item
                key={i}
                item={item}
                firstItem={firstItem}
                upgradeCost={upgradeCost[item.id].toLocaleString()}
                available={available}
                upgradesOwned={upgradesOwned[item.id]}
                buyUpgrade={() => buyUpgrade(item)}
              />
            );
          })}
        </Upgrades>
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
  color: #fff;
  visibility: hidden;
  position: relative;
  z-index: 10;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px #ff4da6;
`;

const SushiBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Sushi = styled.img`
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
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
`;

const Options = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 6px solid white;
`;

const Indicator = styled.div`
  text-align: center;
  margin: 30px;
  p {
    font-size: 1.1rem;
    color: #666;
    strong {
      color: #000;
    }
  }
`;

const Total = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: #ff4da6;
  margin-bottom: 10px;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 1.2rem;
  background: #f2f2f2;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid #e6e6e6;
`;

const Upgrades = styled.div`
  width: 100%;
`;

const HomeLink = styled(Link)`
  background: #f2f2f2;
  margin: 5px;
  font-size: 0.9rem;
  color: #999;
  border-radius: 10px;
`;

const Button = styled.button`
  background: #f2f2f2;
  font-family: "Raleway", sans-serif;
  font-size: 0.9rem;
  font-weight: bold;
  color: #999;
  flex: 1 1 auto;
  border: none;
  padding: 10px;
  transition: 0.3s ease-in-out;
  margin: 5px;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    background: #66b5ff;
    color: white;
  }
`;

export default Game;
