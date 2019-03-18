/* eslint-disable no-undef */
import React from 'react'
import App, {
  setValueOfArrObj,
} from '../src/app'
import { shallow } from 'enzyme'

describe('test app state', () => {
  it('', () => {
    const app = shallow(<App />)
    expect(app.instance().state.isHandIn).toBeFalsy()
  })
  it('test set value function', () => {
    const idealOutput = [{
      id: 2,
      value: 'aa'
    }]
    const targetObj = [{ id: 2, value: '11' }]
    expect(setValueOfArrObj(targetObj, '2', 'value', 'aa')).toEqual(idealOutput)
  })
})
