/* eslint-disable no-unused-vars */
import React from 'react'
import { firebaseConfig } from '../config'
//game
import { 
  canvasSpec,
  tabActions,
 } from './game/gameConfig'
import { 
  moneyBag,
  moneyUIwithText,
  alertUI,
 } from './game/gameComponents'
import { idleGame, } from './game/Layers'
import { 
  getTap,
} from './game/gameFunc'
import { tapActionHolder } from './game/tapActionsHolder'
import firebase from 'firebase'


firebase.initializeApp(firebaseConfig)

export const database = firebase.database()
// const admin = firebase.admin

// const gameData = {
//   userName: 'penguin',
//   level: 20,
// }
// const gameData2 = {
//   userName: 'penguin',
//   level: 30,
// }
// const gameDataHandler = (newKey) => ({
//   userName: 'penguin' + newKey,
//   level: newKey * 10,
// })
// database.ref('member/0').set(gameData)
// database.ref('member')
//   .on('value', snapshot => console.log( snapshot.val().length ))
// const writeNew = () => {
//   let count = 0
//   database.ref('member').on('value', snapshot => { 
//     count ++
//     if(count === 1) {
//       const newKey = snapshot.val().length 
//       // const originData = snapshot.val()
//       const newData = gameDataHandler(newKey)
//       database.ref('/member/' + newKey).set(newData)
//       window.alert('add successful~')
//       return
//     }
//   })
//   // const update = newData
// } 


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
      // if(iCount < 10) {
      //   this.myGameTest
      //     .setIdActions('ObjLayer', 'userCharacter', {
      //       fn: 'moveByNum', parameters: [1, 1]
      //     })
      //     .setIdActions('ObjLayer', 'userCharacter', {
      //       fn: 'changeStatus', parameters: ['another']
      //     })
      // } else if(iCount >= 10 && iCount < 19) {
      //   this.myGameTest
      //   .setIdActions('ObjLayer', 'userCharacter', {
      //     fn: 'changeStatus', parameters: ['origin']
      //   })
      // } else {
      //   iCount = 0
      // }
    }, 100)
    // document.addEventListener('keydown', (e) => {
    //   this.myGameTest
    //     .setIdActions('ObjLayer', 'userCharacter', {
    //       fn: 'moveByUser', parameters: [e]
    //     })
    //     .setIdActions('ObjLayer', 'userCharacter', {
    //       fn: 'changeStatus', parameters: ['another']
    //     })
    // })
    // document.addEventListener('keyup', (e) => {
    //   this.myGameTest
    //     .setIdActions('ObjLayer', 'userCharacter', {
    //       fn: 'changeStatus', parameters: ['origin']
    //     })
    // })
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

    // console.log(this.myGameTest.myLayers.ObjLayer)
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
    // setInterval(() => {
    //   const { lv1, lv20, lv100 } = this.state.coinGenState
    //   const coinCount = lv1 * 1 + lv20 * 6 + lv100 * 50
    //   this.spawnCoins(true, coinCount)
    // }, second)
  }


  tap = (e, canvas) => {
    let tapActions = []
    const addTapAction = (layer, id, cloneId, fn, allClone=false) => {
      tapActions = [...tapActions, getTap(e, canvas, layer, id, cloneId, fn, allClone)]
    }
    
    tapActionHolder(this.myGameTest).map(ac => addTapAction(ac.layer, ac.id, ac.cloneId, ac.fn, ac.allClone))

    for (let i = 0; i < tapActions.length; i++) {
      if(tapActions[i] !== false) {
        tapActions[i]()
        break
      }
    }
  }

  
  _handleOpenGame = () => {
    this.setState(state => ({
      gameOpen: !state.gameOpen
    }))
  }
  setMouseCursor= (e) => {
    // this.myGameTest.setMouseCursor(e, ['bulbCurvyFlat', 'OKIcon', 'cancelIcon', 'moneyBag', 'testButton', ])
  }
  render() {
    const { gameOpen } = this.state
    // const { coin=0 } = this.props
    console.log('render canvas')
    return (
      <div>
        <button onClick={this._handleOpenGame}>Open Game</button>
        {/* <button onClick={ writeNew }>Add Firebase data</button> */}
          <div id={'game-canvas'} style={{ display: gameOpen ? 'block' : 'none' }} >
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