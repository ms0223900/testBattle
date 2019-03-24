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
export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditNote: false,
      yourAnswer: '',
    };
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
    } = this.props
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
              <h3> <span>{thisAnswer.checked !== 'notYet' ? (thisAnswer.checked ? '✔' : '✘') : ''}</span> </h3>
              <p className='question'>{question}</p>
              
              {withABCDoptions.map(op => 
                <label className='options'>
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
  _handleOpenNote = () => {
    this.setState((state) => ({
      isEditNote: !state.isEditNote
    }))
  }

  render() {
    const { id=0, noteContext='', noteFn=() => {}, isHandIn } = this.props
    const { isEditNote } = this.state
    return (
      <Fragment>
        <span className='noteBTN'>
          <FontAwesomeIcon onClick={ isHandIn ? this._handleOpenNote : () => {window.alert('交卷後才能記筆記~')}} name={id} icon='edit' />
        </span>
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
    const { isHandIn } = this.props
    return (
      <div className='star-note-buttons'>
        <StarButton
          id={id}
          star={star}
          starFn={this._handleStar}
        />
        <NoteButton
          id={id}
          noteContext={noteContext}
          noteFn={this._handleEditNote}
          isHandIn={isHandIn}
        />
      </div>
    );
  }
}


// export const TxtWithBTN = WithButtonHOC(TxtDiv, 'Hello', clickAlert)
