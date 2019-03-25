/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { setValueOfArrObj, genOptionsWithABCD } from './functions'
import { styles } from '../config'
const { starBTN } = styles

export const getDataFromLocalStorage = (id) => {
  const setDefaultData = {
    id: id,
    star: false,
    noteContext: '',
  }
  if(!localStorage.getItem('starAndNote')) {
    localStorage.setItem('starAndNote', JSON.stringify([]))
  }
  const allIdData = JSON.parse(localStorage.getItem('starAndNote'))
  const thatIdData = allIdData.filter(ls => ls.id === id)[0]
  if(thatIdData) {
    return thatIdData
  } else {
    localStorage.setItem('starAndNote', JSON.stringify([...allIdData, setDefaultData]))
    return setDefaultData
  }
}
export const setDataToLocalStorage = (id, prop, data) => {
  const originLS = JSON.parse(localStorage.getItem('starAndNote'))
  localStorage.setItem('starAndNote', JSON.stringify(setValueOfArrObj(originLS, id, prop, data)))
}
export const HOCwithHint = (Component, hint='I am hint!', hinted='') => class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { isActive=false } = this.props
    return (
      <div className='component-withHint'>
        <Component {...this.props} />
        <div className='hint-dialog'>
          {isActive ? hinted : hint}
        </div>
      </div>
    );
  }
}
export class SingleQA_WithButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNoteOpen: false,
    };
  }
  _handleOpenNote = () => {
    this.setState({
      isNoteOpen: !this.state.isNoteOpen
    })
  }
  render() {
    const { id, changeAnswer, myAnswer, question, options, isHandIn } = this.props
    return (
      <Fragment>
        <DataButtons
          id={id}
          isHandIn={isHandIn}
          openNote={this._handleOpenNote}
        />
        <SingleQA
          changeAnswer={changeAnswer}
          myAnswer={myAnswer}
          id={id}
          question={question}
          options={options}
          isHandIn={isHandIn}
          isNoteOpen={this.state.isNoteOpen}
          openNote={this._handleOpenNote}
        />
      </Fragment>
    );
  }
}
export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yourAnswer: '',
      noteContext: '',
    };
  }
  componentWillMount = () => {
    const { id } = this.props
    this.setState({
      noteContext: getDataFromLocalStorage(id).noteContext
    })
  }
  
  componentDidMount = () => {
    this.questionNote.focus()
  }
  
  _handleEditNote = (e) => {
    const { value } = e.target
    const { id } = this.props
    const thisData = getDataFromLocalStorage(id)
    // get data from local storage
    this.setState({
      noteContext: value,
    })
    setDataToLocalStorage(id, 'noteContext', value)
  }
  _handleOptionTitle = (e) => {
    const optionTitle = e.target.getAttribute('answer')
    this.setState({
      yourAnswer: optionTitle,
    })
    this.props.changeAnswer(e)
  }
  render() {
    const { 
      myAnswer=[], 
      id=1, 
      question='', 
      options=[], 
      isHandIn=false,
      isNoteOpen=false,
      openNote=() => {}
    } = this.props
    const { noteContext } = this.state
    const thisAnswer = myAnswer.filter(a => a.id === id)[0]
    const withABCDoptions = genOptionsWithABCD(options)
    return (
      <Fragment>
        <div className='question-container'>
          <div className='answer-part'>
            <span className={thisAnswer.answer ? 'answer-active' : 'answer-default' }>
              {this.state.yourAnswer || 'your answer'}
            </span>  
          </div>
          <div className='question-part'>
            <form 
              onChange={this._handleOptionTitle} 
              id={id} 
              onSubmit={e => e.preventDefault()}
            >
              {thisAnswer.checked !== 'notYet' ? (thisAnswer.checked ? 
                <span className='checked-text correct-text'>✔</span> : 
                <span className='checked-text false-text'>✘</span> ) 
                : ''
              }
              <p className='question'>{question}</p>
              
              {withABCDoptions.map(op => 
                <label className='options' key={op.id}>
                  <input 
                    type='radio' 
                    name={id} 
                    value={op.options}
                    answer={op.id}
                    disabled={isHandIn} 
                  /> 
                  <span style={{ color: 'blue' }}>{op.id}</span>
                  {' ' + op.options}
                </label>
              )}
            </form>
          </div>
        </div>
        <hr />
        <div className='question-note' style={{ display: isNoteOpen ? 'block' : 'none'}}>
          <textarea onChange={this._handleEditNote} value={noteContext} placeholder='Take your note here.' ref={el => this.questionNote = el}></textarea>
          <button onClick={openNote}>confirm</button>
        </div>
      </Fragment>
    );
  }
}
export class StarButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const { id=0, star=false, starFn=() => {} } = this.props
    return (
      <span onClick={starFn} name={id} className={star ? 'starBTN active' : 'starBTN'}>
        <FontAwesomeIcon icon='star' />
      </span>
    )
  }
}
export class NoteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditNote: false,
      note: '',
    }
  }

  render() {
    const { id=0, noteContext='', noteFn=() => {}, isHandIn, openNote } = this.props
    const { isEditNote } = this.state
    return (
      <Fragment>
        <span className='noteBTN'>
          <FontAwesomeIcon onClick={ isHandIn ? openNote : () => {window.alert('交卷後才能記筆記~')}} name={id} icon='edit' />
        </span>
        <div className='noteBTN-container' style={{display: isEditNote ? 'block' : 'none',  width: 400 }}>
          <textarea 
            name={id}
            className='note-noteBTN'
            onChange={noteFn}
            value={noteContext}
          />
          <button onClick={openNote}>confirm</button>
        </div>
      </Fragment>
    );
  }
}

const StarWithHint = HOCwithHint(StarButton, '收藏題目', '已收藏')
const NoteWithHint = HOCwithHint(NoteButton, '紀錄筆記')

export class DataButtons extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      star: false,
      noteContext: '',
    }
  }
  setDataFromLS = () => {
    const { id } = this.props
    const thisData = getDataFromLocalStorage(id)
    // get data from local storage
    this.setState({
      id: thisData.id,
      star: thisData.star,
      noteContext: thisData.noteContext,
    })
    // console.log(thisData)
  }
  componentWillMount = () => {
    this.setDataFromLS()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.id !== this.state.id) {
      this.setDataFromLS()
    }
  }
  _handleStar = () => {
    const { id, star, } = this.state
    this.setState({
      star: !this.state.star
    })
    setDataToLocalStorage(id, 'star', !star)
  }
  render() {
    const { id, star, noteContext } = this.state
    const { isHandIn, openNote } = this.props
    return (
      <div className='star-note-buttons'>
        <StarWithHint
          id={id}
          star={star}
          isActive={star}
          starFn={this._handleStar}
        />
        <NoteWithHint
          id={id}
          noteContext={noteContext}
          noteFn={this._handleEditNote}
          isHandIn={isHandIn}
          openNote={openNote}
        />
      </div>
    );
  }
}



// export const TxtWithBTN = WithButtonHOC(TxtDiv, 'Hello', clickAlert)
