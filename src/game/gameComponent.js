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

export class myLayer {
  constructor(canvas, ...layerObjs) {
    this.ctx = canvas.getContext('2d')
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
    this.myLayers = {
      BackLayer: myLayers.BackLayer,
      ObjLayer: myLayers.ObjLayer,
      UILayer: myLayers.UILayer,
    }
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
export const Coin = (canvas, x=0, y=0) => (
  getCanvasComponent(1, canvas, bigCoin, [1000, 100, x, y], drawSpriteImg)
)
export const hat = (canvas) => ({
  id: 0, 
  OBJ: new drawStaticImg(canvas, HATs[0], 100, 100, 20, 20),
})
export const backTest = (canvas) => ({
  id: -1000,
  OBJ: new drawStaticImg(canvas, backgroundImage, 300, 300, 0, 0),
})

//layers
export const UILayer = (canvas) => (
  new myLayer(canvas, testButton(canvas), moneyBag(canvas), moneys(canvas))
)
export const ObjLayer = (canvas) => (
  new myLayer(canvas)
)
export const BackLayer = (canvas) => (
  new myLayer(canvas, backTest(canvas))
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


