import { canvasObjAreaSpec } from './gameConfig'
import { drawStaticImg, myGroupObjs } from './gameLib'


export const getMultiAction = (times, fn) => {
  for (let i = 0; i < times; i++) {
    fn()
  }
}
export const checkCollideWithPoint = (point={x: 0, y: 0}, collideObj={x: 0, y: 0, w: 0, h: 0}) => {
  // console.log(collideObj)
  if(collideObj.display || collideObj.groupDisplay) {
    if(point.x < collideObj.x + collideObj.w && point.x > collideObj.x && 
      point.y < collideObj.y + collideObj.h && point.y > collideObj.y) {
        return true
    } return false
  }
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
    // console.log(id, tapPos, collideSpec)
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
export const getCanvasComponent = (id='', imgSrc='', spec=[0, 0, 0, 0], drawClass=drawStaticImg, ratio=1, status=[], opacity) => ({
  id,
  cloneId: 0,
  OBJ: new drawClass({
    id,
    imgSrc, 
    width: spec[0], 
    height: spec[1], 
    x: spec[2], 
    y: spec[3],
    imgRatio: ratio,
    status,
    opacity,
  })
})
export const getCanvasGroup = ({ id='', spec=[0, 0], drawGroupClass=myGroupObjs, groupObjs=[] }) => ({
  id,
  cloneId: 0,
  OBJ: new drawGroupClass({
    id,
    x: spec[0],
    y: spec[1],
    groupObjs: groupObjs,
  })
})
export const getCanvasRandPos = (canvasObjAreaSpec, Obj, x=0, y=0) => ({
  x: x === 0 ? ~~( Math.random() * ( canvasObjAreaSpec.width - Obj.OBJ.w ) ) : x,
  y: y === 0 ? ~~( Math.random() * ( canvasObjAreaSpec.width - Obj.OBJ.w ) ) : y,
})
export const spawnRandomPosObj = (gameInstanceLayer, objFn, ...objFnParas) => {
  const originObj = objFn()
  const randX = ~~( Math.random() * ( canvasObjAreaSpec.width - originObj.OBJ.w ) ) 
  const randY = ~~( Math.random() * ( canvasObjAreaSpec.height - originObj.OBJ.h ) )
  const newId = gameInstanceLayer.layerObjs.length + 1
  const newObj = objFn(randX, randY, ...objFnParas)
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
export const destroyObj = (originObjs, id='', cloneId=0) => {
  if(typeof(id) === 'undefined' | typeof(cloneId) === 'undefined') {
    throw 'Your object id or clone id is undefined.'
  }
  return (originObjs.filter(o => !(o.id === id && o.cloneId === cloneId) ))
}

export const getTap = (e, canvas, layerInstanse, id, cloneId=0, actionFn, allCloneAction=false) => {
  const tapX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX
  const tapY = e.targetTouches ? e.targetTouches[0].clientY : e.clientY
  const posX = tapX - canvas.getBoundingClientRect().left 
  const posY = tapY - canvas.getBoundingClientRect().top
  const tapPos = {
    x: posX, y: posY
  }
  const getTapObj = getLayerObjByIdCloneId(layerInstanse.layerObjs, id, cloneId, allCloneAction)
  if(getTapObj && getTapObj.length > 0) {
    // console.log(getTapObj)
    if( getTapObj.map(obj => checkCollideWithPoint(tapPos, obj.OBJ)).indexOf(true) !== -1 ) {
      // console.log(id, cloneId, 'tap')
      return actionFn
    }
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
export const getLayerObjByIdCloneId = (layerOBJs, id='obj', cloneId=0, allClone=false) => {
  // console.log(layerOBJs)
  let resLayerObjs = []
  
  for (let i = 0; i < layerOBJs.length; i++) {
    const checkResult = allClone ? 
      layerOBJs.filter(obj => obj.id === id) : 
      layerOBJs.filter(obj => obj.id === id && obj.cloneId === cloneId)
    if(checkResult.length > 0) {
      // console.log(layerOBJs[i])
      resLayerObjs = [...resLayerObjs, ...checkResult]
      break
    } else if(layerOBJs[i].OBJ.groupObjs) {
      const res = getLayerObjByIdCloneId(layerOBJs[i].OBJ.groupObjs, id, cloneId, allClone)
      // console.log(res)
      if(res) {
        resLayerObjs = [...resLayerObjs, ...res]
      }
    }
  }
  return resLayerObjs
}
export const mergeArrObjs = (...arrObjs) => {
  const LENGTHs = arrObjs.map(arr => arr = arr.length ? arr.length : arr)
  for (let i = 0; i < LENGTHs.length; i++) {
    if(LENGTHs[i] !== LENGTHs[0]) { throw 'your parameter have different length.' }
  }
  let res = []
  console.log(arrObjs)
  for (let i = 0; i < arrObjs.length; i++) {
    for (let j = 0; j < arrObjs[i].length; j++) {
      res[j] = {
        ...res[j],
        ...arrObjs[i][j],
      }
    }
  }
  return res
}