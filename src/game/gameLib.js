
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
        // const alphaRes = getReverseResult(this.ctx.globalAlpha, 0, 0.95, this.alphaDir, 0.05)
        // this.ctx.globalAlpha = alphaRes.now
        // this.alphaDir = alphaRes.dir
      }
    } else {
      this.imgTick = 0
    }
    if(this.posYIndex < this.posYTick) {
      this.y -= 1
      this.posYIndex += 1
    }
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
  render() {
    this.updateFrame()
    this.draw()
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