import React from 'react'
import { SingleQA_WithButton } from './singleQA'
// import { genArr } from './functions'

export class TestPaper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { testQA=[], myAnswer, isHandIn, changeAnswer, checkAnswer, isCheckCorrectAns, checkCorrectAnswer } = this.props
    // const questionTitle = genArr(myAnswer.length, 1)
    return (
      <div id='test-paper' className='half paper'>
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