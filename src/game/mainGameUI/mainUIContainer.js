import { getCanvasGroup } from '../gameFunc'
import { Container } from '../gameLib'
import { ShopOpenIcon, ItemOpenIcon } from './mainUIGameIcons'

const containerState = {
  health: 100,
  power: 10,
  smartPower: 20,
}

const mainContainerGroup = (x, y) => getCanvasGroup({
  id: 'MainContainer',
  spec: [x, y],
  groupObjs: [
    ShopOpenIcon,
    ItemOpenIcon,
  ]
})


class MainContainer extends Container {
  constructor(props) {
    super(props)
  }
  updateComponents() {
    // const { health, power, smartPower } = this.containerState

  }
}

export default new MainContainer({
  containerState,
  containerGroup: mainContainerGroup(0, 0),
})
