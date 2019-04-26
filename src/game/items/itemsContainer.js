import { getCanvasGroup } from '../gameFunc'
import itemsBG from './itemsBG'

export function ItemsContainer(x, y) {
  return getCanvasGroup({
    id: 'ItemsContainer',
    spec: [x, y],
    groupObjs: [
      itemsBG,
    ]
  })
}
export const MyItemsContainer = new ItemsContainer(20, 100)