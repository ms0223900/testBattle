import { 
  Icon, 
} from '../components/Icon'
import { ShopIcon } from './shopIcon'
import { ShopBG_B } from './shopBG'
import { freeIcon } from '../gameObj'
import { 
  // canvasSpec,
  ShopIconConfig,
  ShopUIConfig 
} from '../gameConfig'
import { 
  getCanvasGroup, 
  mergeArrObjs,
} from '../gameFunc'
import { Container } from '../gameLib'
import { handleBlockLineBreak } from '../../functions'


const { width: backW, height: backH, imgSrc: backImgSrc } = ShopUIConfig.backGround



export const shopContainerGroup = (x, y) => {
  const xy = ShopIconConfig.slice(0, 4).map(config => handleBlockLineBreak(config.posId, 3, 80, backW, 40))
  let iconConfig = []
  for (let i = 0; i < xy.length; i++) {
    iconConfig[i] = {
      ...ShopIconConfig[i],
      x: xy[i].x,
      y: xy[i].y,
    }
  }
  return getCanvasGroup({
    id: 'ShopContainer', 
    spec: [x, y], 
    groupObjs: [
      ShopBG_B({
        imgSrc: backImgSrc,
        x: 0, y: 0,
        w: backW, h: backH,
      }),
      ...iconConfig.map(iconConfig => ShopIcon({
        id: iconConfig.id,
        x: iconConfig.x,
        y: iconConfig.y,
        iconImgSrc: iconConfig.imgSrc,
        iconCount: 0,
      })),
      Icon({
        id: 'closeIcon',
        imgSrc: freeIcon.close,
        x: 280, y: -20,
      }),
    ]
  })
}


const subscribeIds = [
  { id: 'shopCount_ShopIcon_shop', attr: 'count', },
  { id: 'shopCount_ShopIcon_info', attr: 'count', },
  { id: 'shopCount_ShopIcon_coins', attr: 'count', },
  { id: 'shopCount_ShopIcon_burger', attr: 'count', },
]
export class ShopContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    const { countNum } = this.containerStates
    const countNumObj = countNum.map(num => num = { num })
    const mergeStates = mergeArrObjs(subscribeIds, countNumObj)
    console.log(mergeStates)
    mergeStates.map(st => this.setAttr(st.id, 0, st.attr, st.num))
  }
}
// MyShopContainer.subscribeAttrToUpdate({ 
//   id: 'shopCount_ShopIcon_shop', attr: 'count',
//   containerStates: MyShopContainer.containerStates.countNum[0]
// })

export const MyShopContainer = new ShopContainer({
  containerStates: { countNum: [40, 30, 40, 99] },
  containerGroup: shopContainerGroup(22, 99),
})
MyShopContainer.updateComponents()
console.log(MyShopContainer)
MyShopContainer.setAttr('ShopContainer', 0, 'display', false)