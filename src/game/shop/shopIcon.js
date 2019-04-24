import { 
  drawStaticImg,
  drawUIText,
} from '../gameLib'
// import { ShopUIConfig } from '../gameConfig'
import { getCanvasGroup } from '../gameFunc'


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

export const ShopCount = ({ count=0, }) => ({
  id: 'shopCount',
  cloneId: 0,
  OBJ: new drawUIText({
    x: 0, y: 60,
    textConfig: '14px Arial',
    text: 'X ' + count,
    containerWidth: 40,
  })
})

export const ShopIcon = ({ id='ShopIcon', x=0, y=0, iconImgSrc='', iconCount, }) => getCanvasGroup({
  id,
  spec: [x, y],
  groupObjs: [
    Icon({ imgSrc: iconImgSrc }),
    ShopCount({ count: iconCount })
  ]
})