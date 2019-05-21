import { 
  drawUIText,
} from '../gameLib'

class effectNumberPopUp extends drawUIText {
  constructor(props) {
    super(props)
    this.pop = {
      limit: 30,
      now: 0,
    }
  }
  popUp() {
    if(this.pop.now < this.pop.limit) {
      this.pop.now ++
      this.y -= 0.5
    }
  }
  render(ctx) {
    this.popUp()
    this.draw(ctx)
  }
}

export default ({ x=100, y=100, id='', count=1, operation='+', }) => ({
  id: 'effectNumberPopUp_' + id, cloneId: 0,
  OBJ: new effectNumberPopUp({
    x, y,
    textConfig: '18px Arial',
    text: operation + ' ' + count,
    containerWidth: 40,
  })
})