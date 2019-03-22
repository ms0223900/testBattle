/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import { TestPaper } from './TestPaper'
import { 
  getAllOrStarData,
  setValueOfArrObj,
  activeButton,
  } from './functions'
import { testQAs } from './QAs'
import '../styles/style.scss'

const defaultKeyId = 0
export const getRandomId = (prevId=0) => {
  let id = Math.random()
  while(id === prevId) {
    id = Math.random()
  }
  return id
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [],
      isHandIn: false,
      allTestQA: [],
      testQA: [],
      testAmount: 5,
      testMode: 'all',
      isNew: false,
      keyId: 0,
    }
  }
  componentWillMount = () => {
    // const updateFromLS_QAs = QAs.map(qa => qa = qa)
    fetch('../src/QAfiles/QA01.json')
      .then(txt => txt.json())
      .then(json => {
        const Q = json.map(q => q = {
          id: q.id, 
          answer: '', 
          correctAnswer: q.answer, 
          checked: 'notYet',
        })
        const LSdata = JSON.parse(localStorage.getItem('starAndNote'))
        let setData = json
        if(LSdata) {
          for (let i = 0; i < LSdata.length; i++) {
            setData = setValueOfArrObj(setData, LSdata[i].id, 'star', LSdata[i].star)
          }
        }
        this.setState({
          allTestQA: setData,
          myAnswer: Q
        })
      })
      .catch(err => {})
  }
  componentDidMount = () => {
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
    const { testMode, testAmount, allTestQA } = this.state
    const star = testMode === 'star' ? true : false
    this.setState(state =>({
      keyId: getRandomId(state.keyId), 
      testQA: getAllOrStarData(star, testAmount, allTestQA, true)
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
    console.log(name)
    const changedAns = setValueOfArrObj(myAnswer, name, 'answer', value)
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

  render() {
    const { myAnswer, isHandIn, testAmount, keyId, testQA=[] } = this.state
    console.log('//------')
    return (
      <div>
        <div className='tab-menu'>
          <button 
            id='testMode-all' 
            style={activeButton(this.state.testMode, 'all')}
            onClick={this._handleChangeMode} >
            從全部考題出題
          </button>
          <button 
            id='testMode-star' 
            style={activeButton(this.state.testMode, 'star')}
            onClick={this._handleChangeMode} >
            從收藏出題
          </button>
          <span>   </span>
          <input type='number' value={ testAmount } onChange={this._handleChangeAmout} />
          <button onClick={this._handleTestPaper}>出題！！</button>
          <button>查看我的筆記</button>
        </div>
        <hr />
        <div>
          <TestPaper
            key={keyId} 
            ref={el => this.testPaper = el}
            testQA={testQA} 
            myAnswer={myAnswer} 
            isHandIn={isHandIn} 
            changedAnswer={this._handleChangeAnswer} /> 
          <hr />
          <button onClick={this._handleCheckAnswer}>Check Answer!</button>
          <h4>SCORE: 
            <span>
            { isHandIn ? ~~(myAnswer.filter(a => a.checked).length / myAnswer.length * 100) : '' }</span> </h4>
        </div>
        <div className='half'>
          <h2>My Note</h2>
          <textarea>

          </textarea>
        </div>
      </div>
    );
  }
}