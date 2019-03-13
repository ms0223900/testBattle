import React from 'react'
import { SingleQA } from './singleQA'

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


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAnswer: [],
      isHandIn: false,
    };
  }
  componentWillMount = () => {
    const Q = QAs.map(q => q = {
      id: q.id, 
      answer: '', 
      correctAnswer: q.answer, 
      checked: 'notYet',
      star: q.star,
    })
    this.setState({
      myAnswer: Q
    })
    
  }
  
  _handleCheckAnswer = () => {
    const { myAnswer } = this.state
    const checkedAnswer = myAnswer.map(a => a = {...a, checked: a.answer === a.correctAnswer ? true : false } )
    console.log(checkedAnswer)
    // for (let i = 0; i < myAnswer.length; i++) {
    //   if(myAnswer[i]['answer'] === QAs[i]['answer']) {
    //     myAnswer[i]['checked'] = true
    //   } else {
    //     myAnswer[i]['checked'] = false
    //   }
    // }
    // console.log(myAnswer)
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
  render() {
    const { myAnswer, isHandIn } = this.state
    return (
      <div>
        Hi
        {QAs.map(qa => 
          <SingleQA
            changeAnswer ={this._handleChangeAnswer}
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