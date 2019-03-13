import React from 'react'
import { SingleQA } from './singleQA'

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
const toggleOneInArrObj = (targetAttr, arrObj, conditionFN) => {
  const tarObj = arrObj.filter(conditionFN)[0]
   let newArrObj = [ 
    ...arrObj.filter(!conditionFN),
    {
      ...tarObj,
      [targetAttr]: tarObj[targetAttr] ? false : true
    }
  ]
  console.log(newArrObj)
  return newArrObj
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [],
      isHandIn: false,
    };
  }
  componentWillMount = () => {
    // const updateFromLS_QAs = QAs.map(qa => qa = qa)
    const Q = QAs.map(q => q = {
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
    
    if(!LS.getItem('QAstorge')) {
      LS.setItem('QAstorge', JSON.stringify(QAs))
    }
    //init localStorage
    // starLS = starLS ? starLS : localStorage.setItem('starID', '')

    // noteLS = noteLS ? noteLS : localStorage.setItem('IdNote', JSON.stringify({id: 'Q1', note: 'aaa'}))

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
    const changedAns = myAnswer.filter(a => a.id === name)[0]
    if(!isHandIn) {
      this.setState({
        myAnswer: [
          ...myAnswer.filter(a => a.id !== name),
          {
            ...changedAns,
            answer: value,
          },
        ]
      })
    }
  }
  _handelStar = (e) => {
    const { myAnswer } = this.state
    const { name } = e.target
    // const starAnswer = myAnswer.filter(a => a.id === name)[0]
    // const staredMyAnswer = [ 
    //   ...myAnswer.filter(a => a.id !== name),
    //   {
    //     ...starAnswer,
    //     star: starAnswer.star ? false : true
    //   }
    // ]
    const staredMyAnswer = toggleOneInArrObj('star', myAnswer, a => a.id === name)
    this.setState({
      myAnswer: staredMyAnswer,
    })
    console.log(this.state.myAnswer)
    localStorage.setItem('QAstorge', QAs)
  }

  render() {
    const { myAnswer, isHandIn,  } = this.state
    return (
      <div>
        Hi
        {QAs.map(qa => 
          <SingleQA
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
        <button onClick={this._handleCheckAnswer}>Check Answer!</button>
        <h4>SCORE: 
          <span>
          { isHandIn ? ~~(myAnswer.filter(a => a.checked).length / myAnswer.length * 100) : '' }</span> </h4>
      </div>
    );
  }
}