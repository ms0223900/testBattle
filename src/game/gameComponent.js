/* eslint-disable no-unused-vars */
import { 
  canvasSpec,
  canvasObjAreaSpec,
  styleConfig, 
} from './gameConfig'
import { 
  drawRect,
  drawStaticImg, 
  drawSpriteImg, 
  actionUpObj, 
  myGroupObjs,
  myGame, 
} from './gameLib'
import { 
  getCanvasComponent, 
  getCanvasGroup, 
  getBreakComponent,
} from './gameFunc'
import { 
  bigCoin,
  coinUpdate,
  testUIbuttonImage,
  backgroundImage,
  alertTest,
  ICON,
  ICON2,
  character,
  testMapIcon,
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
    this.ctx.fillStyle = '#000'
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

    // console.log(this.layerObjs)
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].OBJ.render()
    }
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
export const alertBack = (cv, x, y) => ({
  id: 'alertBack',
  cloneId: 0,
  OBJ: new drawRect({
    canvas: cv,
    x: x,
    y: y,
    w: canvasSpec.width,
    h: canvasSpec.height,
    fillStyle: 'rgba(0, 0, 0, 0.2)'
  })
})


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
  alertBack(cv, 0, 0),
  alert(cv, 100, 100),
  alertPurchase(cv, 30, 40),
  OKIcon(cv, 120, 160),
  cancelIcon(cv, 200, 160),
])
// getCanvasComponent('moneyBag', canvas, coinUpdate[1], [100, 100, x, y], drawStaticImg, 0.8)
const testMAP = [
  { id: 'bulbCurvyFlat', imgSrc: testMapIcon[0], x: 20 },
  { id: 'htmlFlat', imgSrc: testMapIcon[1], x: 80 },
]
export const testGroupMap = (cv, x, y) => getCanvasGroup('testGroupMap', [x, y], myGroupObjs, testMAP.map(te => getCanvasComponent(te.id, cv, te.imgSrc, [100, 100, te.x, y], drawStaticImg, 0.5) ) )

//layers
export const UILayer = (cv, {...nums}) => (
  new myLayer(
    ShoppingList(cv, 10, 220),
    testButton(cv),
    moneyBag(cv, 0, 220),
    countNum(cv, 70, 280, nums.moneyBagCount,),
    testGroupMap(cv, 100, 100),
    // userCharacter(cv, 120, 120)
  )
)
export const ObjLayer = (cv) => (
  new myLayer(
    userCharacter(cv, 120, 120)
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
