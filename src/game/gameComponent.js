/* eslint-disable no-unused-vars */
import { drawStaticImg, drawSpriteImg } from './gameLib'
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
  start() {
    this.ctx.font = this.textConfig
    this.ctx.fillText(this.text, this.x, this.y)
  }
}
export class myGroupObjs {
  constructor(x, y, width, height, ...groupObjs) {
    this.groupObjs = groupObjs
    this.x = x
    this.y = y
    // this.id = id
  }
  start() {
    for (let i = 0; i < this.groupObjs.length; i++) {
      this.groupObjs[i].OBJ ? this.groupObjs[i].OBJ.start() : this.groupObjs[i].start()
    }
  }
}
export class myLayer {
  constructor(...layerObjs) {
    this.layerObjs = layerObjs
  }
  start() {
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].OBJ.start()
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
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
  }
  start() {
    this.ctx.clearRect(0, 0, 300, 300)
    this.myLayers.BackLayer.start()
    this.myLayers.ObjLayer.start()
    this.myLayers.UILayer.start()
    requestAnimationFrame(this.start.bind(this))
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
  OBJ: new drawUIText(canvas, '18px Arial', `X ${num}`, 70, 280)
})
export const moneyUIwithText = (cv, num=0) => ({
  id: 2000,
  OBJ: new myGroupObjs(
    moneyBag(cv, 0, 200),
    countNum(cv, num)
  )
}) 
export const Coin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], drawSpriteImg)
)
export const hat = (canvas) => ({
  id: 0, 
  OBJ: new drawStaticImg(canvas, HATs[0], 100, 100, 20, 20),
})
export const backTest = (canvas) => ({
  id: -1000,
  OBJ: new drawStaticImg(canvas, backgroundImage, 300, 200, 0, 0),
})

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


