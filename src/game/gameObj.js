export const coinImg = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/Retro-Coin.png'
export const bigCoin = 'images/coin-sprite-animation.png'
export const coinUpdate = ['https://static.wixstatic.com/media/7fce08_d7547c63bbb945e69d6bc5c167b39193.gif', 'https://www.pixelmarket.net/media/catalog/product/cache/1/image/650x650/a94eaa0e6015e0566d23f2c54dba56d0/9/a/9ab2aa59d388489c2860019b7338e4b81.PNG']
export const AVATARimg = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png'
export const backgroundImage = 'https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-03.jpg'
export const testBack = 'https://img.freepik.com/free-vector/abstract-splashed-watercolor-textured-background_53876-8717.jpg?size=626&ext=jpg'



export const testUIbuttonImage = 'https://cdn4.iconfinder.com/data/icons/game-ui-pack-02/500/play-512.png'
export const HATs = ['http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png', 'http://www.pngpix.com/wp-content/uploads/2016/11/PNGPIX-COM-Hat-PNG-Transparent-Image--500x248.png', 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Cowboy-Hat-PNG-Transparent-Image-250x187.png']

export const alertTest = 'https://docs.scandit.com/flow/mobile-api/assets/ui_alert_ios.png'
export const ICON = {
  OKIcon: 'https://cdn1.iconfinder.com/data/icons/color-bold-style/21/34-512.png',
  cancelIcon: 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png',
}
export const ICON2 = 'https://www.san-x.co.jp/charapri/images/kabe/rirakkuma/119_1080_1920.png'
export const character = 'https://images-na.ssl-images-amazon.com/images/I/51Wpjypba1L._SX425_.jpg'
export const testMapIcon = [
  'https://freeiconshop.com/wp-content/uploads/edd/bulb-curvy-flat.png',
  'https://freeiconshop.com/wp-content/uploads/edd/html-flat.png',
]

/* eslint-disable no-unused-vars */
import { 
  canvasSpec,
  canvasObjAreaSpec,
  styleConfig, 
} from './gameConfig'
import { 
  drawRect,
  drawUIText,
  drawStaticImg, 
  drawSpriteImg, 
  actionUpObj, 
  myGroupObjs,
  clipObj,
  myGame, 
} from './gameLib'
import { 
  getCanvasComponent, 
  getCanvasGroup, 
  getBreakComponent,
} from './gameFunc'
// import { 
//   bigCoin,
//   coinUpdate,
//   testUIbuttonImage,
//   backgroundImage,
//   alertTest,
//   ICON,
//   ICON2,
//   character,
//   testMapIcon,
//   testBack
//  } from './gameObj'
import { 
  UITabs_A,
  UITabs_B,
  UITabs_C,
  UIDisplay_A,
} from './gameUIComponents'
const { fontStyle } = styleConfig


export class countUIText extends drawUIText {
  constructor(props) {
    super(props)
  }
  render(ctx) {
    ctx.font = this.textConfig
    ctx.fillText('X ' + this.text, this.x, this.y)
  }
}
export class actionUpGroupObjs extends myGroupObjs {
  constructor({ upPosY=40, ...props }) {
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
  render(ctx) {
    this.upAction()
    for (let i = 0; i < this.groupObjs.length; i++) {
      this.groupObjs[i].OBJ ? this.groupObjs[i].OBJ.render(ctx) : this.groupObjs[i].render(ctx)
    }
  }
}
export class myLayer {
  constructor(layerObjs=[]) {
    this.layerObjs = layerObjs
  }
  render(ctx) {
    // console.log(this.layerObjs)
    for (let i = 0; i < this.layerObjs.length; i++) {
      this.layerObjs[i].OBJ.render(ctx)
    }
  }
}



//components
export const testButton = (x=0, y=0) => (
  getCanvasComponent('testButton', testUIbuttonImage, [30, 30, x, y], drawStaticImg, 1, [
    {
      statusName: 'another',
      img: ICON2,
    }
  ])
)
// testButton.OBJ.addState('another', ICON2)

export const userCharacter = (x=0, y=0) => (
  getCanvasComponent('userCharacter', character, [120, 120, x, y], drawStaticImg, 0.8, [
    {
      statusName: 'another',
      img: ICON2,
    }
  ])
)
export const moneyBag = (x=0, y=0) => (
  getCanvasComponent('moneyBag', coinUpdate[1], [100, 100, x, y], drawStaticImg, 0.8)
)
export const moneys = (x=0, y=0) => (
  getCanvasComponent(7003, coinUpdate[0], [30, 30, x, y], drawStaticImg)
)
export const countNum = (x=0, y=0, num=10) => ({
  id: 2001,
  OBJ: new countUIText({
    x, y,
    textConfig: fontStyle.sSize,
    text: num
  })
})
export const upCoin = (x=0, y=0) => (
  getCanvasComponent('upCoin', bigCoin, [1000, 100, x, y], actionUpObj)
)
export const Coin = (x=0, y=0) => (
  getCanvasComponent(1, bigCoin, [1000, 100, x, y], drawSpriteImg, 0.4)
)
export const backTest = getCanvasComponent(-1000, backgroundImage, [canvasObjAreaSpec.width, canvasObjAreaSpec.height, 0, 0])

export const alert = (x=0, y=0) => (
  getCanvasComponent('alertTest', alertTest, [200, 100, x, y], drawStaticImg)
)
export const OKIcon = (x=0, y=0) => (
  getCanvasComponent('OKIcon', ICON.OKIcon, [20, 20, x, y], drawStaticImg)
)
export const cancelIcon = (x=0, y=0) => (
  getCanvasComponent('cancelIcon', ICON.cancelIcon, [20, 20, x, y], drawStaticImg)
)
export const alertBack = (x, y) => ({
  id: 'alertBack',
  cloneId: 0,
  OBJ: new drawRect({
    x: x,
    y: y,
    w: canvasSpec.width,
    h: canvasSpec.height,
    fillStyle: 'rgba(0, 0, 0, 0.2)'
  })
})
export const testPicBack = (x, y) => (
  getCanvasComponent('testPicBack', testBack, [300, 300, x, y], drawStaticImg)
)

export const ShoppingList = (x=0, y=0) => ({
  id: 3000,
  OBJ: new drawUIText({
    x, y,
    textConfig: fontStyle.mSize,
    text: 'Shop ping List lab', 
  })
})
export const alertPurchase = (x=0, y=0) => ({
  id: 'alertPurchase',
  OBJ: new drawUIText({
    x, y,
    textConfig: fontStyle.mSize, 
    text: 'Are you sure upgrading? (cost 10000)'
  })
})

export const moneyUIwithText = (x=0, y=0, num=1) => ({
  id: 'moneyUIwithText',
  OBJ: new actionUpGroupObjs({
    upPosY: 30,
    x: x,
    y: y,
    groupObjs: [
      countNum(20, 60, num),
      Coin(0, 0)
    ],
  })
}) 

// export const alertClip = (cv, x, y) => ({
//   id: 'alertClip', cloneId: 0,
//   OBJ: new clipObj(cv, x, y),
// })
export const alertUI = (x, y) => getCanvasGroup({
  id: 'alertUI', 
  spec: [x, y], 
  drawGroupClass: myGroupObjs, 
  groupObjs: [ 
    // alertBack(0, 0),
    
    testPicBack(0, 0),
    // alert(100, 100),
    cancelIcon(200, 160), 
    // alertPurchase(130, 140),
    OKIcon(120, 160),
    UITabs_A,
    UITabs_B,
    UITabs_C,
    UIDisplay_A,
  ]
})
// getCanvasComponent('moneyBag', canvas, coinUpdate[1], [100, 100, x, y], drawStaticImg, 0.8)
export const testMAP = [
  { id: 'bulbCurvyFlat', imgSrc: testMapIcon[0], x: 20 },
  { id: 'htmlFlat', imgSrc: testMapIcon[1], x: 80 },
  { id: 'bulbCurvyFlat2', imgSrc: testMapIcon[0], x: 120 },
  { id: 'bulbCurvyFlat3', imgSrc: testMapIcon[0], x: 160 },
]
export const testGroupMap = (x, y) => getCanvasGroup({
  id: 'testGroupMap', 
  spec: [x, y], 
  groupObjs: testMAP.map(te => getCanvasComponent(te.id, te.imgSrc, [100, 100, te.x, y], drawStaticImg, 1, [], 0.7) ) 
})
//layers
export const UILayer = new myLayer([
  ShoppingList(10, 220),
  testButton(),
  moneyBag(0, 220),
  countNum(70, 280),
  testGroupMap(100, 100),
])
export const ObjLayer = new myLayer([ userCharacter(120, 120) ])
export const BackLayer = new myLayer([ backTest ])
  


//init game
const allLayer = {
  BackLayer: BackLayer,
  ObjLayer: ObjLayer,
  UILayer: UILayer,
}
export const idleGame = (ctx) => (
  new myGame(ctx, allLayer)
)

// const a = 0
