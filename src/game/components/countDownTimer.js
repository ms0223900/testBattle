import { 
  drawUIText,
  drawRect,
  myGroupObjs,
} from '../gameLib'

class TimeText extends drawUIText {
  constructor(props) {
    super(props)
    this.prevTime = 0
    this.countDownTime = 0
    this.time = 0
    this.text = ''
  }
  convertTime() {
    const sec = this.time % 60 < 10 ? '0' + this.time % 60 : this.time % 60 
    const min = ~~(this.time / 60)
    this.text = min + ' : ' + sec
  }
  render(ctx) {
    this.convertTime()
    this.draw(ctx)
  }
}
class TimeRect extends drawRect {
  constructor({ timeRectType='BG', countDownTime=100, ...props }) {
    super(props)
    this.prevTime = 0
    this.time = 0
    this.maxWidth = 200
    this.countDownTime = countDownTime
    this.w = this.maxWidth
    this.timeRectType = timeRectType
  }
  setWidthByTimeAndType() {
    if(this.timeRectType === 'Active') {
      this.w = (this.time / this.countDownTime) * this.maxWidth
    }
  }
  render(ctx) {
    ctx.save()
    this.setWidthByTimeAndType()
    this.draw(ctx) 
    ctx.restore()
  }
}
//
const countDownTxt = () => ({
  id: 'countDownTxt', cloneId: 0,
  OBJ: new TimeText({
    x: 0, y: 40,
    containerWidth: 200,
  }),
})
const timerRectBG = (countDownTime) => ({
  id: 'timerRectBack', cloneId: 0,
  OBJ: new TimeRect({
    x: 0, y: 0,
    h: 10,
    fillStyle: '#ddd',
    timeRectType: 'BG',
    countDownTime,
  })
})
const timerRectActive = (countDownTime) => ({
  id: 'timerRectBack', cloneId: 0,
  OBJ: new TimeRect({
    x: 0, y: 0,
    h: 10,
    fillStyle: '#333',
    timeRectType: 'Active',
    countDownTime,
  })
})
//
export default class Timer extends myGroupObjs {
  constructor({ countDownTime=100, ...props }) {
    super(props)
    this.time = countDownTime
    this.timer = setInterval(() => {
      const newTime = this.time - 1
      this.time = newTime
      this.handleChangeByTime(newTime)
    }, 1000)
    this.handleChangeByTime(countDownTime)
    this.groupObjs.map(go => go.OBJ.countDownTime = countDownTime)
  }
  checkTimer() {
    if(this.time <= 0) {
      this.display = false
      clearInterval(this.timer)
    }
  }
  handleChangeByTime(time) {
    this.groupObjs.map(go => go.OBJ.time = time)
  }
  render(ctx) {
    ctx.save()
    this.checkTimer()
    this.draw(ctx) 
    ctx.restore()
  }
}
export const DefaultTimer = ({ x=100, y=200, countDownTime=100, objsInTimer=[] }) => ({
  id: 'DefaultTimer', cloneId: 0,
  OBJ: new Timer({
    x, y,
    countDownTime,
    groupObjs: [
      countDownTxt(),
      timerRectBG(countDownTime),
      timerRectActive(countDownTime),
      ...objsInTimer,
    ]
  }),
})