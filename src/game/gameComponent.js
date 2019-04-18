/* eslint-disable no-unused-vars */
import { setValueOfArrObj } from '../functions'
import { initGameConfig, 
  canvasSpec, 
  canvasObjAreaSpec,
  styleConfig, 
} from './gameConfig'
import { drawStaticImg, 
  drawSpriteImg, 
  actionUpObj, 
  myGroupObjs 
} from './gameLib'
import { 
  getCanvasRandPos, 
  getCanvasComponent, 
  destroyObj, 
  getCanvasGroup, 
  getTap,
  getBreakComponent,
} from './gameFunc'
import { 
  bigCoin,
  coinUpdate,
  testUIbuttonImage,
  HATs,
  backgroundImage,
  alertTest,
  ICON,
  ICON2,
  character,
 } from './gameObj'
const { fontStyle } = styleConfig





export class drawUIText {
  constructor({canvas, x=0, y=0, textConfig, text='Hi', lineHeight=1.2, containerWidth=100}) {
    this.ctx = canvas.getContext('2d')
    this.textConfig = textConfig
    this.text = text
    this.breakText = null
    this.fontSize = 18
    this.x = x
    this.y = y
    this.containerWidth = containerWidth
    this.lineHeight = lineHeight
  }
  handleTextBreak() {
    this.ctx.font = this.textConfig
    const textSplit = this.text.split(' ')
    const txtSplitWidth = textSplit.map(t => t = this.ctx.measureText(t).width)
    console.log(txtSplitWidth)
    this.breakText = getBreakComponent(textSplit, txtSplitWidth, this.containerWidth)
    console.log(this.breakText)
  }
  render() {
    if(this.breakText === null) {
      this.handleTextBreak()
    }
    this.ctx.font = this.textConfig
    for (let i = 0; i < this.breakText.length; i++) {
      this.ctx.fillText(this.breakText[i], this.x, this.y + (this.fontSize * this.lineHeight) * i)
    }
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
    this.setIdActions = this.setIdActions.bind(this)
  }
  init() {
    'use strict'
    const originLS = JSON.parse(localStorage.getItem('gameConfig')) || [] 
    const orginGameSpawnObj = JSON.parse(localStorage.getItem('gameSpawnObjConfig')) || [] 
    if(originLS.length === 0) {
      localStorage.setItem('gameConfig', JSON.stringify(initGameConfig))
    }
    if(!localStorage.getItem('gameSpawnObjConfig')) {
      localStorage.setItem('gameSpawnObjConfig', JSON.stringify([]))
    }
    for (let i = 0; i < initGameConfig.length; i++) {
      const { layer, id, objProp, value } = initGameConfig[i]
      const thatConfig = originLS.filter(or => or.id === id)
      const setValue = originLS.length > 0 && thatConfig ? thatConfig[0].value : value
      this.updateStateNum(layer, id, objProp, setValue, true)
    }
    for (let i = 0; i < orginGameSpawnObj.length; i++) {
      this.spawnObjToLayer({
        layer: 'ObjLayer',
        objFn: eval(orginGameSpawnObj[i].objFn),
        pos: { useRandom: false, 
          x: orginGameSpawnObj[i].pos.x, 
          y: orginGameSpawnObj[i].pos.y, },
        isInit: true,
        isUI: false,
      })
      
    }
  }
  updateStateNum(layer, id, property, num, init=false) {
    const originObj = this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ
    const resultVal = init ? num : originObj[property] * 1 + num
    originObj[property] = resultVal

    const originLS = JSON.parse(localStorage.getItem('gameConfig'))
    const storeData = setValueOfArrObj(originLS, id, 'value', resultVal)
    localStorage.setItem('gameConfig', JSON.stringify(storeData))
  }
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
  }
  spawnObjToLayer({layer, objFn, pos={ useRandom: true, x: 0, y: 0, }, objFnParas=[], selfDestroy=false, destroyTime=600, isInit=false, isUI=true, }) {
    const originLS = JSON.parse(localStorage.getItem('gameSpawnObjConfig'))
    const gameLayer = this.myLayers[layer]
    const newObj = objFn(this.canvas, pos.x, pos.y, ...objFnParas)
    const getRandXY = getCanvasRandPos(canvasObjAreaSpec, newObj, pos.x, pos.y)
    const newPosObj = pos.useRandom ? objFn(this.canvas, getRandXY.x, getRandXY.y, ...objFnParas) : newObj
    const newCloneId = originLS.filter(or => or.id === newPosObj.id).length > 0 ? 
      (originLS.filter(or => or.id === newPosObj.id).length + 1) : 
      (gameLayer.layerObjs.filter(lo => lo.id === newPosObj.id).length + 1 || 1)
    const gameSpawnObjConfigSetting = {
      id: newPosObj.id,
      cloneId: newCloneId,
      pos: { x: getRandXY.x, y: getRandXY.y },
      objFn: objFn.name,
    }
    const newGameSpawnObjConfig = [...originLS, gameSpawnObjConfigSetting]

    gameLayer.layerObjs = [
      ...gameLayer.layerObjs, 
      {
        id: newPosObj.id,
        cloneId: newCloneId,
        OBJ: newPosObj.OBJ,
      }
    ]
    // console.log(gameLayer.layerObjs)
    if(selfDestroy) {
      setTimeout(() => {
        this.setLayerObjs(layer, destroyObj(gameLayer, newPosObj.id, newCloneId))
      }, destroyTime)
    } else if(!selfDestroy && !isInit && !isUI) {
      localStorage.setItem('gameSpawnObjConfig', JSON.stringify(newGameSpawnObjConfig))
    }
  }
  removeObjFromLayer(layer='', objId='', cloneId=0) {
    const gameLayer = this.myLayers[layer]
    this.setLayerObjs(layer, destroyObj(gameLayer, objId, cloneId))
  }
  setMouseCursor(e, IDs=[], ) {
    if(this.canvas.style.cursor !== 'default') {
      this.canvas.style.cursor = 'default'
    }
    const setPointer = () => this.canvas.style.cursor = 'pointer'
    const layerNames = ['BackLayer', 'ObjLayer', 'UILayer'] 
    const layers = this.myLayers
    for (let i = 0; i < layerNames.length; i++) {
      for (let j = 0; j < IDs.length; j++) {
        const tapAct = getTap(e, this.canvas, layers[layerNames[i]], IDs[j], 0, setPointer, true)
        if(tapAct !== false) {
          tapAct()
        }
      } 
    }
  }
  setIdActions(layer, id, { fn: actionFn, parameters: [...paras] }) {
    this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ[actionFn](...paras)
    return this
  }
  render() {
    this.ctx.clearRect(0, 0, canvasSpec.width, canvasSpec.height)
    const layerNames = ['BackLayer', 'ObjLayer', 'UILayer'] 
    for (let i = 0; i < layerNames.length; i++) {
      this.myLayers[layerNames[i]].render()
    }
    requestAnimationFrame(this.render.bind(this))
  }
}

//components
export const testButton = (canvas, x=0, y=0) => (
  getCanvasComponent('testButton', canvas, testUIbuttonImage, [30, 30, x, y], drawStaticImg, 1, [
    {
      statusName: 'another',
      img: ICON2,
    }
  ])
)
// testButton.OBJ.addState('another', ICON2)

export const userCharacter = (canvas, x=0, y=0) => (
  getCanvasComponent('userCharacter', canvas, character, [120, 120, x, y], drawStaticImg, 0.8, [
    {
      statusName: 'another',
      img: ICON2,
    }
  ])
)
export const moneyBag = (canvas, x=0, y=0) => (
  getCanvasComponent('moneyBag', canvas, coinUpdate[1], [100, 100, x, y], drawStaticImg, 0.8)
)
export const moneys = (canvas, x=0, y=0) => (
  getCanvasComponent(7003, canvas, coinUpdate[0], [30, 30, x, y], drawStaticImg)
)
export const countNum = (canvas, x=0, y=0, num=10) => ({
  id: 2001,
  OBJ: new countUIText({
    canvas, x, y,
    textConfig: fontStyle.sSize,
    text: num
  })
})
export const upCoin = (canvas, x=0, y=0) => (
  getCanvasComponent('upCoin', canvas, bigCoin, [1000, 100, x, y], actionUpObj)
)
export const Coin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], drawSpriteImg, 0.4)
)
export const backTest = (canvas) => (
  getCanvasComponent(-1000, canvas, backgroundImage, [canvasObjAreaSpec.width, canvasObjAreaSpec.height, 0, 0])
)
export const alert = (cv, x=0, y=0) => (
  getCanvasComponent('alertTest', cv, alertTest, [200, 100, x, y], drawStaticImg)
)
export const OKIcon = (cv, x=0, y=0) => (
  getCanvasComponent('OKIcon', cv, ICON.OKIcon, [20, 20, x, y], drawStaticImg)
)
export const cancelIcon = (cv, x=0, y=0) => (
  getCanvasComponent('cancelIcon', cv, ICON.cancelIcon, [20, 20, x, y], drawStaticImg)
)

export const ShoppingList = (canvas, x=0, y=0) => ({
  id: 3000,
  OBJ: new drawUIText({
    canvas, x, y,
    textConfig: fontStyle.mSize,
    text: 'Shop ping List lab', 
  })
})
export const alertPurchase = (canvas, x=0, y=0) => ({
  id: 'alertPurchase',
  OBJ: new drawUIText({
    canvas, x, y,
    textConfig: fontStyle.mSize, 
    text: 'Are you sure upgrading? (cost 10000)'
  })
})

export const moneyUIwithText = (cv, x, y, num=1) => ({
  id: 'moneyUIwithText',
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

export const alertUI = (cv, x, y) => getCanvasGroup('alertUI', [x, y], myGroupObjs, [
  alert(cv, 0, 0),
  alertPurchase(cv, 30, 40),
  OKIcon(cv, 20, 60),
  cancelIcon(cv, 60, 60),
])

//layers
export const UILayer = (cv, {...nums}) => (
  new myLayer(
    ShoppingList(cv, 10, 220),
    testButton(cv),
    moneyBag(cv, 0, 220),
    countNum(cv, 70, 280, nums.moneyBagCount,),
    // userCharacter(cv, 120, 120)
  )
)
export const ObjLayer = (cv) => (
  new myLayer(
    userCharacter(cv, 180, 180)
  )
)
export const BackLayer = (cv) => (
  new myLayer(backTest(cv))
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

// const a = 0
