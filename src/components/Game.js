import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import { useInterval } from '../hooks/use-interval.hook'
import { useDocumentTitle } from '../hooks/use-document-title.hook'
import { useKeyUp } from '../hooks/use-key-up.hook'
import { usePersistedState } from '../hooks/use-persisted-state.hook'

import sushi from '../assets/sushi.png'
import { RiHomeHeartLine } from 'react-icons/ri'
import { IoReloadCircleOutline } from 'react-icons/io5'
import { Item } from './Item'
import { upgrades, restaurants } from '../data'

export const Game = () => {
  const [newGame, setNewGame] = useState(false)
  const [sushiPerClick, setSushiPerClick] = useState(1)
  const [numSushi, setNumSushi] = usePersistedState(0, 'num-sushi')
  const [money, setMoney] = usePersistedState(0, 'money')
  const [viewUpgrades, setViewUpgrades] = useState(false)
  const [viewRestaurants, setViewRestaurants] = useState(false)

  const [upgradesOwned, setUpgradesOwned] = usePersistedState(
    {
      megaCursor: 0,
      autoCursor: 0,
      jiro: 0,
      farm: 0,
      factory: 0,
    },
    'upgrades-owned'
  )
  const [upgradeCost, setUpgradeCost] = usePersistedState(
    {
      megaCursor: 10,
      autoCursor: 100,
      jiro: 1500,
      farm: 20000,
      factory: 500000,
    },
    'upgrade-cost'
  )
  const [restaurantsOwned, setRestaurantsOwned] = usePersistedState(
    {
      bar: 1,
      restaurant: 0,
      chain: 0,
    },
    'restaurants-owned'
  )
  const [restaurantCost, setRestaurantCost] = usePersistedState(
    {
      bar: 10000,
      restaurant: 75000,
      chain: 2250000,
    },
    'restaurant-cost'
  )

  useEffect(() => {
    if (numSushi > 0) {
      setNewGame(false)
    } else setNewGame(true)
  }, [numSushi])

  // points (sushiPerClick) briefly appear on sushi in random spots
  const pointsRef = useRef(null)
  const sushiRef = useRef(null)
  const makeSushi = () => {
    setNumSushi(numSushi + sushiPerClick)
    let randomTop = Math.floor(Math.random() * 50) + 40
    let randomLeft = Math.floor(Math.random() * 50) + 100
    pointsRef.current.style.top = `${randomTop}px`
    pointsRef.current.style.left = `${randomLeft}px`
    pointsRef.current.style.opacity = '1'
    sushiRef.current.style.transform = 'scale(0.9)'
    setTimeout(() => {
      pointsRef.current.style.opacity = '0'
      sushiRef.current.style.transform = 'scale(1)'
    }, 100)
  }

  const buyUpgrade = item => {
    if (item.id === 'megaCursor') {
      setNumSushi(numSushi - upgradeCost[item.id])
      setSushiPerClick(sushiPerClick + item.value)
      setUpgradesOwned({
        // use spread operator to prevent overwriting other state values
        ...upgradesOwned,
        [item.id]: upgradesOwned[item.id] + 1,
      })
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
      })
    } else {
      setNumSushi(numSushi - upgradeCost[item.id])
      setUpgradesOwned({
        ...upgradesOwned,
        [item.id]: upgradesOwned[item.id] + 1,
      })
      setUpgradeCost({
        ...upgradeCost,
        [item.id]: Math.floor(upgradeCost[item.id] * 1.25),
      })
    }
  }

  const calcSushiPerSec = upgradesOwned => {
    let num = 0
    num =
      1 * upgradesOwned['autoCursor'] +
      10 * upgradesOwned['jiro'] +
      80 * upgradesOwned['farm'] +
      150 * upgradesOwned['factory']
    return num
  }
  const sushiPerSec = calcSushiPerSec(upgradesOwned)

  useEffect(() => {
    setSushiPerClick(3 * upgradesOwned['megaCursor'] + 1)
  }, [upgradesOwned])

  const buyRestaurant = item => {
    setMoney(money - restaurantCost[item.id])
    setRestaurantsOwned({
      ...restaurantsOwned,
      [item.id]: restaurantsOwned[item.id] + 1,
    })
    setRestaurantCost({
      ...restaurantCost,
      [item.id]: Math.floor(restaurantCost[item.id] * 1.75),
    })
  }

  const calcMoneyPerSec = restaurantsOwned => {
    let num = 0
    num =
      1 * restaurantsOwned['bar'] +
      100 * restaurantsOwned['restaurant'] +
      750 * restaurantsOwned['chain']
    return num / 2
  }
  const moneyPerSec = calcMoneyPerSec(restaurantsOwned)

  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    if (numSushi > 0) {
      setNumSushi(numSushi + sushiPerSec - moneyPerSec * 2)
    }
    if (numSushi > 0) {
      setMoney(money + moneyPerSec)
    }
    // stores the number of milliseconds since midnight 1/1/1970
    localStorage.setItem('timer', new Date().getTime())
  }, 1000)

  useEffect(() => {
    let timer = localStorage.getItem('timer')
    let timeElapsed = new Date().getTime() - timer
    timeElapsed = Math.floor(timeElapsed / 1000)
    const sushiEarned = sushiPerSec * timeElapsed
    setNumSushi(numSushi + sushiEarned)
  }, [sushiPerSec, numSushi, setNumSushi])

  // shorten display number of sushi when over threshold
  let displayNum = numSushi
  const compactDisplayNum = num => {
    if (num >= 1000000000000) {
      displayNum = (numSushi / 1000000000000).toFixed(1) + 't' // trillions
    } else if (num >= 1000000000) {
      displayNum = (numSushi / 1000000000).toFixed(1) + 'b' // billions
    } else if (num >= 1000000) {
      displayNum = (numSushi / 1000000).toFixed(1) + 'm' // millions
    } else if (num >= 1000) {
      displayNum = (numSushi / 1000).toFixed(1) + 'k' // thousands
    }
  }
  compactDisplayNum(numSushi)

  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset the game? You will lose all your progress!')
    ) {
      localStorage.clear()
      setSushiPerClick(1)
      setNumSushi(0)
      setMoney(0)
      setUpgradeCost({
        megaCursor: 10,
        autoCursor: 100,
        jiro: 1500,
        farm: 20000,
        factory: 500000,
      })
      setUpgradesOwned({
        megaCursor: 0,
        autoCursor: 0,
        jiro: 0,
        farm: 0,
        factory: 0,
      })
      setRestaurantCost({
        bar: 10000,
        restaurant: 75000,
        chain: 2250000,
      })
      setRestaurantsOwned({
        bar: 1,
        restaurant: 0,
        chain: 0,
      })
    }
  }

  // calling the custom hooks
  useDocumentTitle(`Sushi Heaven - ${displayNum} sushi`, 'Sushi Heaven')
  useKeyUp('Space', makeSushi)

  return (
    <Wrapper>
      <GameArea>
        <Instructions newGame={newGame}>
          Click me or tap the spacebar to make sushi!
          <span className='arrow' />
        </Instructions>
        <GameButton onClick={makeSushi}>
          <Points ref={pointsRef}>+{sushiPerClick}</Points>
          <Sushi src={sushi} ref={sushiRef} />
        </GameButton>
      </GameArea>
      <Factory>
        <Actions>
          <Link to='/' className='action'>
            <span className='icon'>
              <RiHomeHeartLine />
            </span>
            Home
          </Link>
          <button className='action' onClick={handleReset}>
            <span className='icon'>
              <IoReloadCircleOutline />
            </span>
            Reset
          </button>
        </Actions>
        <Indicator>
          {/* TODO: improve styling & layout */}
          <Total className={numSushi === 0 && 'none'}>{displayNum} sushi</Total>
          <p>
            <strong>+{sushiPerSec}</strong> sushi per second
          </p>
          <p>
            <strong>+{sushiPerClick}</strong> sushi per click
          </p>
          <Total className={money === 0 && 'none'}>${money}</Total>
          <p>
            <strong>+{moneyPerSec}</strong> income per second
          </p>
        </Indicator>
        <SectionTitle
          onClick={() => {
            setViewRestaurants(false)
            setViewUpgrades(!viewUpgrades)
          }}>
          Upgrades
        </SectionTitle>
        <Upgrades expand={viewUpgrades}>
          {upgrades.map((item, i) => {
            let available = false
            if (numSushi >= upgradeCost[item.id]) {
              available = true
            }
            return (
              <Item
                key={i}
                item={item}
                currency={item.currency}
                cost={upgradeCost[item.id].toLocaleString()}
                available={available}
                numOwned={upgradesOwned[item.id]}
                buyUpgrade={() => buyUpgrade(item)}
              />
            )
          })}
        </Upgrades>
        <SectionTitle
          onClick={() => {
            setViewUpgrades(false)
            setViewRestaurants(!viewRestaurants)
          }}>
          Restaurants
        </SectionTitle>
        <Restaurants expand={viewRestaurants}>
          {restaurants.map((item, i) => {
            let available = false
            if (money >= restaurantCost[item.id]) {
              available = true
            }
            return (
              <Item
                key={i}
                item={item}
                type='restaurant'
                currency={item.currency}
                cost={restaurantCost[item.id].toLocaleString()}
                available={available}
                numOwned={restaurantsOwned[item.id]}
                buyRestaurant={() => buyRestaurant(item)}
              />
            )
          })}
        </Restaurants>
      </Factory>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  @media only screen and (min-width: 800px) {
    flex-direction: row;
    align-items: flex-start;
  }
`

const GameArea = styled.div`
  margin-top: 50px;
`

const Instructions = styled.div`
  visibility: ${props => (props.newGame ? 'visible' : 'hidden')};
  opacity: ${props => (props.newGame ? '1' : '0')};
  transition: 0.2s ease-in-out;
  background: rgba(255, 255, 255, 0.7);
  border: 5px solid #fff;
  border-radius: 5px;
  padding: 20px;
  width: 250px;
  margin: auto;
  text-align: center;
  position: relative;
  animation: ${props =>
    props.newGame ? 'bounce 1s infinite alternate cubic-bezier(0.13, 0.71, 0.56, 0.98)' : 'none'};
  .arrow {
    background: #fff;
    height: 7px;
    width: 7px;
    transform: rotate(45deg);
    position: absolute;
    left: 120px;
    bottom: -8px;
  }
  @keyframes bounce {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-15px);
    }
  }
`

const GameButton = styled.button`
  border: none;
  background: transparent;
  margin: 30px;
  position: relative;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`

const Points = styled.p`
  color: #fff;
  opacity: 0;
  position: absolute;
  width: fit-content;
  z-index: 10;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px #ff4da6;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
`

const Sushi = styled.img`
  width: 300px;
  transition: 0.2s ease-in-out;
`

const Factory = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 90vw;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
  @media only screen and (min-width: 800px) {
    margin: 30px;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 6px solid white;
  .action {
    background: #f2f2f2;
    font-family: 'Raleway', sans-serif;
    font-weight: bold;
    font-size: 0.9rem;
    color: #999;
    flex: 1;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    .icon {
      display: grid;
      margin-right: 5px;
      font-size: 1.1rem;
    }
    &:hover,
    &:focus {
      outline: none;
      background: #fd6743;
      color: white;
    }
  }
`

const Indicator = styled.div`
  margin-bottom: 30px;
  p {
    color: #666;
    strong {
      color: #373737;
    }
  }
`

const Total = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: #ff6db6;
  margin-top: 10px;
  &.none {
    color: #999;
  }
`

const SectionTitle = styled.h3`
  color: #1a1a1a;
  text-align: center;
  font-size: 1.2rem;
  background: #f2f2f2;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid #e6e6e6;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    background: #e6e6e6;
  }
`

// TODO: improve transitions for expanding/closing
const Upgrades = styled.div`
  width: 100%;
  display: ${props => (props.expand ? 'block' : 'none')};
  /* visibility: ${props => (props.expand ? 'visible' : 'hidden')};
  opacity: ${props => (props.expand ? '1' : '0')};
  max-height: ${props => (props.expand ? '5000px' : '0')};
  transition: 0.3s ease-in-out; */
`

const Restaurants = styled.div`
  width: 100%;
  display: ${props => (props.expand ? 'block' : 'none')};
  /* visibility: ${props => (props.expand ? 'visible' : 'hidden')};
  opacity: ${props => (props.expand ? '1' : '0')};
  max-height: ${props => (props.expand ? '5000px' : '0')};
  transition: 0.3s ease-in-out; */
`
