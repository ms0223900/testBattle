import React, { Fragment } from 'react'
import { setValueOfArrObj } from './functions'
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
export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditNote: false,
    };
  }
  render() {
    const { 
      changeAnswer,
      myAnswer=[], 
      id=1, 
      question='', 
      options=[], 
      isHandIn=false,
    } = this.props
    const thisAnswer = myAnswer.filter(a => a.id === id)[0]
    console.log(thisAnswer)
    return (
      <Fragment>
        <div className='question-container'>
          <div className='answer-part'>
            <span className={thisAnswer.answer ? 'answer-active' : 'answer-default' }>
              {thisAnswer.answer || 'your answer'}
            </span>  
          </div>
          <div className='question-part'>
            <form 
              onChange={changeAnswer} 
              id={id} 
              onSubmit={e => e.preventDefault()}
            >
              <h3>{id} <span>{thisAnswer.checked !== 'notYet' ? (thisAnswer.checked ? '✔' : '✘') : ''}</span> </h3>
              <p className='question'>{question}</p>
              
              {options.map(op => 
                <label className='options'>
                  <input 
                    type='radio' 
                    name={id} 
                    value={op}
                    disabled={isHandIn} 
                  /> {op}
                </label>
              )}
            </form>
          </div>
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
      <Fragment>
        <button 
          onClick={starFn} 
          name={id} 
          style={ star === true ? starBTN.active : starBTN.normal} 
        >
          STAR
        </button>
      </Fragment>
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
  _handleOpenNote = () => {
    this.setState((state) => ({
      isEditNote: !state.isEditNote
    }))
  }

  render() {
    const { id=0, noteContext='', noteFn=() => {} } = this.props
    const { isEditNote } = this.state
    return (
      <Fragment>
        <button onClick={this._handleOpenNote} name={id} >NOTE</button>
        <form>
          <textarea 
            name={id}
            onChange={noteFn}
            value={noteContext}
            style={{display: isEditNote ? 'block' : 'none',  width: 400, height: 100 }}
          />
        </form>
      </Fragment>
    );
  }
}
export class DataButtons extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 0,
      star: false,
      noteContext: '',
    }
  }
  componentWillMount = () => {
    const { id } = this.props
    const thisData = getDataFromLocalStorage(id)
    // get data from local storage
    this.setState({
      id: thisData.id,
      star: thisData.star,
      noteContext: thisData.noteContext,
    })
    console.log(thisData)
  }
  
  _handleStar = () => {
    const { id, star, } = this.state
    this.setState({
      star: !this.state.star
    })
    setDataToLocalStorage(id, 'star', !star)
  }
  _handleEditNote = (e) => {
    const { id, } = this.state
    const { value } = e.target
    this.setState({
      noteContext: value,
    })
    setDataToLocalStorage(id, 'noteContext', value)
  }
  render() {
    const { id, star, noteContext } = this.state
    return (
      <div>
        <StarButton
          id={id}
          star={star}
          starFn={this._handleStar}
        />
        <NoteButton
          id={id}
          noteContext={noteContext}
          noteFn={this._handleEditNote}
        />
      </div>
    );
  }
}


// export const TxtWithBTN = WithButtonHOC(TxtDiv, 'Hello', clickAlert)
