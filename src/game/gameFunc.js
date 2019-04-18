import { canvasObjAreaSpec } from './gameConfig'
import { drawStaticImg, myGroupObjs } from './gameLib'


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
export const checkAllCollideWithId = (tapPos={x: 0, y: 0}, allCollideObjs=[], id=10, cloneId=0, allCloneAction=false) => {
  for (let i = 0; i < allCollideObjs.length; i++) {
    const thisCollide = allCollideObjs[i]
    const collideSpec = {
      x: thisCollide.OBJ.x,
      y: thisCollide.OBJ.y,
      w: thisCollide.OBJ.w,
      h: thisCollide.OBJ.h,
    }
    if(checkCollideWithPoint(tapPos, collideSpec)) {
      // console.log(thisCollide.id)

      if(thisCollide.OBJ.groupObjs) {
        return checkAllCollideWithId({x: tapPos.x, y: tapPos.y}, thisCollide.OBJ.groupObjs, id, cloneId, allCloneAction)
      }
      if(cloneId !== 0) {
        if(allCollideObjs[i].id === id && allCloneAction && allCollideObjs[i].cloneId === cloneId) {
          return true
        }
      } else if(allCollideObjs[i].id === id){
        return true
      }
    }
  }
}
export const getCanvasComponent = (id=0, canvas, imgSrc='', spec=[0, 0, 0, 0], drawClass=drawStaticImg, ratio=1, status=[]) => ({
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
    status,
  })
})
export const getCanvasGroup = (id='', spec=[0, 0], drawGroupClass=myGroupObjs, groupObjs=[]) => ({
  id,
  cloneId: 0,
  OBJ: new drawGroupClass({
    x: spec[0],
    y: spec[1],
    groupObjs: groupObjs,
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

export const getTap = (e, canvas, layer, id, cloneId=0, actionFn, allCloneAction=false) => {
  const tapX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX
  const tapY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY
  const posX = tapX - canvas.getBoundingClientRect().left 
  const posY = tapY - canvas.getBoundingClientRect().top
  const tapPos = {
    x: posX, y: posY
  }
  if(checkAllCollideWithId(tapPos, layer.layerObjs, id, cloneId, allCloneAction)) {
    console.log('tap')
    return actionFn
  }
  return false
}
export const getBreakComponent = (textArr=[], textWidthArr=[], containerWidth=100) => {
  let i = 0, j = 0
  const resBreak = []
  const tempWidthArr = []
  while(i < textArr.length) {
    if(typeof(tempWidthArr[j]) === 'undefined' ) {
      tempWidthArr[j] = textWidthArr[i]
      resBreak[j] = textArr[i]
    } else if(tempWidthArr[j] < containerWidth) {
      tempWidthArr[j] += textWidthArr[i]
      resBreak[j] += ' ' + textArr[i] 
    } else {
      j++
      tempWidthArr[j] = textWidthArr[i]
      resBreak[j] = textArr[i]
    }
    i++
  }
  return resBreak
}
export const checkCollideWithWalls = (w, h, x, y, wallW, wallH) => {
  const objSpec = {
    t: y, r: x + w, b: y + h, l: x
  }
  if(objSpec.t < 0 || objSpec.r > wallW || objSpec.b > wallH || objSpec.l < 0) {
    if(objSpec.t < 0) {
      return 'top'
    } else if(objSpec.r > wallW) {
      return 'right'
    } else if(objSpec.b > wallH) {
      return 'bottom'
    } else {
      return 'left'
    }
  }
  return false
}