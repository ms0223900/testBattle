/* eslint-disable no-undef */
import React from 'react'
import App, {
} from '../src/app'
import { shallow } from 'enzyme'

describe('test app state', () => {
  it('', () => {
    const app = shallow(<App />)
    expect(app.instance().state.isHandIn).toBeFalsy()
  })
  
})
