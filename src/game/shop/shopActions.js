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
  // const myShopContainer = MyShopContainer(gameInstanse)
  // myShopContainer.subscribeAttrToUpdate({ 
  //   id: 'shopCount_ShopIcon_shop', attr: 'count',
  //   containerStates: myShopContainer.containerStates.countNum[0]
  // })

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
        const { countNum } = MyShopContainer.containerStates
        
        MyShopContainer.setContainerState({
          countNum: countNum.map(num => num + 10)
        })
        // console.log(MyShopContainer)
        // const newCount = MyShopContainer.containerStates.countNum[2] += 1 
        // gameInstanse.setAttr('UILayer', 'shopCount_ShopIcon_shop', 0, 'count', newCount, false)

        const ICONconfig = ShopIconConfig.filter(config => config.id === 'ShopIcon_hotDog')
        
        const isExist = gameInstanse.checkObjExist('UILayer', 'ItemsContainer', 'ShopIcon_hotDog')
        if(!isExist) {
          ICONconfig.map(con => gameInstanse.spawnObjToLayer({ 
            layer: 'UILayer',
            container: 'ItemsContainer',
            objFn: ShopIcon,
            pos: { x: 60, y: 100 },
            objFnParas: { id: con.id, iconImgSrc: con.imgSrc, iconCount: 1 }
          }))
        } else {
          // gameInstanse.setAttr('UILayer', 'shopCount_ShopIcon_hotDog', 0, 'count', newCount, false)
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
    {
      layer: UILayer, 
      id: 'ShopIcon_burger', cloneId: 0, 
      fn: () => {
        const originX = gameInstanse.getAttr('UILayer', 'ShopContainer', 0, 'x')
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'x', originX + 5)
      },
    },
  ])
}
