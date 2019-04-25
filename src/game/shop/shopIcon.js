import { 
  drawUIText,
} from '../gameLib'
import { Icon } from '../components/Icon'
// import { ShopUIConfig } from '../gameConfig'
import { getCanvasGroup } from '../gameFunc'


export class drawNumberCountTest extends drawUIText {
  constructor({ count , ...props}) {
    super(props)
    this.count = count
    this.text = 'X ' + this.count
  }
}


export const ShopCount = ({ count=0, }) => ({
  id: 'shopCount',
  cloneId: 0,
  OBJ: new drawNumberCountTest({
    x: 0, y: 60,
    textConfig: '14px Arial',
    count,
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