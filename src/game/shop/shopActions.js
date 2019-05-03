// import { TABconfig } from '../gameConfig'
// import { MyShopContainer } from './shopContainer'
import { MyItemsContainer } from '../items/itemsContainer'
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

const SHOPICON = ShopIconConfig.slice(0, 4).map(con => con = con.id)

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
    ...SHOPICON.map(icon => buyItems(gameInstanse, icon)),
    ...SHOPICON.map(icon => consumeItems(gameInstanse, icon)),
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
    {
      layer: UILayer, 
      id: 'ShopIcon_shop', cloneId: 1, 
      fn: () => {
        const originCount = MyItemsContainer.getContainerAttr(MyItemsContainer.containerStates.items, 'shopCount_ShopIcon_shop').count
        if(originCount - 1 > 0) {
          const MINUS = (num) => num - 1
          MyItemsContainer.updateCount('shopCount_ShopIcon_shop', 'items', 'count', MINUS)
        } else {
          MyItemsContainer.removeObjInContainer('ShopIcon_shop', 1)
        }
        
      },
    },
  ])
}
const buyItems = (gameInstanse, id) => ({
  layer: gameInstanse.myLayers.UILayer, 
  id: id, cloneId: 0, 
  fn: () => {
    // const { countNum } = MyShopContainer.containerStates
    // const newCount = countNum[0] + 1
    // MyShopContainer.setContainerState({
    //   countNum: [newCount, ...countNum.slice(1, 4)]
    // })

    const ICONconfig = ShopIconConfig.filter(config => config.id === id)
    
    const isExist = gameInstanse.checkObjExist('UILayer', 'ItemsContainer', id)
    const containerObjsLength = MyItemsContainer.OBJ.groupObjs.length
    if(!isExist) {
      ICONconfig.map(con => gameInstanse.spawnObjToLayer({ 
        layer: 'UILayer',
        container: 'ItemsContainer',
        objFn: ShopIcon,
        pos: { x: 60 * containerObjsLength, y: 100 },
        objFnParas: { id: con.id, iconImgSrc: con.imgSrc, iconCount: 1 }
      }))

      console.log(MyItemsContainer.containerStates)
      MyItemsContainer.setContainerState({
        items: [
          ...MyItemsContainer.containerStates.items.filter(it => it.id !== 'shopCount_' + id), 
          { id: 'shopCount_' + id, count: 1 }
        ]
      })
    } else {
      const ADD = (num) => num + 1
      MyItemsContainer.updateCount('shopCount_' + id, 'items', 'count', ADD)
    }
  },
})
const consumeItems = (gameInstanse, id) => ({
  layer: gameInstanse.myLayers.UILayer, 
  id: id, cloneId: 1, 
  fn: () => {
    const originCount = MyItemsContainer.getContainerAttr(MyItemsContainer.containerStates.items, 'shopCount_' + id).count
    if(originCount - 1 > 0) {
      const MINUS = (num) => num - 1
      MyItemsContainer.updateCount('shopCount_' + id, 'items', 'count', MINUS)
    } else {
      MyItemsContainer.removeObjInContainer(id, 1)
    }
  },
})