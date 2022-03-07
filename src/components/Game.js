import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import { useInterval } from '../hooks/use-interval.hook'
import { useDocumentTitle } from '../hooks/use-document-title.hook'
import { useKeyUp } from '../hooks/use-key-up.hook'
import { usePersistedState } from '../hooks/use-persisted-state.hook'

import sushiImage from '../assets/sushi.png'
import sushiIcon from '../assets/sushi.svg'
import moneyIcon from '../assets/money.svg'

import { RiHomeHeartLine } from 'react-icons/ri'
import { IoReloadCircleOutline } from 'react-icons/io5'
import { Item } from './Item'
import { Restaurant } from './Restaurant'
import { upgrades, restaurants } from '../data'

export const Game = () => {
  const [newGame, setNewGame] = useState(false)
  const [viewUpgrades, setViewUpgrades] = useState(true)
  const [viewRestaurants, setViewRestaurants] = useState(false)
  const [sushiPerClick, setSushiPerClick] = useState(1)
  const [sushi, setSushi] = usePersistedState(0, 'sushi')
  const [money, setMoney] = usePersistedState(0, 'money')
  const [timeElapsed, setTimeElapsed] = useState(0)

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
      cart: 1,
      truck: 0,
      bar: 0,
      restaurant: 0,
      franchise: 0,
    },
    'restaurants-owned'
  )
  const [restaurantCost, setRestaurantCost] = usePersistedState(
    {
      cart: 5000,
      truck: 10000,
      bar: 25000,
      restaurant: 75000,
      franchise: 2250000,
    },
    'restaurant-cost'
  )

  // SETS NEW GAME BASED ON SUSHI STOCK
  useEffect(() => {
    if (sushi > 0) {
      setNewGame(false)
    } else setNewGame(true)
  }, [sushi])

  // SETS SUSHI PER CLICK
  useEffect(() => {
    setSushiPerClick(3 * upgradesOwned['megaCursor'] + 1)
  }, [upgradesOwned])

  // CREATES A POINT GENERATION EFFECT & SUSHI TRANSFORMATION ON CLICK
  const pointsRef = useRef(null)
  const sushiRef = useRef(null)
  const makeSushi = () => {
    setSushi(sushi + sushiPerClick)
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

  // BUY UPGRADE
  // subtract sushi, increase sushi per click, increase num upgrades owned & cost
  const buyUpgrade = item => {
    if (item.id === 'megaCursor') {
      setSushi(sushi - upgradeCost[item.id])
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
      setSushi(sushi - upgradeCost[item.id])
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

  // CALCULATE PRODUCTION RATE
  const calcProductionRate = upgradesOwned => {
    let num = 0
    num =
      1 * upgradesOwned['autoCursor'] +
      10 * upgradesOwned['jiro'] +
      80 * upgradesOwned['farm'] +
      150 * upgradesOwned['factory']
    return num
  }
  const productionRate = calcProductionRate(upgradesOwned)

  // BUY RESTAURANT
  // subtract money, increase num restaurants owned & cost
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

  // SET TIME ELAPSED WHILE GAME CLOSED
  useEffect(() => {
    let timer = localStorage.getItem('timer')
    let timeElapsed = new Date().getTime() - timer
    timeElapsed = Math.floor(timeElapsed / 1000)
    setTimeElapsed(timeElapsed)
  }, [])

  // INCREASE SUSHI BASED ON TIME ELAPSED OR EACH SECOND BASED ON PRODUCTION RATE
  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    if (timeElapsed > 0) {
      let sushiProduced = productionRate * timeElapsed
      setSushi(sushi + sushiProduced)
      setTimeElapsed(0)
    } else setSushi(sushi + productionRate)
    // stores the number of milliseconds since midnight 1/1/1970
    localStorage.setItem('timer', new Date().getTime())
  }, 1000)

  // COMPACT DISPLAY NUM
  let displayNum = sushi
  const compactDisplayNum = num => {
    if (num >= 1000000000000) {
      displayNum = (sushi / 1000000000000).toFixed(2) + 't' // trillions
    } else if (num >= 1000000000) {
      displayNum = (sushi / 1000000000).toFixed(2) + 'b' // billions
    } else if (num >= 1000000) {
      displayNum = (sushi / 1000000).toFixed(2) + 'm' // millions
    } else if (num >= 1000) {
      displayNum = (sushi / 1000).toFixed(2) + 'k' // thousands
    }
  }
  compactDisplayNum(sushi)

  const handleSell = restaurant => {
    let amount = restaurant.value * restaurantsOwned[restaurant.id]
    setSushi(sushi - amount)
    setMoney(money + amount)
  }

  // RESET THE GAME
  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset the game? You will lose all your progress!')
    ) {
      localStorage.clear()
      setSushiPerClick(1)
      setSushi(0)
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
        cart: 5000,
        truck: 10000,
        bar: 25000,
        restaurant: 75000,
        franchise: 2250000,
      })
      setRestaurantsOwned({
        cart: 1,
        truck: 0,
        bar: 0,
        restaurant: 0,
        franchise: 0,
      })
    }
  }

  // CALLING CUSTOM HOOKS
  useDocumentTitle(`Sushi Heaven - ${displayNum} sushi`, 'Sushi Heaven')
  useKeyUp('Space', makeSushi)

  return (
    <Wrapper>
      <ProductionArea>
        <Instructions newGame={newGame}>
          Click me or tap the spacebar to make sushi!
          <span className='arrow' />
        </Instructions>
        <Produce onClick={makeSushi}>
          <Points ref={pointsRef}>+{sushiPerClick}</Points>
          <Sushi src={sushiImage} ref={sushiRef} />
        </Produce>
      </ProductionArea>
      <Restaurants>
        {restaurants.map(item => {
          return (
            <Restaurant
              item={item}
              numOwned={restaurantsOwned[item.id]}
              ready={sushi >= item.value}
              handleSell={handleSell}
            />
          )
        })}
      </Restaurants>
      <Console>
        <div className='inner'>
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
          <Overview>
            <div className='sushi-info'>
              <div className='row'>
                <img src={sushiIcon} alt='sushi' />
                <Total className={sushi === 0 && 'none'}>{displayNum}</Total>
              </div>
              <div className='stats'>
                <p>
                  <strong>{productionRate}</strong> produced per second
                </p>
                <p>
                  <strong>{sushiPerClick}</strong> produced per click
                </p>
              </div>
            </div>
            <div className='income-info'>
              <div className='row'>
                <img src={moneyIcon} alt='sushi' />
                <Total className={`money ${money === 0 && 'none'}`}>{money}</Total>
              </div>
              <div className='stats'>
                <p className='info-text'>(earn money by fulfilling orders)</p>
              </div>
            </div>
          </Overview>
          <MenuTabs>
            <h3
              className={`upgrades ${viewUpgrades && 'active'}`}
              onClick={() => {
                setViewRestaurants(false)
                setViewUpgrades(true)
              }}>
              Upgrades
            </h3>
            <h3
              className={`restaurants ${viewRestaurants && 'active'}`}
              onClick={() => {
                setViewUpgrades(false)
                setViewRestaurants(true)
              }}>
              Restaurants
            </h3>
          </MenuTabs>
          <Menu expand={viewUpgrades}>
            {upgrades.map((item, i) => {
              let available = false
              if (sushi >= upgradeCost[item.id]) {
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
                  purchase={() => buyUpgrade(item)}
                />
              )
            })}
          </Menu>
          <Menu expand={viewRestaurants}>
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
                  purchase={() => buyRestaurant(item)}
                />
              )
            })}
          </Menu>{' '}
        </div>
      </Console>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  @media only screen and (min-width: 800px) {
    flex-direction: row;
  }
`

const ProductionArea = styled.section`
  width: 100%;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Restaurants = styled.section`
  /* TODO: improve mobile/tablet layout */
  background: pink;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 20px;
  border: 5px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
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

const Produce = styled.div`
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

const Console = styled.div`
  height: 100vh;
  display: flex;
  .inner {
    background: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    width: 90vw;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 20px;
    border-radius: 10px;
    padding: 10px;
    @media only screen and (min-width: 800px) {
      margin: 30px;
    }
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
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
    &:hover:not(:active) {
      background: #fd6743;
      color: white;
    }
  }
`

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  .sushi-info,
  .income-info {
    padding: 10px;
    .row {
      display: flex;
      align-items: center;
      img {
        height: 25px;
        margin-right: 5px;
      }
    }
    p {
      color: #666;
      strong {
        color: #373737;
      }
      &.info-text {
        font-size: 0.8rem;
        color: #999;
      }
    }
  }
`

const Total = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: #ff6db6;
  &.money {
    color: gold;
  }
  &.none {
    color: #999;
  }
`

const MenuTabs = styled.div`
  display: flex;
  margin-top: 10px;
  h3 {
    background: #e6e6e6;
    color: #666;
    text-align: center;
    font-size: 1.2rem;
    flex: 1;
    padding: 10px;
    border-bottom: 1px solid #e6e6e6;
    border-radius: 5px 5px 0 0;
    transition: 0.2s ease-in-out;
    cursor: pointer;
    &.upgrades {
      margin-right: 5px;
    }
    &.restaurants {
      margin-left: 5px;
    }
    &.active {
      background: #f7f7f7;
      color: #1a1a1a;
      border-bottom: 1px solid transparent;
    }
  }
`

const Menu = styled.div`
  display: ${props => (props.expand ? 'flex' : 'none')};
  background: #f7f7f7;
  width: 100%;
  overflow: auto;
  border-radius: 0 0 5px 5px;
  flex: 1;
  padding: 10px;
  flex-direction: column;
`
