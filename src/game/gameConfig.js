export const initGameConfig = [
  { layer: 'UILayer', id: 2001, objProp: 'text', value: 1 },

]


export const styleConfig = {
  fontStyle: {
    sSize: '12px Arial',
    mSize: '18px Arial'
  }
}
export const canvasSpec = {
  width: 360,
  height: 640,
}
export const canvasObjAreaSpec = {
  width: 360,
  height: 540,
}


const TABconfig = [
  { 
    tabId: 'tabRect_A', 
    blurColor: 'rgba(20, 200, 20, 0.5)', 
    focusColor: 'rgba(20, 200, 20, 1)', 
    BGId: 'UIDisplay_A',  
  },
  { 
    tabId: 'tabRect_B', 
    blurColor: 'rgba(200, 20, 20, 0.5)', 
    focusColor: 'rgba(200, 20, 20, 1)', 
    BGId: 'UIDisplay_B',  
  },
  { 
    tabId: 'tabRect_C', 
    blurColor: 'rgba(20, 20, 200, 0.5)', 
    focusColor: 'rgba(20, 20, 200, 1)', 
    BGId: 'UIDisplay_C',  
  },
]
export const tabActions = (gameInstanse) => TABconfig.map(config => (
  { 
    layer: gameInstanse['myLayers']['UILayer'], 
    id: config.tabId, 
    cloneId: 0, 
    fn: () => {
      for (let i = 0; i < TABconfig.length; i++) {
        gameInstanse.setAttr('UILayer', TABconfig[i].tabId, 0, 'fillStyle', TABconfig[i].blurColor)
        gameInstanse.setAttr('UILayer', TABconfig[i].BGId, 0, 'groupDisplay', false)
      }
      gameInstanse.setAttr('UILayer', config.tabId, 0, 'fillStyle', config.focusColor)
      gameInstanse.setAttr('UILayer', config.BGId, 0, 'groupDisplay', true)
    }
  }
))