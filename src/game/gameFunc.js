import { canvasSpec } from './gameComponent'
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
export const getCanvasComponent = (id=0, canvas, imgSrc='', spec=[0, 0, 0, 0], drawClass=drawStaticImg) => ({
  id,
  OBJ: new drawClass(canvas, imgSrc, ...spec)
})
export const spawnRandomPosObj = (canvas, gameInstanceLayer, objFn) => {
  const originObj = objFn(canvas)
  const randX = ~~( Math.random() * ( canvasSpec.width - originObj.OBJ.w ) ) 
  const randY = ~~( Math.random() * ( canvasSpec.height - originObj.OBJ.h ) )
  const newId = gameInstanceLayer.layerObjs.length + 1
  const newObj = objFn(canvas, randX, randY)
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
export const destroyObj = (gameInstanceLayer, id) => {
  const originObj = gameInstanceLayer.layerObjs
  return (originObj.filter(o => o.id !== id))
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