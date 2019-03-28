import React from 'react'
import { SingleQA_WithButton } from './singleQA'

export const DownloadJSONLink = ({obj=[], clickFn=() => {}}) => {
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj))
  return (<a href={jsonStr} onClick={clickFn} download={'download.json'}>Download JSON file</a>)
}

export class TestPaper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getAnswerLength = (myAnswer) => (myAnswer.filter(my => my.answer !== '').length)
  }
  render() {
    const { testQA=[], myAnswer, isHandIn, changeAnswer, checkAnswer, isCheckCorrectAns, checkCorrectAnswer } = this.props
    // const questionTitle = genArr(myAnswer.length, 1)
    return (
      <div id='test-paper' className='half paper'>
        <h4>完成題數:  
          <span>
            {this.getAnswerLength(myAnswer)} /
            {testQA.length}
          </span>
          <span>{testQA.length > 0 && testQA.length === this.getAnswerLength(myAnswer) ? '所有題目都完成了！' : `還有${testQA.length - this.getAnswerLength(myAnswer)}題未完成`}</span>
        </h4>
        <h4 id='score'>SCORE: 
          <span>
          { isHandIn ? ~~(myAnswer.filter(a => a.checked).length / testQA.length * 100) : '' }</span>
        </h4>
        <hr />
        {testQA.length > 0 ? 
          testQA.map(qa =>
            <React.Fragment key={qa.id}>
              <SingleQA_WithButton
                key={qa.id}
                id={qa.id}
                question={qa.question}
                options={qa.options}
                myAnswer={myAnswer}
                changeAnswer={changeAnswer}
                isHandIn={isHandIn}
                isCheckCorrectAns={isCheckCorrectAns}
              />
            </React.Fragment>
          ) : '尚無題目' }
          <hr />
          <button onClick={checkAnswer}>Check Answer!</button>
          <button className='secondBTN' style={{ display: isHandIn ? 'inline-block' : 'none' }} onClick={checkCorrectAnswer}>Check Correct Answer!</button>
          
      </div>
    );
  }
}