/* eslint-disable no-undef */
import { 
  genRandom,
  setValueOfArrObj,
  getAllOrStarData,
 } from '../src/functions'

describe('test functions', () => {
  it('test set value function', () => {
    const idealOutput = [{
      id: 2,
      value: 'aa'
    }]
    const targetObj = [{ id: 2, value: '11' }]
    expect(setValueOfArrObj(targetObj, '2', 'value', 'aa')).toEqual(idealOutput)
  })
  it('test random generator should be all integer', () => {
    const randomArr = genRandom(5, 40, 30)
    const randomArr2 = genRandom(10, 1, 4)
    expect(randomArr.filter(arr => arr % 1 !== 0)).toHaveLength(0)
    expect(randomArr2).toHaveLength(4)
  })
  it('test get random data function', () => {
    const mockData = [
      { id: 0, star: false },
      { id: 1, star: false },
      { id: 2, star: true },
      { id: 3, star: false },
      { id: 4, star: true },
      { id: 5, star: false },
    ]
    const getAllData = getAllOrStarData(false, 3, mockData, false)
    expect(getAllData).toHaveLength(3)
    const getStarData = getAllOrStarData(true, 3, mockData, false)
    expect(getStarData).toHaveLength(2)
    
    const getAllData_random = getAllOrStarData(false, 7, mockData, true)
    console.log(getAllData_random)
    expect(getAllData_random).toHaveLength(6)
    const getStarData_random = getAllOrStarData(true, 3, mockData, true)
    console.log(getStarData_random)
    expect(getStarData_random).toHaveLength(2)
    
  })
})
 