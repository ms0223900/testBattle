// import { TABconfig } from '../gameConfig'
import { 
  // shopItems1, 
  MyShopContainer 
} from './shopContainer'
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

const SHOPICON = ShopIconConfig.slice(0, 8).map(con => con = con.id)

export const shopUIActions = (gameInstanse) => {
  const { UILayer } = gameInstanse.myLayers

  return ([
    {
      layer: UILayer, 
      id: 'ShopIcon_hotDog', cloneId: 0, 
      fn: () => {
        window.alert('ShopIcon_hotDog')
      },
    },
    {
      layer: UILayer, 
      id: 'closeIcon', cloneId: 0, 
      fn: () => {
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', false)
      },
    },
    ...SHOPICON.map(icon => buyItems(gameInstanse, icon)),
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
      id: 'tabA', cloneId: 0, 
      fn: () => {
        // window.alert('tabA')

        // MyShopContainer.removeObjInContainer('shopItems1', 0)
        MyShopContainer.setAttr('shopItems1', 0, 'groupDisplay', true)
        MyShopContainer.setAttr('shopItems2', 0, 'groupDisplay', false)
        MyShopContainer.setAttr('tabA', 0, 'opacity', 1)
        MyShopContainer.setAttr('tabB', 0, 'opacity', 0.4)
      },
    },
    {
      layer: UILayer, 
      id: 'tabB', cloneId: 0, 
      fn: () => {
        // MyShopContainer.addObjToContainer( shopItems1() )
        MyShopContainer.setAttr('shopItems1', 0, 'groupDisplay', false)
        MyShopContainer.setAttr('shopItems2', 0, 'groupDisplay', true)
        MyShopContainer.setAttr('tabA', 0, 'opacity', 0.4)
        MyShopContainer.setAttr('tabB', 0, 'opacity', 1)
      },
    },
  ])
}
const buyItems = (gameInstanse, id) => ({
  layer: gameInstanse.myLayers.UILayer, 
  id: id, cloneId: 0, 
  fn: () => {
    const ICONconfig = ShopIconConfig.filter(config => config.id === id)
    
    const isExist = gameInstanse.checkObjExist('UILayer', 'ItemsContainer', id)
    const containerObjsLength = MyItemsContainer.OBJ.groupObjs.length
    if(!isExist) {
      ICONconfig.map(con => gameInstanse.spawnObjToLayer({ 
        layer: 'UILayer',
        container: 'ItemsContainer',
        objFn: ShopIcon,
        pos: { x: 60 * containerObjsLength, y: 100 },
        objFnParas: { id: con.id, iconImgSrc: con.imgSrc, iconCount: 1 },
        selfDestroy: false,
        destroyTime: 3000,
      }))

      console.log(MyItemsContainer.containerStates)
      MyItemsContainer.setContainerState({
        items: [
          ...MyItemsContainer.containerStates.items.filter(it => it.id !== 'shopCount_' + id), 
          { id: 'shopCount_' + id, count: 1 }
        ]
      })
    } else {
      MyItemsContainer.updateCount('shopCount_' + id, 'items', 'count', +1)
    }
  },
})