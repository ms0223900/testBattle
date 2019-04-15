import { canvasObjAreaSpec } from './gameConfig'
import { drawStaticImg } from './gameLib'


export const getMultiAction = (times, fn) => {
  for (let i = 0; i < times; i++) {
    fn()
  }
}
export const checkCollideWithPoint = (point={x: 0, y: 0}, collideObj={x: 0, y: 0, w: 0, h: 0}) => {
  if(point.x < collideObj.x + collideObj.w && point.x > collideObj.x && 
    point.y < collideObj.y + collideObj.h && point.y > collideObj.y) {
      return true
  } return false
}
export const checkAllCollideWithId = (tapPos={x: 0, y: 0}, allCollideObjs=[], id=10) => {
  for (let i = 0; i < allCollideObjs.length; i++) {
    const thisCollide = allCollideObjs[i]
    const collideSpec = {
      x: thisCollide.OBJ.x,
      y: thisCollide.OBJ.y,
      w: thisCollide.OBJ.w,
      h: thisCollide.OBJ.h,
    }
    if(checkCollideWithPoint(tapPos, collideSpec)) {
      console.log(allCollideObjs[i].id)
      // this.destroyObj(thisCoin.id)
      if(allCollideObjs[i].id === id) {
        return true
      }
    }
  }
}
export const getCanvasComponent = (id=0, canvas, imgSrc='', spec=[0, 0, 0, 0], drawClass=drawStaticImg, ratio=1) => ({
  id,
  cloneId: 0,
  OBJ: new drawClass({
    canvas, 
    imgSrc, 
    width: spec[0], 
    height: spec[1], 
    x: spec[2], 
    y: spec[3],
    imgRatio: ratio,
  })
})
export const getCanvasRandPos = (canvasObjAreaSpec, Obj, x=0, y=0) => ({
  x: x === 0 ? ~~( Math.random() * ( canvasObjAreaSpec.width - Obj.OBJ.w ) ) : x,
  y: y === 0 ? ~~( Math.random() * ( canvasObjAreaSpec.width - Obj.OBJ.w ) ) : y,
})
export const spawnRandomPosObj = (canvas, gameInstanceLayer, objFn, ...objFnParas) => {
  const originObj = objFn(canvas)
  const randX = ~~( Math.random() * ( canvasObjAreaSpec.width - originObj.OBJ.w ) ) 
  const randY = ~~( Math.random() * ( canvasObjAreaSpec.height - originObj.OBJ.h ) )
  const newId = gameInstanceLayer.layerObjs.length + 1
  const newObj = objFn(canvas, randX, randY, ...objFnParas)
  return ( {
    newId: newId,
    newObjs: [
      ...gameInstanceLayer.layerObjs,{
        id: newId,
        OBJ: newObj.OBJ
      }
    ]
  } )
}
export const destroyObj = (gameInstanceLayer, id='', cloneId=0) => {
  const originObj = gameInstanceLayer.layerObjs
  if(typeof(id) === 'undefined' | typeof(cloneId) === 'undefined') {
    throw 'Your object id or clone id is undefined.'
  }
  return (originObj.filter(o => !(o.id === id && o.cloneId === cloneId) ))
}

export const getTap = (e, canvas, layer, id, actionFn) => {
  const tapX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX
  const tapY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY
  const posX = tapX - canvas.getBoundingClientRect().left 
  const posY = tapY - canvas.getBoundingClientRect().top
  const tapPos = {
    x: posX, y: posY
  }
  if(checkAllCollideWithId(tapPos, layer.layerObjs, id)) {
    actionFn()
  }
}