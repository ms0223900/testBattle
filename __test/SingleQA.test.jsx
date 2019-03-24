/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { 
  getDataFromLocalStorage,
  StarButton,
  NoteButton,
  DataButtons,
  setDataToLocalStorage,
 } from '../src/singleQA'
import { shallow } from 'enzyme'

 describe('test component', () => {
  it('test star button click function', () => {
    const fn = jest.fn()
    const starButton = shallow(<StarButton starFn={fn}/>)
    starButton.find('span').simulate('click')
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
  beforeEach(() => { localStorage.setItem( 'starAndNote', JSON.stringify([
    { id: 10, star: false, note: '', }
  ]) ) })
  afterEach(() => { localStorage.clear() })
  it('test handle star functions', () => {
    const dataButtons = shallow(<DataButtons />)
    dataButtons.instance().setState({
      id: 10,
      star: false,
      noteContext: ''
    })
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
 describe('test localStorage functions', () => {
  beforeEach(() => { localStorage.setItem( 'starAndNote', JSON.stringify([
    { id: 10, star: false, note: '', }
  ]) ) })
  afterEach(() => { localStorage.clear() })
  it('test set local storage data function(star)', () => {
    setDataToLocalStorage(10, 'star', true)
    expect(JSON.parse(localStorage.getItem('starAndNote'))).toEqual([
      { id: 10, star: true, note: '', }
    ])    
  })
  it('test set local storage data function(note)', () => {
    setDataToLocalStorage(10, 'note', 'hey')
    expect(JSON.parse(localStorage.getItem('starAndNote'))).toEqual([
      { id: 10, star: false, note: 'hey', }
    ])    
  })
 })
 
 