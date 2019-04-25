import { Icon } from '../components/Icon'
import { ShopIcon } from './shopIcon'
import { ShopBG_B } from './shopBG'
import { freeIcon } from '../gameObj'
import { 
  canvasSpec,
  ShopIconConfig,
  ShopUIConfig 
} from '../gameConfig'
import { getCanvasGroup } from '../gameFunc'
import { handleBlockLineBreak } from '../../functions'
const { width: backW, height: backH, imgSrc: backImgSrc } = ShopUIConfig.backGround



export function ShopContainer(x, y) {
  const xy = ShopIconConfig.map(config => handleBlockLineBreak(config.posId, 3, 60, backW, 40))
  let iconConfig = []
  for (let i = 0; i < ShopIconConfig.length; i++) {
    iconConfig[i] = {
      ...ShopIconConfig[i],
      x: xy[i].x,
      y: xy[i].y,
    }
  }
  const containerProps = { countNum: [20, 30, 40, 20] }
  const containerGroup = getCanvasGroup({
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
        iconCount: this.countNum,
      })),
      Icon({
        id: 'closeIcon',
        imgSrc: freeIcon.close,
        x: 280, y: -20,
      }),
      Icon({
        id: 'shopIcon',
        imgSrc: freeIcon.shop,
        x: canvasSpec.width - 20, y: canvasSpec.height - 40,
      })
    ]
  })
  return {
    ...containerProps,
    ...containerGroup,
  }
}
export const MyShopContainer = new ShopContainer(0, 100)