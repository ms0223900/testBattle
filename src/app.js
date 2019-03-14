import React from 'react'
import { SingleQA, AddCount_TxtBTN, MinusCount_TxtBTN } from './singleQA'

// let starLS = localStorage.getItem('starID')
// let noteLS = localStorage.getItem('IdNote')
// console.log(JSON.parse(noteLS))
const LS = localStorage
const QAs = [
  {
    id: 'Q1',
    question: 'aaaaa?',
    answer: 'abc',
    options: ['abc', 'def', 'ghi', 'jkl'],
    star: false,
    note: '',
  },
  {
    id: 'Q2',
    question: 'bbbb?',
    answer: 'def',
    options: ['abc', 'def', 'ghi', 'jkl'],
    star: false,
    note: '',
  },
  {
    id: 'Q3',
    question: 'bbbb?',
    answer: 'ghi',
    options: ['abc', 'def', 'ghi', 'jkl'],
    star: false,
    note: '',
  },
  {
    id: 'Q4',
    question: 'sadasdbbbb?',
    answer: 'jkl',
    options: ['abc', 'def', 'ghi', 'jkl'],
    star: false,
    note: '',
  },
]


const setValueOfArrObj = (arrObj=[], id='', targetAttr='', value='') => {
  const tarObj = arrObj.filter(a => a.id === id)[0]
  return [ 
    ...arrObj.filter(a => a.id !== id),
    {
      ...tarObj,
      [targetAttr]: 
        typeof(value) === 'boolean' ? 
          (tarObj[targetAttr] ? false : true) : 
          value
    }
  ]
}
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [],
      updatedQAs: LS.getItem('QAstorge') ? JSON.parse(LS.getItem('QAstorge')) : QAs,
      isHandIn: false,
    }
  }
  componentWillMount = () => {
    // const updateFromLS_QAs = QAs.map(qa => qa = qa)
    if(!LS.getItem('QAstorge')) {
      LS.setItem('QAstorge', JSON.stringify(QAs))
    }
    const Q = this.state.updatedQAs.map(q => q = {
      id: q.id, 
      answer: '', 
      correctAnswer: q.answer, 
      checked: 'notYet',
      star: q.star,
      note: q.note,
    })
    this.setState({
      myAnswer: Q
    })
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
    const changedAns = setValueOfArrObj(myAnswer, name, 'answer', value)
    if(!isHandIn) {
      this.setState({
        myAnswer: changedAns
      })
    }
  }
  _handelStar = (e) => {
    const { myAnswer, updatedQAs } = this.state
    const { name } = e.target

    const staredMyAnswer = setValueOfArrObj(myAnswer, name, 'star', false)
    const staredQAs = setValueOfArrObj(updatedQAs, name, 'star', false)
    this.setState({
      myAnswer: staredMyAnswer,
      updatedQAs: staredQAs,
    })
    console.log(staredQAs)
    localStorage.setItem('QAstorge', JSON.stringify(staredQAs))
  }

  render() {
    const { myAnswer, isHandIn,  } = this.state
    return (
      <div>
        Hi
        {QAs.map(qa => 
          <SingleQA
            ley={qa.id}
            changeAnswer ={this._handleChangeAnswer}
            starIt={this._handelStar}
            myAnswer={myAnswer}
            id={qa.id}
            question={qa.question}
            options={qa.options}
            isHandIn={isHandIn}
          />
        )}
        <hr />
        <AddCount_TxtBTN title={'a'} />
        <MinusCount_TxtBTN  title={'minus It'} />
        <button onClick={this._handleCheckAnswer}>Check Answer!</button>
        <h4>SCORE: 
          <span>
          { isHandIn ? ~~(myAnswer.filter(a => a.checked).length / myAnswer.length * 100) : '' }</span> </h4>
      </div>
    );
  }
}