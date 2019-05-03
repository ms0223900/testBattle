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
  checkCollideWithWalls,
  getBreakComponent,
  getLayerObjByIdCloneId
} from './gameFunc'
import * as gameComponents from './gameComponents'
// import './gameObj'


export class drawRect {
  constructor({ id, cloneId, display=true, x, y, w, h, fillStyle='transparent', strokeStyle='transparent' }) {
    // this.ctx = canvas.getContext('2d')
    this.id = id
    this.cloneId = cloneId
    this.display = display
    this.x = x
    this.y = y
    this.translateXY = {
      x: [], y: [],
    }
    this.w = w
    this.h = h
    this.fillStyle = fillStyle     
    this.strokeStyle = strokeStyle        
  }
  setAttr(attr, value) {
    this[attr] = value
  }
  draw(ctx) {
    ctx.save()
    ctx.fillStyle = this.fillStyle
    ctx.fillRect(this.x, this.y, this.w, this.h)
    ctx.fill()
    ctx.strokeStyle = this.strokeStyle
    ctx.stroke()
    ctx.restore()
  }
  render(ctx) {
    // this.ctx.restore()
    if(this.display) { this.draw(ctx) }
  }
}
export class drawUIText {
  constructor({ x=0, y=0, display=true, fillStyle, textConfig, text='Hi', lineHeight=1.2, containerWidth=100, textAlignCenter=true, textBreak=false }) {
    this.display = display
    this.textConfig = textConfig
    this.text = text
    this.textBreak = textBreak
    this.breakText = null
    this.fontSize = 18
    this.fillStyle = fillStyle
    this.x = this.textAlignCenter ? 0 : x 
    this.y = y
    this.translateXY = {
      x: [], y: [],
    }
    this.w = 0
    this.h = 0
    this.containerWidth = containerWidth
    this.lineHeight = lineHeight
    this.textAlignCenter = textAlignCenter
    this.prevProps = {
      x: this.x, y: this.y,
    }
  }
  setAttr(attr, value) {
    this[attr] = value
    this.prevProps = {
      ...this.prevProps,
      [attr]: value
    }
  }
  handleTextBreak(ctx) {
    ctx.font = this.textConfig
    const textSplit = this.text.split(' ')
    const txtSplitWidth = textSplit.map(t => t = ctx.measureText(t).width)
    console.log(txtSplitWidth)
    this.breakText = getBreakComponent(textSplit, txtSplitWidth, this.containerWidth)
    console.log(this.breakText)
  }
  handleTextAlignCenter(ctx) {
    this.x += ( this.containerWidth - ctx.measureText(this.text).width ) / 2
    this.w = ctx.measureText(this.text).width
    this.h = ctx.measureText(this.text).height
  }
  draw(ctx) {
    ctx.save()
    ctx.font = this.textConfig
    ctx.fillStyle = this.fillStyle

    if(this.textAlignCenter) { 
      this.handleTextAlignCenter(ctx)
      this.textAlignCenter = false
    }
    if(this.textBreak) {
      if(this.breakText === null) {
        this.handleTextBreak(ctx)
      }
      for (let i = 0; i < this.breakText.length; i++) {
        ctx.fillText(this.breakText[i], this.x, this.y + (this.fontSize * this.lineHeight) * i)
      }
    }
    else {
      ctx.fillText(this.text, this.x, this.y)
    }
    ctx.restore()
  }
  render(ctx) {
    if(this.display) { this.draw(ctx) }
  }
}
export class drawStaticImg {
  constructor({ id, cloneId, imgSrc, width, height, x=0, y=0, imgRatio=1, status=[], opacity=1 }) {
    this.id = id
    this.cloneId = cloneId
    this.display = true
    this.imgSrc = imgSrc
    this.image = new Image()
    this.image.src = this.imgSrc
    this.imgRatio = imgRatio
    this.opacity = opacity
    this.width = width * this.imgRatio,
    this.height = height * this.imgRatio,
    this.x = x
    this.y = y
    this.translateXY = {
      x: [], y: [],
    }
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
    this.prevProps = {
      x: 0, y: 0,
      originXY: { x: this.x, y: this.y },
      translateXY: null,
    }
  }
  setAttr(attr=false, value='') {
    this[attr] = value
    // this.checkGroupTranslate()
    this.prevProps = {
      ...this.prevProps,
      [attr]: value
    }
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
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.drawImage(
      this.image, 
      this.x, 
      this.y, 
      this.width, 
      this.height
    )
    ctx.restore()
  }
  render(ctx) {
    if(this.display) { this.draw(ctx) }
  }
}

export class drawSpriteImg extends drawStaticImg {
  constructor({ frameRate=10, imgIndex = 0, imgTick = 0, ...props }) {
    super(props)
    this.actionsFn = [this.updateFrame]
    this.frameRate = frameRate
    this.w = this.width / this.frameRate
    this.h = this.height
    
    this.imgIndex = imgIndex
    this.imgTick = imgTick
  }
  draw(ctx) {
    // this.ctx.clearRect(this.x, this.y, this.width / this.frameRate, this.height)
    ctx.drawImage(
      this.image, 
      this.imgIndex * this.width / this.frameRate / this.imgRatio, 
      0, 
      this.width / this.frameRate / this.imgRatio, 
      this.height / this.imgRatio,
      this.x + this.groupXY.x, 
      this.y + this.groupXY.y, 
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
  render(ctx) {
    this.updateFrame()
    if(this.display) { this.draw(ctx) }
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
  render(ctx) {
    this.upAction()
    this.updateFrame()
    this.draw(ctx)
  }
}

export class myGroupObjs {
  constructor({ id, cloneId=0, groupDisplay=true, x, y, groupObjs=[{ id: 0, OBJ: {} }], groupRatio, clip={ isClip: false, clipX: 100, clipY: 100, clipW: 200, clipH: 300 } }) {
    this.id = id
    this.cloneId = cloneId
    this.groupDisplay = groupDisplay
    this.x = x
    this.y = y
    this.translateXY = {
      x: [this.x], y: [this.y]
    }
    this.groupXY = {
      x: 0, y: 0, setToGroupXY: false,
    }
    this.groupRatio = groupRatio
    this.clip = clip
    this.groupObjs = groupObjs
    // this.reset = false
    this.prevProps = {
      groupObjs: this.groupObjs,
      x: null, 
      y: null,
    }
    this.setObjInGroup()
    // this.id = id
  }
  setAttr(attr=false, value=false) {
    // const { translateXY } = this.prevProps
    if(attr) { 
      this[attr] = value
      // console.log('this.' + attr + ':' , this[attr])
    } else {
      // if(translateXY.x !== this.translateXY.x || translateXY.y !== this.translateXY.y) {
      //   this.setObjInGroup()
      // }
      
      if(this.prevProps.x !== this.x || this.prevProps.y !== this.y) {
        console.log(this.x, this.prevProps.x,';', this.y, this.prevProps.y)
        this.setObjInGroup()
        // console.log('setAttr prevProps.x')
      }
      if(this.prevProps.groupObjs.length < this.groupObjs.length) {
        this.setObjInGroup('single', this.groupObjs.length - 1)
        // console.log('setAttr groupObjs.length')
      }
    }
  }
  setObjInGroup(singleOrAll='all', singleIndex=0) {
    let w = 0, h = 0
    const setGroupAttr = (i) => {
      this.groupObjs[i].OBJ.setAttr('x', this.groupObjs[i].OBJ.x + this.x - this.prevProps.x)
      this.groupObjs[i].OBJ.setAttr('y', this.groupObjs[i].OBJ.y + this.y - this.prevProps.y)
    }

    if(singleOrAll === 'all') {
      for (let i = 0; i < this.groupObjs.length; i++) {
        // console.log(this.groupObjs[i].id, this.groupObjs[i])
        setGroupAttr(i)
      }
    } else if(singleOrAll === 'single') {
      setGroupAttr(singleIndex)
    }
    
    for (let i = 0; i < this.groupObjs.length; i++) {
      if(this.groupObjs[i].OBJ.w > w) { w = this.groupObjs[i].OBJ.w }
      if(this.groupObjs[i].OBJ.h > h) { h = this.groupObjs[i].OBJ.h }
    }
    this.w = w
    this.h = h
    // console.log(this.id, this.x, this.y, this.w, this.h)
    this.prevProps = {
      ...this.prevProps,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      groupObjs: this.groupObjs,
      translateXY: {
        x: this.translateXY.x, y: this.translateXY.y,
      }
    }
  }
  draw(ctx) {
    // if(!this.display) { console.log('groupObj', this.display, this.groupObjs) } 
    for (let i = 0; i < this.groupObjs.length; i++) {
      if(this.groupObjs[i].OBJ.hasOwnProperty('groupDisplay')) {
        this.groupObjs[i].OBJ.groupDisplay = this.groupDisplay
      } else {
        this.groupObjs[i].OBJ.display = this.groupDisplay
      }
      this.groupObjs[i].OBJ ? this.groupObjs[i].OBJ.render(ctx) : this.groupObjs[i].render(ctx)
        // this.groupObjs[i].OBJ.display = true
    }
    this.setAttr()
  }
  render(ctx) {
    ctx.save()
    this.draw(ctx) 
    ctx.restore()
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
    this.frame = { prev: 0, now: 0, fps: 0 }
  }
  setPropToGame(attr, value) {
    this[attr] = value
    this.prevProps = {
      ...this.prevProps,
      [attr]: value,
    }
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
    setInterval(() => {
      this.frame.fps = (this.frame.now - this.frame.prev) * 2
      this.frame.prev = this.frame.now
      // console.log(this.frame)
    }, 500)
  }
  setInitStates(stateObj={}) {
    this.stateTree = stateObj
  }
  updateGameStates(stateObj={}) {
    this.stateTree = {
      ...this.stateTree,
      stateObj,
    }
  }
  getAttr(layerName='', id='', cloneId=0, attr, allClone=false) {
    const targetArr = getLayerObjByIdCloneId(this.myLayers[layerName].layerObjs, id, cloneId, allClone)
    console.log(targetArr[0].OBJ[attr])
    if(targetArr) {
      return targetArr[0].OBJ[attr]
    } else {
      throw 'cannot get attr from your function'
    }
  }
  setAttr(layerName='', id='', cloneId=0, attr='', value, allClone=false) {
    // console.log(this.myLayers[layerName].layerObjs)
    const targetArr = getLayerObjByIdCloneId(this.myLayers[layerName].layerObjs, id, cloneId, allClone)
    for (let i = 0; i < targetArr.length; i++) {
      targetArr[i]['OBJ'].setAttr(attr, value)
    }
    console.log('gameSetAttr: ', value, targetArr)
  }
  checkObjExist(layer='', container='', id='', cloneId=0) {
    if(container.length > 0) {
      return this.myLayers[layer].layerObjs.filter(obj => obj.id === container)[0].OBJ.groupObjs.filter(obj => obj.id === id && cloneId === cloneId).length > 0
    } else {
      return getLayerObjByIdCloneId(this.myLayers[layer].layerObjs, id, cloneId, true).length > 0
    }
  }
  updateStateNum(layer, id, property, num, init=false) {
    const originObj = 
      this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0] && 
      this.myLayers[layer].layerObjs.filter(obj => obj.id === id)[0].OBJ
    const resultVal = init ? num : originObj[property] * 1 + num

    if(originObj && originObj[property]) { originObj[property] = resultVal }
    

    const originLS = JSON.parse(localStorage.getItem('gameConfig'))
    const storeData = setValueOfArrObj(originLS, id, 'value', resultVal)
    localStorage.setItem('gameConfig', JSON.stringify(storeData))
  }
  setLayerObjs(layer, newObjs) {
    this.myLayers[layer].layerObjs = newObjs
  }
  spawnObjToLayer({layer, container='', objFn, pos={ useRandom: true, x: 0, y: 0, }, objFnParas={}, selfDestroy=false, destroyTime=600, isInit=false, isUI=true, i=0, }) {
    const originLS = JSON.parse(localStorage.getItem('gameSpawnObjConfig'))
    const gameLayer = this.myLayers[layer]
    const newObj = objFn({ x: pos.x, y: pos.y, ...objFnParas })
    const getRandXY = getCanvasRandPos(canvasObjAreaSpec, newObj, pos.x, pos.y)
    const newPosObj = pos.useRandom ? objFn(getRandXY.x, getRandXY.y, ...objFnParas) : newObj
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
    //
    const originGroupObjs = 
      gameLayer.layerObjs.filter(obj => obj.id === container)[0].OBJ.groupObjs
    const newAddedObj = {
      id: newPosObj.id,
      cloneId: newCloneId,
      OBJ: newPosObj.OBJ,
    }
    this.setAttr(layer, container, 0, 'groupObjs', [
      ...originGroupObjs,
      newAddedObj,
    ])
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
    this.frame.now += 1
    // setInterval(() => {
    //   console.log(this.frame)
    // }, 1000)
    // console.log(this.frame)
    this.ctx.clearRect(0, 0, canvasSpec.width, canvasSpec.height)
  

    const layerNames = ['BackLayer', 'ObjLayer', 'UILayer'] 
    for (let i = 0; i < layerNames.length; i++) {
      this.myLayers[layerNames[i]].render(this.ctx)
    }
    this.ctx.font = '16px Arial'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText('fps:' + this.frame.fps, 10, 60)

    requestAnimationFrame(this.render.bind(this))
  }
}
export class Container {
  constructor({ containerStates={}, containerGroup=[] }) {
    this.containerStates = containerStates || {}
    this.id = containerGroup.id || ''
    this.cloneId = 0
    this.OBJ = containerGroup.OBJ || {}
    this.subscribedComponents = []
  }
  setState(state, value) {
    this.containerStates = {
      ...this.containerStates,
      [state]: value,
    }
  }
  setAttr(id, cloneId, attr, value) {
    console.log(this.containerStates)
    const target = getLayerObjByIdCloneId(this.OBJ.groupObjs, id, cloneId, false)
    if(target && target.length > 0) {
      target[0].OBJ.setAttr(attr, value)
    }
  }
  updateComponents() {
    console.log('this.containerStates: ', this.containerStates)
  }
  getContainerAttr(containerStateToFilter, attrId) {
    return containerStateToFilter.filter(con => con.id === attrId)[0]
  }
  updateCount(id, propName, countPropName, countFn) {
    const origin = this.containerStates
    const originCount = origin[propName].filter(it => it.id === id)[0][countPropName]
    const newCount = countFn(originCount)
    this.setContainerState({
      [propName]: [
        ...origin[propName].filter(it => it.id !== id),
        { id, [countPropName]: newCount }
      ]
    })
  }
  setContainerState = (newState) => {
    this.containerStates = {
      ...this.containerStates,
      ...newState,
    }
    this.updateComponents()
  }
  removeObjInContainer(id='', cloneId=0) {
    this.OBJ.groupObjs = [
      ...this.OBJ.groupObjs.filter(gro => !(gro.id === id && gro.cloneId === cloneId)),
    ]
  }
}