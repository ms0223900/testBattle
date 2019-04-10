/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
import { getReverseResult } from './functions'


const coinImg = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/Retro-Coin.png'
const AVATARimg = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png'

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


class myGame {
  constructor(canvas, obj=[]) {
    this.ctx = canvas.getContext('2d')
    this.obj = obj
    this.testNum = 0
    this.dir = true
  }
  start() {
    this.ctx.clearRect(0, 0, 300, 300)
    // this.testNum = this.testNum < 30 && this.dir ? this.testNum + 1 : this.testNum - 1
    // if(this.testNum === 30) {
    //   this.dir = false
    // } else if(this.testNum === 0) {
    //   this.dir = true
    // }
    // this.testNum = getReverseResult(this.testNum, 0, 30, this.dir).now
    // this.dir = getReverseResult(this.testNum, 0, 30, this.dir).dir
    drawCanvasAvatar(this.ctx, HATs[0])
    for (let i = 0; i < this.obj.length; i++) {
      // this.obj[i].OBJ.x = this.testNum
      this.obj[i].OBJ.start()
    }
    requestAnimationFrame(this.start.bind(this))
  }
}

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hat: 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png',
      coins: [],
      gameOpen: true,
    };
    this.setCanvas = el => this.canvas = el
    this.myGameTest = null
  }
  componentDidMount = () => {
    const hat = {
      id: 0, 
      OBJ: new drawStaticImg(this.canvas, HATs[0], 100, 100, 20, 20),
    }
    // const coin2 = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, 40, 40)
    this.myGameTest = new myGame(this.canvas, [hat, ...this.state.coins])
    this.myGameTest.start()
    this.setState({
      coins: [hat, ...this.state.coins],
    })
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
  spawnCoins = () => {
    const { coins } = this.state
    const randX = ~~(Math.random() * 300)
    const randY = ~~(Math.random() * 300)
    const newCoin = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, randX, randY)
    const newId = this.myGameTest.obj.length + 1
    this.myGameTest.obj = [...this.myGameTest.obj, {
      id: newId,
      OBJ: newCoin,
    }]
    // this.setState({
    //   coins: [...coins, newCoin],
    // }) 
    
    // this.myGameTest.obj = this.state.coins
    // setTimeout(() => {
    //   this.destroyObj(newId)
    // }, 1000)
  }
  getTap = (e) => {
    const tapX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX
    const tapY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY
    const posX = tapX - this.canvas.getBoundingClientRect().left 
    const posY = tapY - this.canvas.getBoundingClientRect().top
    const tapPos = {
      x: posX, y: posY
    }
    for (let i = 1; i < this.myGameTest.obj.length; i++) {
      const thisCoin = this.myGameTest.obj[i]
      const coinSpec = {
        x: thisCoin.OBJ.x,
        y: thisCoin.OBJ.y,
        w: thisCoin.OBJ.w,
        h: thisCoin.OBJ.h,
      }
      console.log(tapPos, coinSpec)
      if(checkCollideWithPoint(tapPos, coinSpec)) {
        this.destroyObj(thisCoin.id)
      }
    }
  }
  destroyObj = (id) => {
    const originObj = this.myGameTest.obj
    this.myGameTest.obj = originObj.filter(o => o.id !== id)
  }
  _handleChangeHat = (e) => {
    const imgSrc = e.target.getAttribute('src')
    this.setState({
      hat: imgSrc
    })
  }
  _handleOpenGame = () => {
    this.setState(state => ({
      gameOpen: !state.gameOpen
    }))
  }
  render() {
    const { gameOpen } = this.state
    return (
      <div>
        <button onClick={this._handleOpenGame}>Open Game</button>
        {gameOpen ? (
          <div id={'game-canvas'} >
            <canvas ref={this.setCanvas} width={'300'} height={'300'} onTouchStart={this.getTap} onMouseDown={this.getTap} />
            <button onClick={this.spawnCoins}>Coin + 1</button>
            <div>
              {HATs.map(hat => (
                <img key={hat} src={hat} style={{ width: '100px' }} onClick={this._handleChangeHat} />
              ))}
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}