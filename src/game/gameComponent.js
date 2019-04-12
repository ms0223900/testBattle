/* eslint-disable no-unused-vars */
import { getCanvasRandPos } from './gameFunc'
import { setValueOfArrObj } from '../functions'
import { initGameConfig, canvasObjAreaSpec } from './gameConfig'
import { drawStaticImg, 
  drawSpriteImg, 
  actionUpObj, 
  myGroupObjs 
} from './gameLib'
import { getCanvasComponent, destroyObj } from './gameFunc'
import { 
  bigCoin,
  coinUpdate,
  testUIbuttonImage,
  HATs,
  backgroundImage,
 } from './gameObj'


export const drawUIRect = () => {

}
export class drawUIText {
  constructor(canvas, textConfig, text='Hi', x=0, y=0) {
    this.ctx = canvas.getContext('2d')
    this.textConfig = textConfig
    this.text = text
    this.x = x
    this.y = y
  }
  render() {
    this.ctx.font = this.textConfig
    this.ctx.fillText(this.text, this.x, this.y)
  }
}
export class countUIText extends drawUIText {
  constructor(canvas, textConfig, text='Hi', x=0, y=0) {
    super(canvas, textConfig, text, x, y)
  }
  render() {
    this.ctx.font = this.textConfig
    this.ctx.fillText('X ' + this.text, this.x, this.y)
  }
}
export class actionUpGroupObjs extends myGroupObjs {
  constructor({upPosY=40, ...props}) {
    super(props)
    this.posYTick = upPosY
    this.posYIndex = 0
    // this.id = id
  }
  upAction() {
    const yUnit = -1
    if(this.posYIndex < this.posYTick) {
      this.setObjInGroup(0, yUnit)
      this.y = this.y + yUnit
      this.posYIndex += 1
    }
  }
  render() {
    this.upAction()
    for (let i = 0; i < this.groupObjs.length; i++) {
      this.groupObjs[i].OBJ ? this.groupObjs[i].OBJ.render() : this.groupObjs[i].render()
    }
  }
}
export class myLayer {
  constructor(...layerObjs) {
    this.layerObjs = layerObjs
  }
  render() {
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].OBJ.render()
    }
  }
}

export class myGame {
  constructor(canvas, myLayers={}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.UIstate = {
      moneyBagCount: 0,
    }
    this.myLayers = {
      BackLayer: myLayers.BackLayer,
      ObjLayer: myLayers.ObjLayer,
      UILayer: myLayers.UILayer,
    }
    this.myLayers.UILayer
    this.testNum = 0
    this.dir = true
  }
  init() {
    const originLS = JSON.parse(localStorage.getItem('gameConfig')) || [] 
    for (let i = 0; i < initGameConfig.length; i++) {
      const { layer, id, objProp, value } = initGameConfig[i]
      const thatConfig = originLS.filter(or => or.id === id)
      const setValue = originLS.length > 0 && thatConfig ? thatConfig[0].value : value
      this.updateStateNum(layer, id, objProp, setValue, true)
    }
  }
  updateStateNum(layer, id, property, num, init=false) {
    const originObj = this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ
    const resultVal = init ? num : originObj[property] * 1 + num
    originObj[property] = resultVal

    const originLS = JSON.parse(localStorage.getItem('gameConfig')) || []
    let storeData
    if(originLS.length > 0) {
      storeData = setValueOfArrObj(originLS, id, 'value', resultVal)
    }
    localStorage.setItem('gameConfig', JSON.stringify(storeData))
  }
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
  }
  spawnObjToLayer({layer, objFn, rand={ useRandom: true, x: 0, y: 0, }, objFnParas=[], selfDestroy=true, destroyTime=600, }) {
    const gameLayer = this.myLayers[layer]
    const newId = gameLayer.layerObjs.length + 1
    const newObj = objFn(this.canvas, rand.x, rand.y, ...objFnParas)
    const getRandXY = getCanvasRandPos(canvasObjAreaSpec, newObj, rand.x, rand.y)
    const newPosObj = rand.useRandom ? objFn(this.canvas, getRandXY.x, getRandXY.y, ...objFnParas) : newObj
    gameLayer.layerObjs = [
      ...gameLayer.layerObjs, 
      {
        id: newId,
        OBJ: newPosObj.OBJ,
      }
    ]
    if(selfDestroy) {
      setTimeout(() => {
        this.setLayerObjs(layer, destroyObj(gameLayer, newId))
      }, destroyTime)
    }
  }
  render() {
    this.ctx.clearRect(0, 0, 300, 300)
    this.myLayers.BackLayer.render()
    this.myLayers.ObjLayer.render()
    this.myLayers.UILayer.render()
    requestAnimationFrame(this.render.bind(this))
  }
}

//components
export const testButton = (canvas, x=0, y=0) => (
  getCanvasComponent(7001, canvas, testUIbuttonImage, [30, 30, x, y], drawStaticImg)
)
export const moneyBag = (canvas, x=0, y=0) => (
  getCanvasComponent(7002, canvas, coinUpdate[1], [100, 100, x, y], drawStaticImg, 0.8)
)
export const moneys = (canvas, x=0, y=0) => (
  getCanvasComponent(7003, canvas, coinUpdate[0], [30, 30, x, y], drawStaticImg)
)
export const countNum = (canvas, x=0, y=0, num=10) => ({
  id: 2001,
  OBJ: new countUIText(canvas, '18px Arial', num, x, y)
})
export const upCoin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], actionUpObj)
)
export const Coin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], drawSpriteImg, 0.4)
)
export const backTest = (canvas) => (
  getCanvasComponent(-1000, canvas, backgroundImage, [300, 200, 0, 0])
)
export const ShoppingList = (canvas, x=0, y=0) => ({
  id: 3000,
  OBJ: new drawUIText(canvas, '18px Arial', 'ShoppingList', x, y)
})

export const moneyUIwithText = (cv, x, y, num=1) => ({
  id: 2000,
  OBJ: new actionUpGroupObjs({
    upPosY: 30,
    x: x,
    y: y,
    groupObjs: [
      countNum(cv, 20, 60, num),
      Coin(cv, 0, 0)
    ],
  })
}) 

//layers
export const UILayer = (canvas, {...nums}) => (
  new myLayer(
    ShoppingList(canvas, 10, 220),
    testButton(canvas),
    moneyBag(canvas, 0, 220),
    countNum(canvas, 70, 280, nums.moneyBagCount,),
    moneys(canvas),
  )
)
export const ObjLayer = (canvas) => (
  new myLayer()
)
export const BackLayer = (canvas) => (
  new myLayer(backTest(canvas))
)

//init game
const allLayer = (cv) => ({
  BackLayer: BackLayer(cv),
  ObjLayer: ObjLayer(cv),
  UILayer: UILayer(cv),
})
export const idleGame = (canvas) => (
  new myGame(canvas, allLayer(canvas))
)


