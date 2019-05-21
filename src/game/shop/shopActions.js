// import { TABconfig } from '../gameConfig'
import { 
  // shopItems1, 
  MyShopContainer 
} from './shopContainer'
import { MyItemsContainer } from '../items/itemsContainer'
import { ShopIconConfig } from '../gameConfig'
import EffectNumberPopup from '../components/effectNumberPopup'
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
const TABs = [
  { tab: 'tabA', items: 'shopItems1', },
  { tab: 'tabB', items: 'shopItems2', },
  { tab: 'tabC', items: 'shopItems3', },
]


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
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'display', false)
        // gameInstanse.setAttr('UILayer', 'closeIcon', 0, 'bounceStart', true)
        // gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', false)
        
      },
    },
    ...SHOPICON.map(icon => buyItems(gameInstanse, icon)),
    ...TABs.map(tab => switchTabs(gameInstanse, MyShopContainer, TABs, tab.tab, tab.items)),
    {
      layer: UILayer, 
      id: 'ShopOpenIcon', cloneId: 0, 
      fn: () => {
        gameInstanse.setAttr('UILayer', 'ShopContainer', 0, 'display', true)
        gameInstanse.setAttr('UILayer', 'ShopOpenIcon', 0, 'bounceStart', true)
        gameInstanse.spawnObjToLayer({ 
          layer: 'UILayer',
          container: 'ShopContainer',
          objFn: EffectNumberPopup,
          pos: { x: 100 , y: 170 },
          objFnParas: { id: 'count1', count: 1,  },
          selfDestroy: true,
          destroyTime: 2000,
        })
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

const switchTabs = (gameInstanse, container, tabs, targetTabId, targetItemId) => ({
  layer: gameInstanse.myLayers.UILayer, 
  id: targetTabId, cloneId: 0, 
  fn: () => {
    for (let i = 0; i < tabs.length; i++) {
      const { tab, items } = tabs[i]
      container.setAttr(items, 0, 'display', false)
      container.setAttr(tab, 0, 'opacity', 0.4)
    }
    container.setAttr(targetItemId, 0, 'display', true)
    container.setAttr(targetTabId, 0, 'opacity', 1)
  },
})