import { getCanvasGroup } from '../gameFunc'
import { Container } from '../gameLib'
import { HealthBar, PowerBar, SmartBar } from './statusBar'

const containerStates = {
  barState: [
    { id: 'healthBar_barRect', length: 100, },
    { id: 'powerBar_barRect', length: 100, },
    { id: 'smartBar_barRect', length: 100, },
  ]
}
export const barRect = ['healthBar_barRect', 'powerBar_barRect', 'smartBar_barRect']


const mainContainerGroup = (x, y) => getCanvasGroup({
  id: 'MainContainer',
  spec: [x, y],
  groupObjs: [
    HealthBar, 
    PowerBar, 
    SmartBar
  ]
})

class MainContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    // const { health, power, smartPower } = this.containerState
    const { barState } = this.containerStates
    barState.map(bar => this.setAttr(bar.id, 0, 'length', bar.length))
  }
}

export default new MainContainer({
  containerStates,
  containerGroup: mainContainerGroup(20, 20),
})
