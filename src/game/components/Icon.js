import { 
  drawStaticImg,
} from '../gameLib'
import { canvasSpec } from '../gameConfig'
import { freeIcon } from '../gameObj'

export const Icon = ({ imgSrc='', id='Icon', x=0, y=0 }) => ({
  id,
  cloneId: 0,
  OBJ: new drawStaticImg({
    imgSrc: imgSrc,
    x, y,
    width: 40,
    height: 40,
  })
})

export const ShopOpenIcon = Icon({
  imgSrc: freeIcon.shop,
  id: 'ShopOpenIcon',
  x: canvasSpec.width - 60,
  y: canvasSpec.height - 80,
})
export const ItemOpenIcon = Icon({
  imgSrc: freeIcon.item,
  id: 'ItemOpenIcon',
  x: 20,
  y: canvasSpec.height - 80,
})