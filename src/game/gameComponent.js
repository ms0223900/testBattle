/* eslint-disable no-unused-vars */
import { drawStaticImg, drawSpriteImg, actionUpObj } from './gameLib'
import { getCanvasComponent } from './gameFunc'
import { 
  bigCoin,
  coinUpdate,
  testUIbuttonImage,
  HATs,
  backgroundImage,
 } from './gameObj'

export const canvasSpec = {
  width: 300,
  height: 300,
}

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
export class myGroupObjs {
  constructor(x, y, width, height, ...groupObjs) {
    this.groupObjs = groupObjs
    this.x = x
    this.y = y
    // this.id = id
  }
  render() {
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
  updateStateNum(layer, id, property, num) {
    const originObj = this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ
    console.log(originObj[property])
    originObj[property] = originObj[property] * 1 + num
  }
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
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
  getCanvasComponent(7002, canvas, coinUpdate[1], [100, 100, x, y], drawStaticImg)
)
export const moneys = (canvas, x=0, y=0) => (
  getCanvasComponent(7003, canvas, coinUpdate[0], [30, 30, x, y], drawStaticImg)
)
export const countNum = (canvas, num=10) => ({
  id: 2000,
  OBJ: new countUIText(canvas, '18px Arial', num, 70, 280)
})
export const moneyUIwithText = (cv, num=0) => ({
  id: 2000,
  OBJ: new myGroupObjs(
    moneyBag(cv, 0, 200),
    countNum(cv, num)
  )
}) 
export const Coin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], actionUpObj)
)
export const backTest = (canvas) => (
  getCanvasComponent(-1000, canvas, backgroundImage, [300, 200, 0, 0])
)

//layers
export const UILayer = (canvas, {...nums}) => (
  new myLayer(
    testButton(canvas),
    moneyBag(canvas, 0, 200),
    countNum(canvas, nums.moneyBagCount),
    // moneyUIwithText(canvas, nums.moneyBagCount),  
    moneys(canvas)
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


