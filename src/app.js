/* eslint-disable no-unused-vars */
import React from 'react'
import { SingleQA, DataButtons } from './singleQA'
import { 
  getAllOrStarData,
  setValueOfArrObj,
  activeButton,
  } from './functions'
import { testQAs } from './QAs'
import '../styles/style.scss'

// let starLS = localStorage.getItem('starID')
// let noteLS = localStorage.getItem('IdNote')
// console.log(JSON.parse(noteLS))
const LS = localStorage


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [],
      isHandIn: false,
      allTestQA: [],
      testQA: [],
      testAmount: 20,
      testMode: 'all',
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
          console.log(LSdata)
          for (let i = 0; i < LSdata.length; i++) {
            setData = setValueOfArrObj(setData, LSdata[i].id, 'star', LSdata[i].star)
          }
        }
        console.log(setData)
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
    console.log(mode)
  }
  _handleTestPaper = () => {
    const { testMode, testAmount, allTestQA } = this.state
    const star = testMode === 'star' ? true : false
    this.setState({
      testQA: getAllOrStarData(star, testAmount, allTestQA, true)
    })
  }

  _handelStaredQuestion = () => {
    
  }
  _handleCheckAnswer = () => {
    const { myAnswer } = this.state
    const checkedAnswer = myAnswer.map(a => a = {...a, checked: a.answer === a.correctAnswer ? true : false })
    console.log(checkedAnswer)
    this.setState({
      isHandIn: true,
      myAnswer: checkedAnswer
    })
  }
  _handleChangeAnswer = (e) => {
    const { myAnswer, isHandIn } = this.state
    const { name, value } = e.target
    console.log(name, value)
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

  render() {
    console.log(this.state.myAnswer)
    const { myAnswer, isHandIn, testAmount, questionData, testQA=[] } = this.state
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
        <div id='test-paper' className='half paper'>
          {testQA.map(qa =>
            <React.Fragment> 
              <SingleQA
                key={qa.id}
                changeAnswer ={this._handleChangeAnswer}
                starIt={this._handelStar}
                myAnswer={myAnswer}
                questionData={questionData}
                id={qa.id}
                question={qa.question}
                options={qa.options}
                isHandIn={isHandIn}
              />
              <DataButtons id={qa.id} />
              <hr />
            </React.Fragment>
          )}
          {/* <hr /> */}
        
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