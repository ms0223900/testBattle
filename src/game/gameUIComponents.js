import { 
  drawRect,
  drawUIText
} from './gameLib'
import { 
  getCanvasGroup 
} from './gameFunc'


export const tabRect = (color) => ({
  id: 'tabRect',
  OBJ: new drawRect({
    x: 0, y: 0,
    w: 60, h: 30,
    fillStyle: color
  })
}) 
export const tabText = (txt) => ({
  id: 'tabText',
  OBJ: new drawUIText({
    x: 0, y: 10,
    textConfig: '18px Arial',
    text: txt, fillStyle: '#fff',
    containerWidth: 60,
    textAlignCenter: true,
  })
})



export const UITabs = (txt, x, y, fillColor) => getCanvasGroup({
  id: 'UITabs_' + txt,
  spec: [x, y],
  groupObjs: [
    tabRect(fillColor),
    tabText(txt)
  ]
})
export const UITabs_A = UITabs('A', 30, 100, '#a00aaa')
export const UITabs_B = UITabs('B', 120, 100, '#b00a0a')
export const UITabs_C = UITabs('C', 200, 100, '#345')