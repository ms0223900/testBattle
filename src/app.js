/* eslint-disable no-unused-vars */
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEdit, faArrowRight, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { 
  getAllOrStarData,
  setValueOfArrObj,
  activeButton,
  filterArrWithProperty,
  filterArrObjWithArr,
  getNoSameArr,
  } from './functions'
import { WholeTestPaper, SingleTestPaper } from './TestPaper'
import { SelectMenuBar } from './selectDatabase'
import CreateQAPanel from './createQA'
import Timer from './Timer'
import Game, { database } from './avatar'
import { REF } from '../config'


import { en_US, zh_TW } from './lang'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh'
addLocaleData([...en,...zh])
import '../styles/style.scss'

library.add(faStar, faEdit, faArrowRight, faPlusCircle)

const QAfileDir = 'https://raw.githubusercontent.com/ms0223900/testBattle/master/QAfiles/Nihongo.json'
const intervalBetweenQuestions = 1000
const testTime = 300
const coinImg = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/Retro-Coin.png'

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
export const getFetchQA = (QAfile) => (
  fetch(QAfile)
  .then(txt => txt.json())
  .then(json => new Promise(
    res => res(json),
    rej => console.log(rej)
  ))
  .catch(err => {})
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


export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [{ }],
      isHandIn: false,
      isCheckCorrectAns: false,
      isStart: false,
      time: 300,
      coin: 0,
      allTestQA: [],
      filterAllTestQA: [],
      testRecord:[],
      allTestFilterConditions: [],
      nowFIlterCondition: [],
      testQA: [],
      testAmount: 10,
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
    this.testRecordTemp = [{
      testId: 0,
      testDataRecord: { 
        idArr: [0], 
        ansArr: [ {answer: 'A', correctAnswer: ''} ] , 
      }
    }]
    this.noteArea = null
  }
  componentWillMount = () => {
    // const updateFromLS_QAs = QAs.map(qa => qa = qa)
    // database.ref(REF).on('value', data => {
    //   const LSdata = JSON.parse(localStorage.getItem('starAndNote'))
    //   let setData = data.val()
    //   if(LSdata) {
    //     for (let i = 0; i < LSdata.length; i++) {
    //       setData = setValueOfArrObj(setData, LSdata[i].id, 'star', LSdata[i].star)
    //     }
    //   }
    //   const Q = setData.map(q => q = {
    //     id: q.id, 
    //     answer: '', 
    //     correctAnswer: q.correctAnswer, 
    //     checked: 'notYet',
    //   })
    //   this.setState({
    //     allTestQA: setData,
    //     filterAllTestQA: setData,
    //     myAnswer: Q,
    //     allTestFilterConditions: getNoSameArr(setData.map(s => s = s.databaseSort || ''))
    //   })
    //   console.log(getNoSameArr(setData.map(s => s = s.databaseSort || '')))
    // })
    
   
    // if(!localStorage.getItem('noteContent')) {
    //   localStorage.setItem('noteContent', '')
    // }
    // if(!localStorage.getItem('coin')) {
    //   localStorage.setItem('coin', 0)
    // }
    // const coin = localStorage.getItem('coin') * 1
    // const latestNoteContent = localStorage.getItem('noteContent')
    // this.setState({
    //   noteContent: latestNoteContent,
    //   coin: coin,
    // })
  }
  setTestRecord = () => {
    const { testRecord, testQA, myAnswer } = this.state
    const lastRecord = testRecord[testRecord.length - 1]
    const checkedAnswer = filterCorrectAns(myAnswer)
    this.setState({
      testRecord: [...testRecord, {
        testId: testRecord.length === 0 ? 0 : lastRecord.testId + 1,
        testDataRecord: { 
          idArr: [...testQA.map(te => te = te.id)], 
          ansArr: [ ...checkedAnswer ], 
        }
      }],
    })
  }
  _handleSetCoin = (coin) => {
    const { coin: originCoin } = this.state
    const resultCoin = originCoin * 1 + coin
    localStorage.setItem('coin', resultCoin)
    this.setState({
      coin: resultCoin,
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
    const { testMode, testAmount, filterAllTestQA, myAnswer } = this.state
    // if(this.testPaper) {
    //   this.setState({ 
    //     myAnswer: myAnswer.map(a => a = {
    //        ...a, 
    //        answer: '',
    //        checked: 'notYet'
    //     }),
    //   })
    // }
    const testQAdata = getDataByMode(testMode, testAmount, filterAllTestQA)
    this.setState(state =>({
      isHandIn: false,
      isStart: true,
      time: testTime,
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
  _handleCheckAnswer = (isOver=false) => {
    const { isHandIn, testQA, myAnswer, answerMode, singleAnswerModeState, testRecord, isStart } = this.state
    const singleAnswerModeId = singleAnswerModeState.idArr[singleAnswerModeState.index]
    
    console.log(testRecord.length)
    let checkedAnswer
    if(!isHandIn) {
      if(answerMode === 'all') { 
        checkedAnswer = filterCorrectAns(myAnswer)
        this.setState({
          isHandIn: true,
          isStart: false,
          myAnswer: checkedAnswer,
        })
        this.setTestRecord()
      } else if(answerMode === 'single') {
        if(singleAnswerModeState.index < singleAnswerModeState.idArr.length) {
          checkedAnswer = isOver ? 
            filterCorrectAns(myAnswer) : 
            [ ...myAnswer.filter(m => m.id !== singleAnswerModeId ), filterCorrectAns(myAnswer.filter(m => m.id === singleAnswerModeId ))[0] ]
          this._handleToNextQuestion(isOver)
          this.setState({
            myAnswer: checkedAnswer,
            isHandIn: isOver ? !isHandIn : isHandIn
          })
        }
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
  _handleToNextQuestion = (isOver=false) => {
    const { singleAnswerModeState } = this.state
    setTimeout(() => {
      const nextIndex = isOver ? singleAnswerModeState.idArr.length : singleAnswerModeState.index + 1
      if(nextIndex > singleAnswerModeState.idArr.length - 1) {
        this.setState({
          isHandIn: true,
          isStart: false,
        })
        this.setTestRecord()
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
  _handleChangeSelectDatabase = (e) => {
    const { nowFIlterCondition, allTestQA, filterAllTestQA } = this.state
    const { value } = e.target
    const result = [...nowFIlterCondition, value]
    const singleFilterResult = allTestQA.filter(a => a.databaseSort === value)
    const testFilterResult = nowFIlterCondition.length === 0 ? singleFilterResult :  [...filterAllTestQA , ...singleFilterResult]

    if(nowFIlterCondition.indexOf(value) === -1) {
      this.setState(state => ({
        nowFIlterCondition: result,
        filterAllTestQA: testFilterResult,
      }))
    }
  }
  _handleDeleteSelectDatabase = (e) => {
    const { allTestQA, nowFIlterCondition, filterAllTestQA } = this.state
    const name = e.target.getAttribute('name')
    const deletedArr = nowFIlterCondition.filter(s => s !== name)
    const testFilterResult = filterAllTestQA.filter(f => f.databaseSort !== name)
    const filterResult = testFilterResult.length === 0 ? allTestQA : testFilterResult
    this.setState({
      nowFIlterCondition: deletedArr,
      filterAllTestQA: filterResult,
    })
  }
  _handleViewTestRecord = (e) => {
    const { allTestQA, testRecord } = this.state
    const thatId = e.target.getAttribute('name') * 1
    const filterRecord = testRecord.filter(te => te.testId === thatId)[0]
    console.log(filterRecord)
    this.setState({
      answerMode: 'all',
      testQA: filterArrObjWithArr(allTestQA, filterRecord.testDataRecord.idArr, 'id'),
      myAnswer: filterRecord.testDataRecord.ansArr,
      isHandIn: true,
    })
  }
  _handleTimerStart = () => {
    const { isStart, isHandIn, testQA } = this.state
    if(testQA.length > 0 && !isHandIn) {
      this.setState({
        isStart: !isStart,
      })
    }
  }
  _handleBuying = (price=10) => {
    const resCoin = this.state.coin - price
    if(resCoin > 0) {
      this.setState({
        coin: resCoin
      })
      return true
    } else {
      window.alert('money is not enough~')
      return false
    }
  }
  render() {
    const { myAnswer, isHandIn, testAmount, keyId, testQA=[], viewMyNote, noteContent, isCheckCorrectAns, answerMode, singleAnswerModeState, testMode, allTestFilterConditions, nowFIlterCondition, testRecord, isStart, time, coin } = this.state
    return (
      <div>
        <div className='tab-menu'>
          <div>
            <h3>選擇題庫</h3>
            <SelectMenuBar 
              allTestFilterConditions={allTestFilterConditions} 
              nowFIlterCondition={nowFIlterCondition} 
              changeSelectDatabase={this._handleChangeSelectDatabase} 
              deleteSelectDatabase={this._handleDeleteSelectDatabase} 
            />
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
          <div>
            <img className={'coin-img'} src={coinImg} />
            <span> {' X ' + coin} </span>
          </div>
        </div>
        <hr />

        <Timer 
            time={time} 
            isStart={isStart} 
            isHandIn={isHandIn}
            timerStartPause={this._handleTimerStart}
            overAndCheckAns={this._handleCheckAnswer}
          />
        <div className='test-paper-container'>
          { isStart || isHandIn ? answerMode === 'single' ? (
            <SingleTestPaper
              key={keyId} 
              testQA={testQA} 
              myAnswer={myAnswer} 
              isHandIn={isHandIn} 
              isCheckCorrectAns={isCheckCorrectAns}
              changeAnswer={this._handleChangeAnswer}
              checkAnswer={this._handleCheckAnswer.bind(this, false)}
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
          ) : '不給你看'}
        </div>
        <div className='test-record-container'>
          {testRecord.map(te => (
            <div onClick={this._handleViewTestRecord} name={te.testId} key={te.testId}>{'test record ' + te.testId}</div>
          ))}
        </div>
        <CreateQAPanel 
          setCoin={this._handleSetCoin}
          oldData={this.state.allTestQA} 
        />
        <div id='myNote' style={{ display: viewMyNote ? 'block' : 'none' }}>
          <h2>My Note  
            <span className='back-icon' onClick={this._handleOpenNote}><FontAwesomeIcon icon={'arrow-right'} /></span>
          </h2>
          <textarea onChange={this._handleChangeNote} placeholder='write your note here~' value={noteContent} ref={el => this.noteArea = el}>

          </textarea>
        </div>
        <FormattedMessage 
          id={'hello'}
          
        />
        <Game 
          // coin={coin}
          buy={this._handleBuying}
          setCoin={this._handleSetCoin}
        />
        <button onClick={this.props.changeLang}>Change Lang</button>
      </div>
    );
  }
}
export class HOCIntlApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'zh',
    };
  }
  chooseLang = (lang) => {
    switch (lang) {
      case 'en':
        return en_US
      case 'zh':
        return zh_TW
      default:
        return en_US
    }
  }
  _handleChangeLang = () => {
    this.setState({
      lang: this.state.lang === 'en' ? 'zh' : 'en'
    })
  }
  render() {
    const { lang } = this.state
    return (
      <IntlProvider locale={lang} key={lang} messages={this.chooseLang(lang)}>
        <App changeLang={this._handleChangeLang}/>
      </IntlProvider>
    );
  }
}
// export const HOCApp = <HOCIntlApp></HOCIntlApp>