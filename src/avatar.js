/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
//game
import { canvasSpec } from './game/gameConfig'
import { 
  myUI, 
  upCoin,
  testButton,  
  moneyBag,
  moneyUIwithText,
  idleGame,
  alertUI,
  cancelIcon
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
      coinGenState: {
        lv1: 1,
        lv20: 0,
        lv100: 0,
      }
    };
    this.setCanvas = el => this.canvas = el
    this.myGameTest = null
  }
  componentDidMount = () => {
    const { coinGenarateSpeed } = this.state
    this.myGameTest = idleGame(this.canvas)
    this.myGameTest.init()
    this.myGameTest.render()
    this.obj
    const originLS = localStorage.getItem('gameConfig')
    const moneyBag = JSON.parse(originLS).filter(o => o.id === 2001)[0].value
    this.setState({
      coinGenState: {
        ...this.state.coinGenState,
        lv20: moneyBag,
      }
    })

    this.addCoin(coinGenarateSpeed)

    let iCount = 0
    setInterval(() => {
      iCount++
      if(iCount < 10) {
        this.myGameTest
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'moveByNum', parameters: [1, 1]
        })
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'changeStatus', parameters: ['another']
        })
      } else if(iCount >= 10 && iCount < 19) {
        this.myGameTest
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'changeStatus', parameters: ['origin']
        })
      } else {
        iCount = 0
      }
    }, 10)
    document.addEventListener('keydown', (e) => {
      this.myGameTest
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'moveByUser', parameters: [e]
        })
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'changeStatus', parameters: ['another']
        })
    })
    document.addEventListener('keyup', (e) => {
      this.myGameTest
        .setIdActions('ObjLayer', 'userCharacter', {
          fn: 'changeStatus', parameters: ['origin']
        })
    })
    // document.addEventListener('keyup', this.myGameTest.setIdActions('UILayer', 'move', {
    //   fn: 'changeStatus', parameters: []
    // }))
  }
  purchaseCoinUprade = (price) => {
    const { coinGenState } = this.state
    // if(window.confirm('Are you sure buying the upgrade? (cost 10000)')) {
      this.props.buy(price)
      this.setState({
        coinGenState: {
          ...coinGenState,
          lv20: coinGenState.lv20 + 1,
        }
      })
      this.myGameTest.spawnObjToLayer({
        layer: 'ObjLayer', 
        objFn: moneyBag, 
        pos: { useRandom: true, y: 120 },
        objFnParas: [20, 20],
        selfDestroy: false,
        isUI: false,
      })
      this.myGameTest.updateStateNum('UILayer', 2001, 'text', 1)
      this.myGameTest.removeObjFromLayer('UILayer', 'alertUI', 1)
    // }
  }
  spawnCoins = (selfDestroy=false, coinCount=1) => {
    const { setCoin } = this.props
    setCoin(coinCount)

    console.log(this.myGameTest.myLayers.ObjLayer)
    this.myGameTest.spawnObjToLayer({
      layer: 'ObjLayer', 
      objFn: moneyUIwithText, 
      pos: { useRandom: true },
      objFnParas: [coinCount],
      selfDestroy: true,
    })
  }
  addCoin = (speed=1) => {
    const second = 2000 / speed
    setInterval(() => {
      const { lv1, lv20, lv100 } = this.state.coinGenState
      const coinCount = lv1 * 1 + lv20 * 6 + lv100 * 50
      this.spawnCoins(true, coinCount)
    }, second)
  }


  tap = (e, canvas) => {
    const UIlayer = this.myGameTest.myLayers.UILayer
    const ObjLayer = this.myGameTest.myLayers.ObjLayer
    const times20Coin = () => getMultiAction(20, this.spawnCoins.bind(this, true, 20))
    const detectLayerId = (layerName, id) => (layerName.layerObjs.map(obj => obj = obj.id).indexOf(id) !== -1)
    let tapActions = []
    const addTapAction = (layer, id, cloneId, fn) => {
      tapActions = [...tapActions, getTap(e, canvas, layer, id, cloneId, fn)]
    }

    addTapAction(UIlayer, 'OKIcon', 0, () => {
      this.purchaseCoinUprade(10000)
    })
    addTapAction(UIlayer, 'cancelIcon', 0, () => {
      this.myGameTest.removeObjFromLayer('UILayer', 'alertUI', 1)
    })
    addTapAction(UIlayer, 'alertTest', 0, () => {})
    addTapAction(UIlayer, 'testButton',  0, () => {
      console.log(UIlayer.layerObjs)
      this.myGameTest.setIdActions('UILayer', 'testButton', {
          fn: 'changeStatus', parameters: ['another']
        })
    })
    addTapAction(UIlayer, 'moneyBag', 0, () => {
      // this.purchaseCoinUprade(10000)
      this.myGameTest.spawnObjToLayer({
        layer: 'UILayer', 
        objFn: alertUI, 
        pos: { useRandom: false, x: 100, y: 120 },
      })
    })
    addTapAction(ObjLayer, 'moneyBag', 0, this.spawnCoins.bind(this, true, 20), true)
    addTapAction(ObjLayer, 'moneyBag', 0, this.spawnCoins.bind(this, true, 20), true)

    for (let i = 0; i < tapActions.length; i++) {
      if(tapActions[i] !== false) {
        tapActions[i]()
        break
      }
    }
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
  setMouseCursor= (e) => {
    this.myGameTest.setMouseCursor(e, ['OKIcon', 'cancelIcon', 'moneyBag', 'testButton'])
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
              onKeyDown={ this._handleMove }
              onMouseMove={this.setMouseCursor}
              onTouchStart={(e) => this.tap(e, this.canvas)} 
              onMouseDown={(e) => this.tap(e, this.canvas)} />
            {/* <button onClick={this.spawnCoins}>Coin + 1</button> */}
            {/* <div>
              {HATs.map(hat => (
                <img key={hat} src={hat} style={{ width: '100px' }} onClick={this._handleChangeHat} />
              ))}
            </div> */}
          </div>
      </div>
    );
  }
}