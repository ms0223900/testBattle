/* eslint-disable no-unused-vars */
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEdit, faArrowRight, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { WholeTestPaper, SingleTestPaper } from './TestPaper'
import { 
  getAllOrStarData,
  setValueOfArrObj,
  activeButton,
  filterArrWithProperty,
  filterArrObjWithArr
  } from './functions'
import CreateQAPanel from './createQA'
import '../styles/style.scss'

library.add(faStar, faEdit, faArrowRight, faPlusCircle)


const intervalBetweenQuestions = 1000

export const getRandomId = (prevId=0) => {
  let id = Math.random()
  while(id === prevId) {
    id = Math.random()
  }
  return id
}

export const getDataByMode = (testMode='all', testAmount=5, testQAData=[], ) => {
  const recordFromLS = JSON.parse(localStorage.getItem('starAndNote')) || [{}]
  let recordQuestions = recordFromLS ? recordFromLS : []
  const filterWithRecordArr = filterArrWithProperty(testQAData, recordQuestions, 'id')

  switch (testMode) {
    case 'star':
      return getAllOrStarData(true, testAmount, testQAData, true)
    case 'all':
      return getAllOrStarData(false, testAmount, testQAData, true)
    case 'notSame': {
      const filteredTestQAByRecord = filterArrObjWithArr(testQAData, filterWithRecordArr, 'id', true)
      console.log(filteredTestQAByRecord)
      return getAllOrStarData(false, testAmount, filteredTestQAByRecord, true)
    }
    default:
      return getAllOrStarData(false, testAmount, testQAData, true)
  }
}
export const filterCorrectAns = (ans) => (
  ans.map(a => a = {...a, checked: a.answer === a.correctAnswer ? true : false })
)
export const ChangeModeBTN = ({ id, clickFn, stateOfMode, btnText='', filterText='' }) => {
  const text = filterText === '' ? id : id.replace(filterText, '')
  return (
    <button 
      id={id} 
      style={activeButton(stateOfMode, text)}
      onClick={clickFn} >
      {btnText}
    </button>
  )
}
export const TabMenu = ({testModeState, testModeFn, answerModeState, answerModeFn, testAmount, changeAmountFn}) => (
  <div>
    <ChangeModeBTN id={'all'} clickFn={testModeFn} stateOfMode={testModeState} btnText={'從全部考題隨機出題'}  />
    <ChangeModeBTN id={'notSame'} clickFn={testModeFn} stateOfMode={testModeState} btnText={'從沒出過的考題隨機出題'}  />
    <ChangeModeBTN id={'star'} clickFn={testModeFn} stateOfMode={testModeState} btnText={'從收藏出題'}  />
    <span>   </span>
    <input type='number' value={ testAmount } onChange={changeAmountFn} />
    <ChangeModeBTN id={'answer-single'} clickFn={answerModeFn} stateOfMode={answerModeState} btnText={'單題模式'} filterText={'answer-'} />
    <ChangeModeBTN id={'answer-all'} clickFn={answerModeFn} stateOfMode={answerModeState} btnText={'試卷模式'} filterText={'answer-'} />
  </div>
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
      answerMode: 'single',
      singleAnswerModeState: {
        index: 0,
        idArr: []
      },
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
  _handleChangeAnswerMode = (e, state) => {
    const { id } = e.target
    const mode = id.replace('answer-', '')
    this.setState({
      answerMode: mode,
      // testQA: [],
    })
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
    if(id !== this.state.testMode) {
      this.setState({
        testMode: id,
      })
    }
  }
  _handleTestPaper = () => {
    const { testMode, testAmount, allTestQA, myAnswer } = this.state
    // if(this.testPaper) {
    //   this.setState({ 
    //     myAnswer: myAnswer.map(a => a = {
    //        ...a, 
    //        answer: '',
    //        checked: 'notYet'
    //     }),
    //   })
    // }
    const testQAdata = getDataByMode(testMode, testAmount, allTestQA)
    this.setState(state =>({
      isHandIn: false,
      isCheckCorrectAns: false,
      keyId: getRandomId(state.keyId), 
      testQA: testQAdata,
      myAnswer: myAnswer.map(my => my = { ...my,  
        answer: '', checked: 'notYet', }),
      singleAnswerModeState: {
        index: 0,
        idArr: testQAdata.map(t => t = t.id),
      }
    }))
  }
  _handleCheckAnswer = () => {
    const { myAnswer, answerMode, singleAnswerModeState } = this.state
    const singleAnswerModeId = singleAnswerModeState.idArr[singleAnswerModeState.index]
    let checkedAnswer
    if(answerMode === 'all') { 
      checkedAnswer = filterCorrectAns(myAnswer)
      this.setState({
        isHandIn: true,
        myAnswer: checkedAnswer
      })
    } else if(answerMode === 'single') {
      if(singleAnswerModeState.index < singleAnswerModeState.idArr.length) {
        checkedAnswer = [ ...myAnswer.filter(m => m.id !== singleAnswerModeId ), filterCorrectAns(myAnswer.filter(m => m.id === singleAnswerModeId ))[0] ]
        this._handleToNextQuestion()
        this.setState({
          myAnswer: checkedAnswer
        })
      }
    }
    
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
  _handleToNextQuestion = () => {
    const { singleAnswerModeState } = this.state
    setTimeout(() => {
      const nextIndex = singleAnswerModeState.index + 1
      if(nextIndex > singleAnswerModeState.idArr.length - 1) {
        this.setState({
          isHandIn: true,
        })
      } else {
        this.setState({
          singleAnswerModeState: {
            ...singleAnswerModeState,
            index: nextIndex,
          }
        })
      }
    }, intervalBetweenQuestions);
    
    console.log(this.state.singleAnswerModeState.index)
  }
  render() {
    const { myAnswer, isHandIn, testAmount, keyId, testQA=[], viewMyNote, noteContent, isCheckCorrectAns, answerMode, singleAnswerModeState, testMode } = this.state
    console.log(myAnswer)
    return (
      <div>
        <div className='tab-menu'>
          <div>
            <TabMenu
              testModeState={testMode}
              testModeFn={this._handleChangeMode}
              answerModeState={answerMode}
              answerModeFn={this._handleChangeAnswerMode}
              testAmount={testAmount}
              changeAmountFn={this._handleChangeAmout}
            />
            <button onClick={this._handleTestPaper}>出題！！</button>
          </div>
          <div>
            <button onClick={this._handleOpenNote}>查看我的筆記</button>
          </div>
        </div>
        <hr />
        <div >
          {answerMode === 'single' ? (
            <SingleTestPaper
              key={keyId} 
              testQA={testQA} 
              myAnswer={myAnswer} 
              isHandIn={isHandIn} 
              isCheckCorrectAns={isCheckCorrectAns}
              changeAnswer={this._handleChangeAnswer}
              checkAnswer={this._handleCheckAnswer}
              checkCorrectAnswer={this._handleCheckCorrectAnswer}
              singleAnswerModeState={singleAnswerModeState}
            />
          ) : (
            <WholeTestPaper
              key={keyId} 
              testQA={testQA} 
              myAnswer={myAnswer} 
              isHandIn={isHandIn} 
              isCheckCorrectAns={isCheckCorrectAns}
              changeAnswer={this._handleChangeAnswer}
              checkAnswer={this._handleCheckAnswer}
              checkCorrectAnswer={this._handleCheckCorrectAnswer} 
            />
          ) }
         
        </div>
        <CreateQAPanel oldData={this.state.allTestQA} />
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