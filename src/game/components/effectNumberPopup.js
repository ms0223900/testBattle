import { 
  drawUIText,
} from '../gameLib'

export default ({ x=100, y=100, id='', count=1, operation='+', }) => ({
  id: 'effectNumberPopUp_' + id, cloneId: 0,
  OBJ: new drawUIText({
    x, y,
    textConfig: '18px Arial',
    text: operation + ' ' + count,
    containerWidth: 40,
  })
})