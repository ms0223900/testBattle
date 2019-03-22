import React from 'react'
import { SingleQA, DataButtons } from './singleQA'
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
      updatedQAs: LS.getItem('QAstorge') ? JSON.parse(LS.getItem('QAstorge')) : testQAs,
      isHandIn: false,
      testQA: [],
      testAmount: 20,
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
          star: q.star,
          note: q.note,
        })
        this.setState({
          testQA: json,
          myAnswer: Q
        })
      })
      .catch(err => {})
    if(!LS.getItem('QAstorge')) {
      LS.setItem('QAstorge', JSON.stringify(testQAs))
    }
  }
  componentDidMount = () => {
  }
  
  generateTestPaper = (e) => {
    const { id } = e.target
    const { testAmount, testQA } = this.state
    let QAs
    if(id === 'testAll') {
      QAs = testQA.slice(0, testAmount)
    } else if(id === 'testStar') {
      QAs = testQA.filter(qa => qa.star === true).slice(0, testAmount)
    }
    this.setState({
      testQA: QAs,
    })
  }

  _handelStaredQuestion = () => {
    
  }
  _handelEditNote = (e) => {
    const { myAnswer, updatedQAs } = this.state
    const { name, value } = e.target
    const notedQAs = setValueOfArrObj(updatedQAs, name, 'note', value)
    this.setState({
      myAnswer:  setValueOfArrObj(myAnswer, name, 'note', value)
    })
    localStorage.setItem('QAstorge', JSON.stringify(notedQAs))
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
  // _handelStar = (e) => {
  //   const { myAnswer, updatedQAs } = this.state
  //   const { name } = e.target


  //   const staredMyAnswer = setValueOfArrObj(myAnswer, name, 'star', false)
  //   const staredQAs = setValueOfArrObj(updatedQAs, name, 'star', false)
  //   this.setState({
  //     myAnswer: staredMyAnswer,
  //     updatedQAs: staredQAs,
  //   })
  //   console.log(staredQAs)
  //   localStorage.setItem('QAstorge', JSON.stringify(staredQAs))
  // }

  render() {
    console.log(this.state.myAnswer)
    const { myAnswer, isHandIn, testAmount, questionData } = this.state
    return (
      <div>
        <div className='tab-menu'>
          <button id='testAll'>從收藏出題</button>
          <button id='testStar'>從全部考題出題</button>
          <span>   </span>
          <input type='number' value={ testAmount } onChange={this._handleChangeAmout} />
          <button>查看我的筆記</button>
        </div>
        <hr />
        <div id='test-paper' className='half paper'>
          {this.state.testQA.map(qa =>
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
                editNote={this._handelEditNote}
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