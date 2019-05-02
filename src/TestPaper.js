import React from 'react'
import { SingleQA_WithButton } from './singleQA'

export const DownloadJSONLink = ({obj=[], clickFn=() => {}}) => {
  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(obj))
  return (<a href={jsonStr} onClick={clickFn}>Update data</a>)
}
export const ScorePanel = ({myAnswer=[], allQA=[]}) => {
  return (
    <div>
      <h3>Your Score:</h3>
      { ~~(myAnswer.filter(a => a.checked === true).length / allQA.length * 100) }
    </div>
  )
}
export const getAnswerLength = (myAnswer) => (
  myAnswer.filter(my => my.answer !== '').length
)
export class WholeTestPaper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const { testQA=[], myAnswer, isHandIn, changeAnswer, checkAnswer, isCheckCorrectAns, checkCorrectAnswer } = this.props
    // const questionTitle = genArr(myAnswer.length, 1)
    return (
      <div id='test-paper' className='test-paper'>
        <h4>完成題數:  
          <span>
            {getAnswerLength(myAnswer)} /
            {testQA.length}
          </span>
          <span>{testQA.length > 0 && testQA.length === getAnswerLength(myAnswer) ? '所有題目都完成了！' : `還有${testQA.length - getAnswerLength(myAnswer)}題未完成`}</span>
        </h4>
        <h4 id='score'>SCORE: 
          <span>
          { isHandIn ? 
            <ScorePanel correctAns={myAnswer} allQA={testQA} /> 
            : '' }
          </span>
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
          <button onClick={checkAnswer}>Check Answer!</button>
          <button className='secondBTN' style={{ display: isHandIn ? 'inline-block' : 'none' }} onClick={checkCorrectAnswer}>Check Correct Answer!</button>
      </div>
    );
  }
}
export class SingleTestPaper extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { testQA=[], myAnswer, isHandIn, changeAnswer, checkAnswer, isCheckCorrectAns, singleAnswerModeState } = this.props
    const thisQA = testQA[singleAnswerModeState.index]
    return (
      <div id='single-test-paper' className='test-paper test-paper'>
        {testQA.length > 0 ? 
        <div>
            <h4 >目前題數 / 總題數: <br />
              <span>
                {singleAnswerModeState.index + 1} /
                {singleAnswerModeState.idArr.length}
              </span>
            </h4>
            <SingleQA_WithButton
              key={thisQA.id}
              id={thisQA.id}
              question={thisQA.question}
              options={thisQA.options}
              myAnswer={myAnswer}
              changeAnswer={changeAnswer}
              isHandIn={isHandIn}
              isCheckCorrectAns={isCheckCorrectAns}
            />
            <div></div>
            {isHandIn ? <ScorePanel myAnswer={myAnswer} allQA={singleAnswerModeState.idArr} /> : ''}
            <button onClick={checkAnswer}>Check Answer!</button>
          </div>
         : '尚無題目' }
      </div>
    );
  }
}