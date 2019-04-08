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
      console.log('draw' + img.src)
      img.onload = () => res( ctx.drawImage(img, imgSpec[0], imgSpec[1], imgSpec[2], imgSpec[3]) )
    // }, 1000) 
    img.onerror = rej
  })
)

function drawCanvasAvatar(el, hatImgSrc='') {
  const ctx = el.getContext('2d')
  ctx.clearRect(0, 0, 300, 300)
  loadImg(ctx, AVATARimg, [50, 50, 200, 200])
    .then(() => setTimePromise(1))
    .then(() => loadImg(ctx, hatImgSrc, [70, 20, 150, 100]))
}

const spawnCoins = (originCoins = []) => {
  const randX = ~~(Math.random() * 300)
  const randY = ~~(Math.random() * 300)
  const newCoin = new drawSpriteImg()
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
    this.width = width
    this.height = height
    this.x = x
    this.y = y

    this.imgIndex = 0
    this.imgTick = 0
    this.frameRate = frameRate
  }
  updateFrame() {
    // console.log(this.imgIndex)
    if(this.imgTick < this.frameRate - 1) {
      this.imgTick += 0.25
      if(this.imgTick % 1 === 0) {
        console.log(this.ctx.globalAlpha)
        this.imgIndex = this.imgTick
        const alphaRes = getReverseResult(this.ctx.globalAlpha, 0, 0.95, this.alphaDir, 0.05)
        this.ctx.globalAlpha = alphaRes.now
        this.alphaDir = alphaRes.dir
      }
    } else {
      this.imgTick = 0
    }
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
    this.testNum = getReverseResult(this.testNum, 0, 30, this.dir).now
    this.dir = getReverseResult(this.testNum, 0, 30, this.dir).dir
    for (let i = 0; i < this.obj.length; i++) {
      this.obj[i].x = this.testNum
      this.obj[i].start()
    }
    requestAnimationFrame(this.start.bind(this))
  }
}

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hat: 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png',
      coins: [],
    };
    this.setCanvas = el => this.canvas = el
    this.myGameTest = null
  }
  componentDidMount = () => {
    // const coin1 = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, 20, 20)
    // const coin2 = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, 40, 40)
    this.myGameTest = new myGame(this.canvas, this.state.coins)
    this.myGameTest.start()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.hat !== this.state.hat) {
      drawCanvasAvatar(this.canvas, this.state.hat)
    }
    if(prevState.coins.length !== this.state.coins.length) {
      // const myGameTest = new myGame(this.canvas, this.state.coins)
      this.myGameTest.obj = this.state.coins
      // this.myGameTest.start()
    }
  }
  spawnCoins = () => {
    const { coins } = this.state
    const randX = ~~(Math.random() * 300)
    const randY = ~~(Math.random() * 300)
    const newCoin = new drawSpriteImg(this.canvas, 'images/coin-sprite-animation.png', 1000, 100, randX, randY)
    this.setState({
      coins: [...coins, newCoin],
    }) 
  }
  _handleChangeHat = (e) => {
    const imgSrc = e.target.getAttribute('src')
    this.setState({
      hat: imgSrc
    })
  }
  render() {
    return (
      <Fragment>
        <canvas ref={this.setCanvas} width={'300'} height={'300'} />
        <button onClick={this.spawnCoins}>Coin + 1</button>
        <div>
          {HATs.map(hat => (
            <img key={hat} src={hat} style={{ width: '100px' }} onClick={this._handleChangeHat} />
          ))}
        </div>
      </Fragment>
    );
  }
}