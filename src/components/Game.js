import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'

import { useInterval } from '../hooks/use-interval.hook'
import { useDocumentTitle } from '../hooks/use-document-title.hook'
import { useKeyUp } from '../hooks/use-key-up.hook'
import { usePersistedState } from '../hooks/use-persisted-state.hook'

import sushiImage from '../assets/sushi.svg'
import sushiIcon from '../assets/sushi.svg'
import coinIcon from '../assets/coin.svg'

import { RiHomeHeartLine } from 'react-icons/ri'
import { IoReloadCircleOutline } from 'react-icons/io5'
import { Item } from './Item'
import { Restaurant } from './Restaurant'
import { upgrades, restaurants } from '../data'

export const Game = () => {
  const [viewUpgrades, setViewUpgrades] = useState(true)
  const [viewRestaurants, setViewRestaurants] = useState(false)
  const [sushiPerClick, setSushiPerClick] = useState(1)
  const [sushi, setSushi] = usePersistedState(0, 'sushi')
  const [coins, setCoins] = usePersistedState(0, 'coins')
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

  // SETS SUSHI PER CLICK
  useEffect(() => {
    setSushiPerClick(3 * upgradesOwned['megaCursor'] + 1)
  }, [upgradesOwned])

  // MAKES SUSHI, CREATES A POINT GENERATION EFFECT & SUSHI TRANSFORMATION ON CLICK
  const pointsRef = useRef(null)
  const sushiRef = useRef(null)
  const makeSushi = () => {
    if (sushi !== sushiLimit) {
      if (sushi + sushiPerClick >= sushiLimit) {
        setSushi(sushiLimit)
      } else {
        setSushi(sushi + sushiPerClick)
      }
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

  // CALCULATE SUSHI LIMIT
  const calcSushiLimit = () => {
    let num = 0
    num =
      1000 * restaurantsOwned['cart'] +
      10000 * restaurantsOwned['truck'] +
      100000 * restaurantsOwned['bar'] +
      1000000 * restaurantsOwned['restaurant'] +
      10000000 * restaurantsOwned['franchise']
    return num
  }
  const sushiLimit = calcSushiLimit()

  // CALCULATE PRODUCTION RATE
  const calcProductionRate = () => {
    let num = 0
    num =
      1 * upgradesOwned['autoCursor'] +
      10 * upgradesOwned['jiro'] +
      80 * upgradesOwned['farm'] +
      150 * upgradesOwned['factory']
    return num
  }
  const productionRate = calcProductionRate()

  // BUY RESTAURANT
  // subtract coins, increase num restaurants owned & cost
  const buyRestaurant = item => {
    setCoins(coins - restaurantCost[item.id])
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

  // INCREASE SUSHI BASED ON TIME ELAPSED OR EACH SECOND BASED ON PRODUCTION RATE, UP TO SUSHI LIMIT
  // this custom hook can be used like window.setInterval as long as you follow the rules of hooks
  useInterval(() => {
    if (timeElapsed > 0) {
      let sushiProduced = productionRate * timeElapsed
      if (sushi + sushiProduced >= sushiLimit) {
        setSushi(sushiLimit)
      } else {
        setSushi(sushi + sushiProduced)
      }
      setTimeElapsed(0)
    } else if (sushi + productionRate >= sushiLimit) {
      setSushi(sushiLimit)
    } else {
      setSushi(sushi + productionRate)
    }
    // stores the number of milliseconds since midnight 1/1/1970
    localStorage.setItem('timer', new Date().getTime())
  }, 1000)

  // COMPACT DISPLAY NUM
  const compactDisplayNum = num => {
    let compactNum = num
    if (num >= 1000000000000) {
      compactNum = (num / 1000000000000).toFixed(2) + 't' // trillions
    } else if (num >= 1000000000) {
      compactNum = (num / 1000000000).toFixed(2) + 'b' // billions
    } else if (num >= 1000000) {
      compactNum = (num / 1000000).toFixed(2) + 'm' // millions
    } else if (num >= 10000) {
      compactNum = (num / 10000).toFixed(2) + 'k' // thousands
    }
    return compactNum
  }

  // SELLS SUSHI
  const sellSushi = restaurant => {
    let amount = restaurant.value * restaurantsOwned[restaurant.id]
    setSushi(sushi - amount)
    setCoins(coins + amount)
  }

  // RESET THE GAME
  const handleReset = () => {
    if (
      window.confirm('Are you sure you want to reset the game? You will lose all your progress!')
    ) {
      localStorage.clear()
      setSushiPerClick(1)
      setSushi(0)
      setCoins(0)
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
  useDocumentTitle(`Sushi Heaven - ${compactDisplayNum(sushi)} sushi`, 'Sushi Heaven')
  useKeyUp('Space', makeSushi)

  return (
    <Wrapper>
      <Header>
        <p className='title'>Sushi Heaven</p>
        <div className='overview'>
          <p className='sushi'>
            <img src={sushiImage} alt='sushi' />
            {compactDisplayNum(sushi)}
          </p>
          <p className='coins'>
            <img src={coinIcon} alt='coins' />
            {compactDisplayNum(coins)}
          </p>
        </div>
      </Header>
      <ProductionArea>
        <Instructions newGame={sushi === 0} className={sushi === sushiLimit && 'limit-reached'}>
          {sushi === sushiLimit && (
            <p>
              You've reached your stock limit. Buy restaurants to increase your limit and sell more
              sushi.
              <span className='arrow' />
            </p>
          )}
          {sushi === 0 && (
            <p>
              Click me or tap the spacebar to make sushi!
              <span className='arrow' />
            </p>
          )}
          <span className='arrow' />
        </Instructions>

        <Produce onClick={makeSushi} className={sushi === sushiLimit && 'disabled'}>
          <Points ref={pointsRef}>+{sushiPerClick}</Points>
          <Sushi src={sushiImage} ref={sushiRef} />
        </Produce>
      </ProductionArea>
      <Restaurants>
        {restaurants.map(item => {
          return (
            <Restaurant
              key={item.id}
              item={item}
              numOwned={restaurantsOwned[item.id]}
              ready={sushi >= item.value}
              sellSushi={sellSushi}
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
                <Total className={sushi === 0 && 'none'}>{compactDisplayNum(sushi)}</Total>
                <img src={sushiIcon} alt='sushi' />
              </div>
              <div className='stats'>
                <p>Stock limit: {compactDisplayNum(sushiLimit)}</p>
                <p>
                  <b>{productionRate}</b> produced per second
                </p>
                <p>
                  <b>{sushiPerClick}</b> produced per click
                </p>
              </div>
            </div>
            <div className='coins-info'>
              <div className='row'>
                <Total className={`coins ${coins === 0 && 'none'}`}>
                  {compactDisplayNum(coins)}
                </Total>
                <img src={coinIcon} alt='sushi' />
              </div>
              <div className='stats'>
                <p className='info-text'>(earn coins by fulfilling orders)</p>
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
                  type='upgrade'
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
              if (coins >= restaurantCost[item.id]) {
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
          </Menu>
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
    align-items: flex-end;
  }
`

const Header = styled.header`
  background: #373737;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: fixed;
  top: 0;
  z-index: 99;
  .title {
    font-family: 'Emilys Candy';
    font-size: 1.3rem;
    color: #fff;
    margin: 0 10px;
  }
  .overview {
    display: flex;
    align-items: center;
    .sushi {
      color: #ff4da6;
    }
    .coins {
      color: gold;
    }
    .sushi,
    .coins {
      margin: 0 10px;
      display: flex;
      align-items: center;
      font-weight: bold;
      img {
        height: 20px;
        margin-right: 5px;
      }
    }
  }
  @media only screen and (min-width: 800px) {
    display: none;
  }
`

const ProductionArea = styled.section`
  min-height: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin: 80px 0 40px 0;
  @media only screen and (min-width: 800px) {
    margin: 0;
  }
`

const Instructions = styled.div`
  visibility: ${props => (props.newGame ? 'visible' : 'hidden')};
  opacity: ${props => (props.newGame ? '1' : '0')};
  min-height: 140px;
  &.limit-reached {
    visibility: visible;
    opacity: 1;
  }
  p {
    background: rgba(255, 255, 255, 0.7);
    border: 10px solid #fff;
    border-radius: 5px;
    padding: 20px;
    width: 250px;
    text-align: center;
    font-size: 0.9rem;
    position: relative;
    transition: 0.2s ease-in-out;
    animation: ${props =>
      props.newGame ? 'bounce 1s infinite alternate cubic-bezier(0.13, 0.71, 0.56, 0.98)' : 'none'};
    .arrow {
      background: #fff;
      height: 10px;
      width: 10px;
      transform: rotate(45deg);
      position: absolute;
      left: 110px;
      bottom: -15px;
    }
    @keyframes bounce {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(-15px);
      }
    }
  }
`

const Produce = styled.div`
  margin: 30px;
  position: relative;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:focus {
    outline: none;
  }
  &.disabled {
    opacity: 0.5;
    filter: grayscale(1);
    pointer-events: none;
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

const Restaurants = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 20px;
  @media only screen and (min-width: 800px) {
    flex-direction: column;
  }
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
      background: #fe5a58;
      color: white;
    }
  }
`

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  margin: 10px;
  .sushi-info,
  .coins-info {
    padding: 10px;
    .row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      img {
        height: 25px;
        margin-left: 5px;
      }
    }
    .stats {
      font-size: 0.8rem;
      color: #666;
      b {
        color: #373737;
      }
    }
  }
`

const Total = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  color: #ff6db6;
  &.coins {
    color: gold;
  }
  &.none {
    color: #999;
  }
  .limit {
    color: #999;
    font-size: 0.8rem;
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
      color: #373737;
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
