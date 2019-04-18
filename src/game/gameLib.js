import { checkCollideWithWalls } from './gameFunc'
import { canvasSpec } from './gameConfig'


export class drawStaticImg {
  constructor({canvas, imgSrc, width, height, x=0, y=0, imgRatio=1, status=[]}) {
    this.ctx = canvas.getContext('2d')
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
    this.imgRatio = imgRatio
    this.width = width * this.imgRatio,
    this.height = height * this.imgRatio,
    this.x = x
    this.y = y
    this.speed = 2
    this.dir = true
    this.w = this.width
    this.h = this.height
    this.status = [
      {
        statusName: 'origin',
        img: this.imgSrc
      },
      ...status
    ]
  }
  moveByUser(e) {
    if(e.keyCode - 37 >= 0 && e.keyCode - 37 <=3) {
      const distanceX = [-1, 0, 1, 0][e.keyCode - 37] * this.speed
      const distanceY = [0, -1, 0, 1][e.keyCode - 37] * this.speed
      this.x += distanceX
      this.y += distanceY
    }
  }
  moveByNum(x, y) {
    const collideRes = checkCollideWithWalls(this.w, this.h, this.x, this.y, canvasSpec.width, canvasSpec.height)
    // if(checkCollideWithWalls(this.w, this.h, this.x, this.y, canvasSpec.width, canvasSpec.height)) {
    //   this.dir = false
    //   this.x -= x * this.speed
    //   this.y -= y * this.speed
    // } 
    const distX = collideRes === 'right' || collideRes ===  'left' ? -x : x
    const distY = collideRes === 'top' || collideRes ===  'bottom' ? -y : y
    this.x += distX * this.speed
    this.y += distY * this.speed
  }
  addStatus(statusName, imgSrc) {
    this.status = [
      ...this.status,
      {
        statusName: statusName,
        img: imgSrc,
      }
    ]
  }
  changeStatus(statusName) {
    const IMG = this.status.filter(s => s.statusName === statusName)
    if(IMG.length > 0) {
      this.image.src = IMG[0].img
    }
  }
  draw() {
    this.ctx.globalAlpha = 1
    this.ctx.drawImage(
      this.image, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
  }
  render() {
    this.draw()
  }
}
export class drawSpriteImg extends drawStaticImg {
  constructor({frameRate=10, imgIndex = 0, imgTick = 0, ...props}) {
    super(props)
    this.actionsFn = [this.updateFrame]
    this.frameRate = frameRate
    this.w = this.width / this.frameRate
    this.h = this.height

    this.imgIndex = imgIndex
    this.imgTick = imgTick
  }
  draw() {
    // this.ctx.clearRect(this.x, this.y, this.width / this.frameRate, this.height)
    this.ctx.drawImage(
      this.image, 
      this.imgIndex * this.width / this.frameRate / this.imgRatio, 
      0, 
      this.width / this.frameRate / this.imgRatio, 
      this.height / this.imgRatio,
      this.x, 
      this.y, 
      this.width / this.frameRate, 
      this.height)
    
  }
  updateFrame() {
    // console.log(this.imgIndex)
    if(this.imgTick < this.frameRate - 1) {
      this.imgTick += 0.25
      if(this.imgTick % 1 === 0) {
        this.imgIndex = this.imgTick
      }
    } else {
      this.imgTick = 0
    }
    
  }
  render() {
    this.updateFrame()
    this.draw()
  }
}
export class actionUpObj extends drawSpriteImg {
  constructor(props) {
    super(props)
    this.actionsFn = [...this.actionsFn, this.upAction]
    this.posYTick = 40
    this.posYIndex = 0
  }
  upAction() {
    if(this.posYIndex < this.posYTick) {
      this.y -= 1
      this.posYIndex += 1
    }
  }
  render() {
    this.upAction()
    this.updateFrame()
    this.draw()
  }
}

export class myGroupObjs {
  constructor({ x, y, groupObjs=[{ id: 0, OBJ: {} }], groupRatio }) {
    this.groupObjs = groupObjs
    this.x = x
    this.y = y
    this.groupRatio = groupRatio
    this.setObjInGroup(this.x, this.y, this.groupRatio)
    // this.id = id
  }
  setObjInGroup(x=0, y=0) {
    let w = 0, h = 0
    for (let i = 0; i < this.groupObjs.length; i++) {
      this.groupObjs[i].OBJ.x += x 
      this.groupObjs[i].OBJ.y += y 
    }
    for (let i = 0; i < this.groupObjs.length; i++) {
      if(this.groupObjs[i].OBJ.w > w) { w = this.groupObjs[i].OBJ.w }
      if(this.groupObjs[i].OBJ.h > h) { h = this.groupObjs[i].OBJ.h }
    }
    this.w = w
    this.h = h
  }
  render() {
    for (let i = 0; i < this.groupObjs.length; i++) {
      this.groupObjs[i].OBJ ? this.groupObjs[i].OBJ.render() : this.groupObjs[i].render()
    }
  }
}