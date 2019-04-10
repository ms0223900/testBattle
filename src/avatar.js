/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
import { getReverseResult } from './functions'


const coinImg = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/Retro-Coin.png'
const AVATARimg = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png'
const backgroundImage = 'https://1.bp.blogspot.com/-xxPNhLnqRw4/UsZ5378PrgI/AAAAAAAACRE/DmjUGk1p8Lk/s1600/Outdoor+Anime+Landscape+%5BScenery+-+Background%5D+101.png'

const testUIbuttonImage = 'https://cdn4.iconfinder.com/data/icons/game-ui-pack-02/500/play-512.png'
const HATs = ['http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png', 'http://www.pngpix.com/wp-content/uploads/2016/11/PNGPIX-COM-Hat-PNG-Transparent-Image--500x248.png', 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Cowboy-Hat-PNG-Transparent-Image-250x187.png']

const setTimePromise = (sec) => (
  new Promise((res, rej) => setTimeout(res, sec))
)
const loadImg = (ctx, imgSrc, imgSpec) => (
  new Promise((res, rej) => {
    const img = new Image()
    img.src = imgSrc
    // setTimeout(() => {
      // console.log('draw' + img.src)
      img.onload = () => res( ctx.drawImage(img, imgSpec[0], imgSpec[1], imgSpec[2], imgSpec[3]) )
    // }, 1000) 
    img.onerror = rej
  })
)

function drawCanvasAvatar(ctx, hatImgSrc='') {
  loadImg(ctx, AVATARimg, [50, 50, 200, 200])
    .then(() => setTimePromise(0))
    .then(() => loadImg(ctx, hatImgSrc, [70, 20, 150, 100]))
}

const spawnCoins = (originCoins = []) => {
  const randX = ~~(Math.random() * 300)
  const randY = ~~(Math.random() * 300)
  const newCoin = new drawSpriteImg()
}

export const checkCollideWithPoint = (point={x: 0, y: 0}, collideObj={x: 0, y: 0, w: 0, h: 0}) => {
  if(point.x < collideObj.x + collideObj.w && point.x > collideObj.x && 
    point.y < collideObj.y + collideObj.h && point.y > collideObj.y) {
      return true
  } return false
}
export const checkAllCollide = (tapPos={x: 0, y: 0}, allCollideObjs=[], callback=() => {}) => {
  for (let i = 0; i < allCollideObjs.length; i++) {
    const thisCollide = allCollideObjs[i]
    const collideSpec = {
      x: thisCollide.OBJ.x,
      y: thisCollide.OBJ.y,
      w: thisCollide.OBJ.w,
      h: thisCollide.OBJ.h,
    }
    if(checkCollideWithPoint(tapPos, collideSpec)) {
      // this.destroyObj(thisCoin.id)
      console.log(allCollideObjs[i].id)
      callback()
    }
  }
}

export class drawSpriteImg {
  constructor(canvas, imgSrc, width, height, x=0, y=0, frameRate=10) {
    this.ctx = canvas.getContext('2d')
    this.ctx.globalAlpha = 0
    this.alphaDir = true
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
    // this.image.onload = this.start()
    this.frameRate = frameRate
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.w = this.width / this.frameRate
    this.h = this.height

    this.imgIndex = 0
    this.imgTick = 0
    this.posYTick = 40
    this.posYIndex = 0
    
  }
  updateFrame() {
    // console.log(this.imgIndex)
    if(this.imgTick < this.frameRate - 1) {
      this.imgTick += 0.25
      if(this.imgTick % 1 === 0) {
        // console.log(this.ctx.globalAlpha)
        this.imgIndex = this.imgTick
        const alphaRes = getReverseResult(this.ctx.globalAlpha, 0, 0.95, this.alphaDir, 0.05)
        this.ctx.globalAlpha = alphaRes.now
        this.alphaDir = alphaRes.dir
      }
    } else {
      this.imgTick = 0
    }
    if(this.posYIndex < this.posYTick) {
      this.y -= 1
      this.posYIndex += 1
    }
  }
  getFrameWidth() {
    return this.width / this.frameRate
  }
  render() {
    // this.ctx.clearRect(this.x, this.y, this.width / this.frameRate, this.height)
    this.ctx.drawImage(
      this.image, 
      this.imgIndex * this.width / this.frameRate, 
      0, 
      this.width / this.frameRate, 
      this.height,
      this.x, 
      this.y, 
      this.width / this.frameRate, 
      this.height)
    
  }
  start() {
    this.updateFrame()
    this.render()
  }
}
export class drawStaticImg {
  constructor(canvas, imgSrc, width, height, x=0, y=0) {
    this.ctx = canvas.getContext('2d')
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.w = this.width
    this.h = this.height
  }
  render() {
    // this.ctx.clearRect(this.x, this.y, this.width / this.frameRate, this.height)
    
    this.ctx.globalAlpha = 1
    this.ctx.drawImage(
      this.image, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
  }
  start() {
    this.render()
  }
}

const testButton = (canvas) => ({
  id: 7001,
  OBJ: new drawStaticImg(canvas, testUIbuttonImage, 30, 30, 20, 20)
})

class myUI {
  constructor(canvas, ...UIs) {
    this.ctx = canvas.getContext('2d')
    this.UIs = UIs
  }
  start() {
    this.ctx.rect(20, 20, 120, 120)
    this.ctx.stroke()
    for (let i = 0; i < this.UIs.length; i++) {
      this.UIs[i].OBJ.start()
    }
  }
}

class myGame {
  constructor(canvas, back=[], obj=[], UI=[]) {
    this.ctx = canvas.getContext('2d')
    this.back = back
    this.obj = obj
    this.UI = UI
    this.testNum = 0
    this.dir = true
  }
  start() {
    this.ctx.clearRect(0, 0, 300, 300)
    for (let i = 0; i < this.back.length; i++) {
      this.back[i].OBJ.start()
    }
    for (let i = 0; i < this.obj.length; i++) {
      this.obj[i].OBJ.start()
    }
    for (let i = 0; i < this.UI.length; i++) {
      this.UI[i].OBJ.start()
    }
    requestAnimationFrame(this.start.bind(this))
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hat: 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png',
      coins: [],
      gameOpen: true,
      coinGenarateSpeed: 1,
    };
    this.setCanvas = el => this.canvas = el
    this.myGameTest = null
    this.setHat = (hatSrc) => new drawStaticImg(this.canvas, hatSrc, 100, 100, 20, 20)
  }
  componentDidMount = () => {
    const { coinGenarateSpeed } = this.state
    const hat = {
      id: 0, 
      OBJ: new drawStaticImg(this.canvas, HATs[0], 100, 100, 20, 20),
    }
    const backTest = {
      id: -1000,
      OBJ: new drawStaticImg(this.canvas, backgroundImage, 300, 300, 0, 0),
    }
    const UItest = {
      id: 7000,
      OBJ: new myUI(this.canvas, testButton(this.canvas))
    }
    // const coin2 = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, 40, 40)
    this.myGameTest = new myGame(this.canvas, [backTest], [hat, ...this.state.coins], [UItest])
    this.myGameTest.start()
    this.setState({
      coins: [hat, ...this.state.coins],
    })
    this.addCoin(coinGenarateSpeed)
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.hat !== this.state.hat) {
      drawCanvasAvatar(this.canvas, this.state.hat)
    }
    if(prevState.coins.length !== this.state.coins.length) {
      // const myGameTest = new myGame(this.canvas, this.state.coins)
      // this.myGameTest.obj = this.state.coins
      // this.myGameTest.start()
    }
    // setInterval(() => this.spawnCoins(), 600)
  }
  spawnCoins = (selfDestroy=false) => {
    const { setCoin } = this.props
    
    const randX = ~~(Math.random() * (300 - 100)) 
    const randY = ~~(Math.random() * (300 - 100))
    const newCoin = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, randX, randY)
    const newId = this.myGameTest.obj.length + 1
    this.myGameTest.obj = [...this.myGameTest.obj, {
      id: newId,
      OBJ: newCoin,
    }]
    setCoin(1)
    if(selfDestroy) {
      setTimeout(() => {
        this.destroyObj(newId)
      }, 600)
    }
  }
  addCoin = (speed=1) => {
    const second = 2000/speed
    setInterval(() => {
      this.spawnCoins(true)
    }, second)
  }
  getTap = (e) => {
    const tapX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX
    const tapY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY
    const posX = tapX - this.canvas.getBoundingClientRect().left 
    const posY = tapY - this.canvas.getBoundingClientRect().top
    const tapPos = {
      x: posX, y: posY
    }
    checkAllCollide(tapPos, this.myGameTest.obj)
    checkAllCollide(tapPos, this.myGameTest.UI[0].OBJ.UIs, this.spawnCoins.bind(this, true))
  }
  destroyObj = (id) => {
    const originObj = this.myGameTest.obj
    this.myGameTest.obj = originObj.filter(o => o.id !== id)
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
    const { coin=0 } = this.props
    return (
      <div>
        <button onClick={this._handleOpenGame}>Open Game</button>
          <div id={'game-canvas'} style={{ display: gameOpen ? 'block' : 'none' }} >
            <div id={'coin-container'}>
              <img className={'coin-img'} src={coinImg} />
              <span> {' X ' + coin} </span>
            </div>
            <div>

            </div>
            <canvas ref={this.setCanvas} width={'300'} height={'300'} onTouchStart={this.getTap} onMouseDown={this.getTap} />
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