export const ItemsActions = (gameInstanse) => {
  const { UILayer } = gameInstanse.myLayers
  //  = gameInstanse.getAttr('UILayer', 'ItemsContainer')
  return ([
    {
      layer: UILayer, 
      id: 'ItemOpenIcon', cloneId: 0, 
      fn: () => {
        const  ItemsContainerGroupDisplay = gameInstanse.getAttr('UILayer', 'ItemsContainer', 0,'groupDisplay')
        gameInstanse.setAttr('UILayer', 'ItemsContainer', 0, 'groupDisplay', !ItemsContainerGroupDisplay)
      },
    },
  ])
}