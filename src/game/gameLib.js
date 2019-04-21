import { setValueOfArrObj } from '../functions'
import { 
  canvasSpec,
  initGameConfig, 
  canvasObjAreaSpec,
 } from './gameConfig'
 import { 
  getCanvasRandPos, 
  destroyObj, 
  getTap,
  checkCollideWithWalls
} from './gameFunc'
import * as gameComponents from './gameComponent'


export class drawRect {
  constructor({ canvas, x, y, w, h, fillStyle='transparent', strokeStyle='transparent' }) {
    this.ctx = canvas.getContext('2d')
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.fillStyle = fillStyle     
    this.strokeStyle = strokeStyle        
  }
  draw() {
    // this.ctx.save()
    this.ctx.fillStyle = this.fillStyle
    this.ctx.fillRect(this.x, this.y, this.w, this.h)
    this.ctx.strokeStyle = this.strokeStyle
    this.ctx.stroke()
    this.ctx.restore()
  }
  render() {
    this.ctx.save()
    // const region = new Path2D()
    this.ctx.rect(100, 100, 100, 200)
    this.ctx.fillStyle = 'transparent'
    this.ctx.fill()
    this.ctx.clip()
    // this.ctx.restore()
    this.draw()
  }
}

export class drawStaticImg {
  constructor({ canvas, imgSrc, width, height, x=0, y=0, imgRatio=1, status=[], opacity=1 }) {
    this.ctx = canvas.getContext('2d')
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
    this.imgRatio = imgRatio
    this.opacity = opacity
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
    this.ctx.save()
    this.ctx.globalAlpha = this.opacity
    this.ctx.drawImage(
      this.image, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
    this.ctx.restore()
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

export class clipObj {
  constructor( canvas, clipW=100, clipH=300 ) {
    this.ctx = canvas.getContext('2d')
    this.clipW = clipW
    this.clipH = clipH
  }
  render() {
    
    const region = new Path2D()
    region.rect = (50, 50, this.clipW, this.clipH)
    this.ctx.clip(region)
  }
}
// export class clipObj = ({ clipW=100, clipH=300 }) => 


export class myGame {
  constructor(canvas, myLayers={}) {
    this.canvas = canvas
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
    this.setIdActions = this.setIdActions.bind(this)
  }
  init() {
    'use strict'
    const originLS = JSON.parse(localStorage.getItem('gameConfig')) || [] 
    const orginGameSpawnObj = JSON.parse(localStorage.getItem('gameSpawnObjConfig')) || [] 
    if(originLS.length === 0) {
      localStorage.setItem('gameConfig', JSON.stringify(initGameConfig))
    }
    if(!localStorage.getItem('gameSpawnObjConfig')) {
      localStorage.setItem('gameSpawnObjConfig', JSON.stringify([]))
    }
    for (let i = 0; i < initGameConfig.length; i++) {
      const { layer, id, objProp, value } = initGameConfig[i]
      const thatConfig = originLS.filter(or => or.id === id)
      const setValue = originLS.length > 0 && thatConfig ? thatConfig[0].value : value
      this.updateStateNum(layer, id, objProp, setValue, true)
    }
    for (let i = 0; i < orginGameSpawnObj.length; i++) {
      this.spawnObjToLayer({
        layer: 'ObjLayer',
        objFn: gameComponents[orginGameSpawnObj[i].objFn],
        pos: { useRandom: false, 
          x: orginGameSpawnObj[i].pos.x, 
          y: orginGameSpawnObj[i].pos.y, },
        isInit: true,
        i: i,
        isUI: false,
      })
      
    }
  }
  updateStateNum(layer, id, property, num, init=false) {
    const originObj = this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ
    const resultVal = init ? num : originObj[property] * 1 + num
    originObj[property] = resultVal

    const originLS = JSON.parse(localStorage.getItem('gameConfig'))
    const storeData = setValueOfArrObj(originLS, id, 'value', resultVal)
    localStorage.setItem('gameConfig', JSON.stringify(storeData))
  }
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
  }
  spawnObjToLayer({layer, objFn, pos={ useRandom: true, x: 0, y: 0, }, objFnParas=[], selfDestroy=false, destroyTime=600, isInit=false, isUI=true, i=0, }) {
    const originLS = JSON.parse(localStorage.getItem('gameSpawnObjConfig'))
    const gameLayer = this.myLayers[layer]
    const newObj = objFn(this.canvas, pos.x, pos.y, ...objFnParas)
    const getRandXY = getCanvasRandPos(canvasObjAreaSpec, newObj, pos.x, pos.y)
    const newPosObj = pos.useRandom ? objFn(this.canvas, getRandXY.x, getRandXY.y, ...objFnParas) : newObj
    const newCloneId = originLS.filter(or => or.id === newPosObj.id).length > 0 ? 
      (originLS.filter(or => or.id === newPosObj.id)[i].cloneId) : 
      (gameLayer.layerObjs.filter(lo => lo.id === newPosObj.id).length + 1 || 1)
    // console.log('newCloneId: ', newCloneId)
    const gameSpawnObjConfigSetting = {
      id: newPosObj.id,
      cloneId: newCloneId,
      pos: { x: getRandXY.x, y: getRandXY.y },
      objFn: objFn.name,
    }
    const newGameSpawnObjConfig = [...originLS, gameSpawnObjConfigSetting]

    gameLayer.layerObjs = [
      ...gameLayer.layerObjs, 
      {
        id: newPosObj.id,
        cloneId: newCloneId,
        OBJ: newPosObj.OBJ,
      }
    ]
    // console.log(gameLayer.layerObjs)
    if(selfDestroy) {
      setTimeout(() => {
        this.setLayerObjs(layer, destroyObj(gameLayer, newPosObj.id, newCloneId))
      }, destroyTime)
    } else if(!selfDestroy && !isInit && !isUI) {
      localStorage.setItem('gameSpawnObjConfig', JSON.stringify(newGameSpawnObjConfig))
    }
  }
  removeObjFromLayer(layer='', objId='', cloneId=0) {
    const gameLayer = this.myLayers[layer]
    this.setLayerObjs(layer, destroyObj(gameLayer, objId, cloneId))
  }
  setMouseCursor(e, IDs=[], ) {
    if(this.canvas.style.cursor !== 'default') {
      this.canvas.style.cursor = 'default'
    }
    const setPointer = () => this.canvas.style.cursor = 'pointer'
    const layerNames = ['BackLayer', 'ObjLayer', 'UILayer'] 
    const layers = this.myLayers
    for (let i = 0; i < layerNames.length; i++) {
      for (let j = 0; j < IDs.length; j++) {
        const tapAct = getTap(e, this.canvas, layers[layerNames[i]], IDs[j], 0, setPointer, true)
        if(tapAct !== false) {
          tapAct()
          // break
        }
      } 
    }
  }
  setIdActions(layer, id, { fn: actionFn, parameters: [...paras] }) {
    this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ[actionFn](...paras)
    return this
  }
  render() {
    this.ctx.clearRect(0, 0, canvasSpec.width, canvasSpec.height)
    const layerNames = ['BackLayer', 'ObjLayer', 'UILayer'] 
    for (let i = 0; i < layerNames.length; i++) {
      this.myLayers[layerNames[i]].render()
    }
    requestAnimationFrame(this.render.bind(this))
  }
}