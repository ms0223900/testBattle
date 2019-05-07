import { HealthIcon, PowerIcon, SmartIcon } from './mainUIGameIcons'
import { getCanvasGroup } from '../gameFunc'
import { drawRect } from '../gameLib'

export class Bar extends drawRect {
  constructor(props) {
    super(props)
    this.maxLength = 80
    this.length = 0
    this.prev = {
      length: 0,
    }
  }
  updateLength() {
    if(this.prev.length !== this.length) {
      this.w = this.length
    }
  }
  render(ctx) {
    this.updateLength()
    if(this.display) { this.draw(ctx) }
  }
}



export const StatusBar = (id, icon) => (x, y) => getCanvasGroup({
  id, 
  spec: [x, y],
  groupObjs: [
    icon,
  ]
})