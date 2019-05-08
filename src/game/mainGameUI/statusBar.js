import { HealthIcon, PowerIcon, SmartIcon } from './mainUIGameIcons'
import { getCanvasGroup } from '../gameFunc'
import { drawRect } from '../gameLib'

export class Bar extends drawRect {
  constructor(props) {
    super(props)
    // this.maxLength = 80
    this.length = 0
    this.prev = {
      length: 0,
    }
  }
  updateLength() {
    if(this.prev.length !== this.length) {
      this.w = this.length
      this.prev = {
        ...this.prev,
        length: this.length
      }
    }
  }
  render(ctx) {
    this.updateLength()
    if(this.display) { this.draw(ctx) }
  }
}

const barRect = (id, barColor) => ({
  id: id + '_barRect',
  cloneId: 0,
  OBJ: new Bar({
    id: id + '_barRect',
    x: 10, y: 10,
    w: 100, h: 20,
    fillStyle: barColor,
  })
})


export const StatusBar = ({ id, icon, barColor }) => (x, y) => getCanvasGroup({
  id, 
  spec: [x, y],
  groupObjs: [
    barRect(id, barColor),
    icon,
  ]
})

export const HealthBar = StatusBar({
  id: 'healthBar',
  icon: HealthIcon,
  barColor: '#eaa'
})(0, 0)
export const PowerBar = StatusBar({
  id: 'powerBar',
  icon: PowerIcon,
  barColor: '#cc0'
})(0, 60)
export const SmartBar = StatusBar({
  id: 'smartBar',
  icon: SmartIcon,
  barColor: '#3af'
})(0, 120)