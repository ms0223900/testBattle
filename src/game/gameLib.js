
export class drawStaticImg {
  constructor({canvas, imgSrc, width, height, x=0, y=0}) {
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
      this.imgIndex * this.width / this.frameRate, 
      0, 
      this.width / this.frameRate, 
      this.height,
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
    // for (const fn of this.actionsFn) {
    //   fn()
    // }
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