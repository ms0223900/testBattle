// import { TABconfig } from '../gameConfig'

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
        gameInstanse.setAttr('UILayer', 'ShopIcon_shop', 0, 'groupDisplay', false)
      },
    },
    {
      layer: UILayer, 
      id: 'shopIcon', cloneId: 0, 
      fn: () => {
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', true)
      },
    },
  ])
}
