import mainUIContainer from './mainUIContainer'

export default (gameInstance) => {
  const { UILayer } = gameInstance.myLayers

  return ([
    {
      layer: UILayer, 
      id: 'healthBar', cloneId: 0, 
      fn: () => {
        // gameInstance.setAttr('UILayer', 'ShopContainer', 0, 'groupDisplay', false)
        // window.alert('aa')
        mainUIContainer.updateCount('healthBar_barRect', 'barState', 'length', 10)
      },
    }
  ])
}