/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
//game
import { canvasSpec, 
  myUI, 
  Coin,
  idleGame,
 } from './game/gameComponent'
import { 
  getMultiAction,
  spawnRandomPosObj,
  destroyObj, 
  getTap,
} from './game/gameFunc'
import { 
  coinImg, 
  backgroundImage, 
  testUIbuttonImage, 
  HATs 
} from './game/gameObj'

export default class Game extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      coins: [],
      gameOpen: true,
      coinGenarateSpeed: 1,
    };
    this.setCanvas = el => this.canvas = el
    this.myGameTest = null
  }
  componentDidMount = () => {
    const { coinGenarateSpeed } = this.state
    this.myGameTest = idleGame(this.canvas)
    this.myGameTest.render()
    this.obj

    this.addCoin(coinGenarateSpeed)
  }
  spawnCoins = (selfDestroy=false, coinCount=1) => {
    const gameObjLayer = this.myGameTest.myLayers.ObjLayer
    const newRandObj = spawnRandomPosObj(this.canvas, gameObjLayer, Coin)
    this.myGameTest.setLayerObjs('ObjLayer', newRandObj.newObjs)
    const { setCoin } = this.props
    setCoin(coinCount)

    if(selfDestroy) {
      setTimeout(() => {
        this.myGameTest.setLayerObjs('ObjLayer', destroyObj(gameObjLayer, newRandObj.newId))
      }, 600)
    }
  }
  addCoin = (speed=1) => {
    const second = 2000 / speed
    setInterval(() => {
      this.spawnCoins(true)
    }, second)
  }
  tap = (e, canvas) => {
    const layer = this.myGameTest.myLayers.UILayer
    const times20Coin = () => getMultiAction(20, this.spawnCoins.bind(this, true, 20))
    getTap(e, canvas, layer, 7001, this.spawnCoins.bind(this, true))
    getTap(e, canvas, layer, 7002, () => {
      times20Coin()
      this.myGameTest.updateStateNum('UILayer', 2000, 'text', 1)
    })
  }
  _handleChangeHat = (e) => {
    const imgSrc = e.target.getAttribute('src')
    this.myGameTest.obj[0].OBJ = this.setHat(imgSrc)
  }
  _handleOpenGame = () => {
    this.setState(state => ({
      gameOpen: !state.gameOpen
    }))
  }
  render() {
    const { gameOpen } = this.state
    // const { coin=0 } = this.props
    console.log('render canvas')
    return (
      <div>
        <button onClick={this._handleOpenGame}>Open Game</button>
          <div id={'game-canvas'} style={{ display: gameOpen ? 'block' : 'none' }} >
            <div id={'coin-container'}>
              <img className={'coin-img'} src={coinImg} />
              {/* <span> {' X ' + coin} </span> */}
            </div>
            <div>

            </div>
            <canvas 
              ref={this.setCanvas} 
              width={ canvasSpec.width } 
              height={ canvasSpec.height } 
              onTouchStart={(e) => this.tap(e, this.canvas)} 
              onMouseDown={(e) => this.tap(e, this.canvas)} />
            <button onClick={this.spawnCoins}>Coin + 1</button>
            <div>
              {HATs.map(hat => (
                <img key={hat} src={hat} style={{ width: '100px' }} onClick={this._handleChangeHat} />
              ))}
            </div>
          </div>
      </div>
    );
  }
}