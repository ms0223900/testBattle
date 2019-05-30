import { drawStaticImg } from '../gameLib'

export class WanderingObj extends drawStaticImg {
  constructor(props) {
    super(props)
    this.wanderSpeed = { x: 2, y: 4 }
  }
  wander() {
    this.x += 2
    this.y += 4
  }
}