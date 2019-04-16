/* eslint-disable no-undef */
import { 
  genRandom,
  setValueOfArrObj,
  getAllOrStarData,
  activeButton,
  genOptionsWithABCD,
  filterArrWithProperty,
  filterArrObjWithArr,
  convertABCDtoNum,
  checkAnyOfObjArrIsEmpty,
  getNoSameArr,
  convertSecToMin,
 } from '../src/functions'
import { 
  getBreakComponent,
} from '../src/game/gameFunc'

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
  it('test style button function', () => {
    const activeStyle = {
      backgroundColor: '#111', color: '#fff',
    }
    const normalStyle = {
      backgroundColor: '#ddd', color: '#111'
    }
    expect(activeButton('aa', 'bb')).toEqual(normalStyle)
    expect(activeButton('aa', 'aa')).toEqual(activeStyle)
  })
  it('test generate ABCD options', () => {
    const mockOptions = ['aa', 'bb', 'cc']
    const mockOptionsResult = [
      { id: 'A', options: 'aa' },
      { id: 'B', options: 'bb' },
      { id: 'C', options: 'cc' },
    ]
    expect(genOptionsWithABCD(mockOptions)).toEqual(mockOptionsResult)
  })
  it('test filter array with property function', () => {
    const mockTargetArr = [
      { id: 0, data: 'aaa' },
      { id: 1, data: 'aaa' },
      { id: 2, data: 'aaa' },
    ]
    const mockFilterArr = [
      { id: 1, data: 'aaa' },
      { id: 2, data: 'aaa' },
      { id: 3, data: 'aaa' },
    ]
    const mockResultArr = [1, 2]
    expect(filterArrWithProperty(mockTargetArr, mockFilterArr, 'id')).toEqual(mockResultArr)
  })
  it('test filter arrObject with array function', () => {
    const mockTargetArr = [
      { id: 0, data: 'aaa' },
      { id: 1, data: 'aaa' },
      { id: 2, data: 'aaa' },
      { id: 3, data: 'aaa' },
      { id: 4, data: 'aaa' },
    ]
    const mockResultArr = [
      { id: 2, data: 'aaa' },
      { id: 4, data: 'aaa' },
    ]
    const mockResultArr2 = [
      { id: 0, data: 'aaa' },
      { id: 1, data: 'aaa' },
      { id: 3, data: 'aaa' },
    ]
    const mockArr = [2, 4]
    expect(filterArrObjWithArr(mockTargetArr, mockArr, 'id', false)).toEqual(mockResultArr)
    expect(filterArrObjWithArr(mockTargetArr, mockArr, 'id', true)).toEqual(mockResultArr2)
  })
  it('test convert ABCD to numbers', () => {
    expect(convertABCDtoNum('A')).toBe(0)
    expect(convertABCDtoNum('D')).toBe(3)
  })
  it('test check there is empty string in a object array', () => {
    const mockData = [
      { id: 0, data: 'a' },
      { id: 1, data: 'b' },
    ]
    const mockData2 = [
      { id: 0, data: 'a', arr: [ { id: 9, data: 'a' } ] },
      { id: 1, data: 'b', arr: [ { id: 9, data: '' } ] },
    ]
    expect(checkAnyOfObjArrIsEmpty(mockData)).toBeTruthy()
    expect(checkAnyOfObjArrIsEmpty(mockData2)).toBeFalsy()
  })
  it('test getNoSameArr funtion', () => {
    const arr = [1, 2, 3, 2, 3, 5]
    const expectArr = [1, 2, 3, 5]
    expect(getNoSameArr(arr)).toEqual(expectArr)
  })
  it('test convert seconds to minutes and seconds array function', () => {
    expect(convertSecToMin(100)).toEqual(['01', '40'])
  })
  it('test break text fn', () => {
    const textMock = ['a', 'b', 'c', 'dddd', 'e', 'f']
    const width = [20, 100, 30, 40, 40, 20]
    const containerWidth = 100
    expect(getBreakComponent(textMock, width, containerWidth)).toEqual(['a b', 'c dddd e', 'f'])
  })
})
 