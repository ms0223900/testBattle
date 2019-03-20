/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { 
  getDataFromLocalStorage,
  StarButton,
  NoteButton,
  DataButtons,
 } from '../src/singleQA'
import { shallow } from 'enzyme'

 describe('test component', () => {
  it('test star button', () => {
    const starButton = shallow(<StarButton star={true}/>)
    expect(starButton.find('button').get(0).props.style.backgroundColor).toBe('#333')
    const starButton2 = shallow(<StarButton star={false}/>)
    expect(starButton2.find('button').get(0).props.style.backgroundColor).toBe('#ddd')
  })
  it('test star button click function', () => {
    const fn = jest.fn()
    const starButton = shallow(<StarButton starFn={fn}/>)
    starButton.find('button').simulate('click')
    expect(fn).toBeCalled()
  })
  it('test note button', () => {
    const starButton = shallow(<NoteButton />)
    starButton.instance()._handleOpenNote()
    expect(starButton.find('textarea').get(0).props.style.display).toBe('block')
    starButton.instance()._handleOpenNote()
    expect(starButton.find('textarea').get(0).props.style.display).toBe('none')
  })
  it('test get local storage data function', () => {
    const mockData = {
      id: 10,
      star: false,
      noteContext: '',
    }
    expect(getDataFromLocalStorage(10)).toEqual(mockData)
  })
 })
 describe('test dataButtons functions', () => {
  it('test handle star functions', () => {
    localStorage.clear()
    const dataButtons = shallow(<DataButtons />)
    dataButtons.instance()._handleStar()
    expect(dataButtons.instance().state.star).toBeTruthy()
    dataButtons.instance()._handleStar()
    expect(dataButtons.instance().state.star).toBeFalsy()
  })
  it('test handle note function', () => {
    const e = { target: { value: 'aa', } }
    const dataButtons = shallow(<DataButtons />)
    dataButtons.instance()._handleEditNote(e)
    expect(dataButtons.instance().state.noteContext).toBe('aa')
  })
 })
 