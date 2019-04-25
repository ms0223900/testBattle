import { shopUIActions } from './shop/shopActions'

export const alertUIActions = (gameInstanse) => {
  const { UILayer } = gameInstanse.myLayers

  return ([
    { layer: UILayer, id: 'UIDisplayComponent_A', cloneId: 0, fn: () => {
      this.purchaseCoinUprade(10000)
    } },
  
    { layer: UILayer, id: 'cancelIcon', cloneId: 0, fn: () => {
      gameInstanse.removeObjFromLayer('UILayer', 'alertUI', 1)
    } },
  
    { layer: UILayer, id: 'alertBack', cloneId: 0, fn: () => {
      return false
    } },
  ])
}


export const tapActionHolder = (gameInstanse) => {
  //順序很重要, 越前面的層級越大
  return [
    ...alertUIActions(gameInstanse),
    // ...tabActions(gameInstanse),
    ...shopUIActions(gameInstanse),
  ]
}