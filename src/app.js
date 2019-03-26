/* eslint-disable no-unused-vars */
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEdit, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { TestPaper } from './TestPaper'
import { 
  getAllOrStarData,
  setValueOfArrObj,
  activeButton,
  filterArrWithProperty,
  } from './functions'
import '../styles/style.scss'
import { labeledStatement } from '@babel/types';

library.add(faStar, faEdit, faArrowRight)


export const getRandomId = (prevId=0) => {
  let id = Math.random()
  while(id === prevId) {
    id = Math.random()
  }
  return id
}
export const ChangeModeBTN = ({ id, clickFn, stateOfMode, btnText='' }) => (
  <button 
    id={`testMode-${id}`} 
    style={activeButton(stateOfMode, id)}
    onClick={clickFn} >
    {btnText}
  </button>
)
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [{ }],
      isHandIn: false,
      isCheckCorrectAns: false,
      allTestQA: [],
      testQA: [],
      testAmount: 5,
      testMode: 'all',
      keyId: 0,
      viewMyNote: false,
      noteContent: '',
    }
    this.noteArea = null
  }
  componentWillMount = () => {
    // const updateFromLS_QAs = QAs.map(qa => qa = qa)
    fetch('../src/QAfiles/QA01.json')
      .then(txt => txt.json())
      .then(json => {
        const LSdata = JSON.parse(localStorage.getItem('starAndNote'))
        let setData = json
        if(LSdata) {
          for (let i = 0; i < LSdata.length; i++) {
            setData = setValueOfArrObj(setData, LSdata[i].id, 'star', LSdata[i].star)
          }
        }
        const Q = setData.map(q => q = {
          id: q.id, 
          answer: '', 
          correctAnswer: q.correctAnswer, 
          checked: 'notYet',
        })
        this.setState({
          allTestQA: setData,
          myAnswer: Q
        })
      })
      .catch(err => {})
      if(!localStorage.getItem('noteContent')) {
        localStorage.setItem('noteContent', '')
      }
      const latestNoteContent = localStorage.getItem('noteContent')
      this.setState({
        noteContent: latestNoteContent,
      })
  }
  componentDidMount = () => {
    
  }
  
  _handleOpenNote = () => {
    if(this.state.isHandIn) {
      this.setState(state => ({
        viewMyNote: !state.viewMyNote,
      }))
    }
    // console.log(this.state.viewMyNote)
  }
  _handleChangeNote = (e) => {
    const { value } = e.target
    this.setState({
      noteContent: value
    })
    localStorage.setItem('noteContent', value)
  }
  _handleChangeMode = (e) => {
    const { id } = e.target
    const mode = id.slice(9)
    if(mode !== this.state.testMode) {
      this.setState({
        testMode: mode,
      })
    }
  }
  _handleTestPaper = () => {
    const { testMode, testAmount, allTestQA, myAnswer } = this.state
    const recordFromLS = JSON.parse(localStorage.getItem('starAndNote'))
    let recordQuestions = recordFromLS ? recordFromLS : []
    const filterWithRecord = filterArrWithProperty(allTestQA, recordQuestions, 'id')
    console.log(filterWithRecord)

    if(this.testPaper) {
      this.setState({ 
        myAnswer: myAnswer.map(a => a = {
           ...a, 
           answer: '',
           checked: 'notYet'
        }),
      })
    }
    let testQAdata
    switch (testMode) {
      case 'star':
        testQAdata = getAllOrStarData(true, testAmount, allTestQA, true) 
        break
      case 'all':
        testQAdata = getAllOrStarData(false, testAmount, allTestQA, true) 
        break
      // case 'notSame':
      //   testQAdata = getAllOrStarData(false, testAmount, allTestQA, true).filter(ge => ge.id !== filterWithRecord) 
      //   break
      default:
        testQAdata = getAllOrStarData(false, testAmount, allTestQA, true)
        break
    }
    this.setState(state =>({
      isHandIn: false,
      keyId: getRandomId(state.keyId), 
      testQA: testQAdata,
    }))
  }
  _handleCheckAnswer = () => {
    const { myAnswer } = this.state
    const checkedAnswer = myAnswer.map(a => a = {...a, checked: a.answer === a.correctAnswer ? true : false })
    this.setState({
      isHandIn: true,
      myAnswer: checkedAnswer
    })
  }
  _handleChangeAnswer = (e) => {
    const { myAnswer, isHandIn } = this.state
    const { name, value } = e.target
    console.log(e.target.getAttribute('answer'))
    // console.log(answer)
    const changedAns = setValueOfArrObj(myAnswer, name, 'answer', value)
    console.log(changedAns)
    if(!isHandIn) {
      this.setState({
        myAnswer: changedAns
      })
    }
  }
  _handleChangeAmout = (e) => {
    this.setState({
      testAmount: e.target.value
    })
  }
  _handleCheckCorrectAnswer = () => {
    this.setState(state => ({
      isCheckCorrectAns: !state.isCheckCorrectAns,
    }))
  }
  render() {
    const { myAnswer, isHandIn, testAmount, keyId, testQA=[], viewMyNote, noteContent, isCheckCorrectAns } = this.state
    return (
      <div>
        <div className='tab-menu'>
          <div>
            <ChangeModeBTN id={'all'} clickFn={this._handleChangeMode} stateOfMode={this.state.testMode} btnText={'從全部考題隨機出題'}  />
            <ChangeModeBTN id={'notSame'} clickFn={this._handleChangeMode} stateOfMode={this.state.testMode} btnText={'從沒出過的考題隨機出題'}  />
            <ChangeModeBTN id={'star'} clickFn={this._handleChangeMode} stateOfMode={this.state.testMode} btnText={'從收藏出題'}  />
            <span>   </span>
            <input type='number' value={ testAmount } onChange={this._handleChangeAmout} />
            <button onClick={this._handleTestPaper}>出題！！</button>
          </div>
          <div>
            <button onClick={this._handleOpenNote}>查看我的筆記</button>
          </div>
        </div>
        <hr />
        <div >
          <TestPaper
            key={keyId} 
            ref={el => this.testPaper = el}
            testQA={testQA} 
            myAnswer={myAnswer} 
            isHandIn={isHandIn} 
            isCheckCorrectAns={isCheckCorrectAns}
            changeAnswer={this._handleChangeAnswer}
            checkAnswer={this._handleCheckAnswer}
            checkCorrectAnswer={this._handleCheckCorrectAnswer} />
        </div>
        <div id='myNote' style={{ display: viewMyNote ? 'block' : 'none' }}>
          <h2>My Note  
            <span className='back-icon' onClick={this._handleOpenNote}><FontAwesomeIcon icon={'arrow-right'} /></span>
          </h2>
          <textarea onChange={this._handleChangeNote} placeholder='write your note here~' value={noteContent} ref={el => this.noteArea = el}>

          </textarea>
        </div>
      </div>
    );
  }
}