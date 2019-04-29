// import { TABconfig } from '../gameConfig'
import { MyShopContainer } from './shopContainer'
import { ShopIconConfig } from '../gameConfig'
import { ShopIcon } from './shopIcon'

// export const tabActions = (gameInstanse) => TABconfig.map(config => (
//   { 
//     layer: gameInstanse['myLayers']['UILayer'], 
//     id: config.tabId, 
//     cloneId: 0, 
//     fn: () => {
//       for (let i = 0; i < TABconfig.length; i++) {
//         gameInstanse.setAttr('UILayer', TABconfig[i].tabId, 0, 'fillStyle', TABconfig[i].blurColor)
//         gameInstanse.setAttr('UILayer', TABconfig[i].BGId, 0, 'groupDisplay', false)
//       }
//       gameInstanse.setAttr('UILayer', config.tabId, 0, 'fillStyle', config.focusColor)
//       gameInstanse.setAttr('UILayer', config.BGId, 0, 'groupDisplay', true)
//     }
//   }
// ))

export const shopUIActions = (gameInstanse) => {
  const { UILayer } = gameInstanse.myLayers

  return ([
    {
      layer: UILayer, 
      id: 'closeIcon', cloneId: 0, 
      fn: () => {
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', false)
      },
    },
    {
      layer: UILayer, 
      id: 'ShopIcon_shop', cloneId: 0, 
      fn: () => {
        MyShopContainer.containerProps.countNum[1] += 1 
        gameInstanse.setAttr('UILayer', 'shopCount', 0, 'count', MyShopContainer.containerProps.countNum[1], false)

        const ICONconfig = ShopIconConfig.filter(config => config.id === 'ShopIcon_hotDog')

        const originGroupObjs = gameInstanse.myLayers.UILayer.layerObjs.filter(obj => obj.id === 'ItemsContainer')[0].OBJ.groupObjs
        console.log(originGroupObjs)
        const addedIcon = ICONconfig.map(config => ShopIcon({
          id: config.id,
          x: 60, y: 100,
          iconImgSrc: config.imgSrc,
          iconCount: 1,
        }))
        if(originGroupObjs.filter(obj => obj.id === 'ShopIcon_shop').length === 0) {
          gameInstanse.setAttr('UILayer', 'ItemsContainer', 0, 'groupObjs', [
            ...originGroupObjs,
            ...addedIcon,
          ])
        }
        
      },
    },
    {
      layer: UILayer, 
      id: 'ShopOpenIcon', cloneId: 0, 
      fn: () => {
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', true)
      },
    },
  ])
}
