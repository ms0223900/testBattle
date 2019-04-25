import { getCanvasGroup } from '../gameFunc'
import { canvasSpec } from '../gameConfig'
import { freeIcon } from '../gameObj'
import { Icon } from '../components/Icon'

export default function(x, y) {
  return getCanvasGroup({
    id: 'ShopContainer', 
    spec: [x, y], 
    groupObjs: [
      Icon({
        id: 'shopIcon',
        imgSrc: freeIcon.shop,
        x: canvasSpec.width - 20, y: canvasSpec.height - 40,
      })
    ]
  })
}