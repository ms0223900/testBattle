import React from 'react'
import { SingleQA, DataButtons } from './singleQA'

export class TestPaper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { testQA=[], myAnswer, isHandIn, changeAnswer } = this.props
    console.log(testQA)
    return (
      <div id='test-paper' className='half paper'>
        {testQA.length > 0 ? 
          testQA.map(qa =>
            <React.Fragment> 
              <SingleQA
                key={qa.id}
                changeAnswer={changeAnswer}
                myAnswer={myAnswer}
                id={qa.id}
                question={qa.question}
                options={qa.options}
                isHandIn={isHandIn}
              />
              <DataButtons id={qa.id} />
            </React.Fragment>
          ) : '尚無收藏題目' }
      </div>
    );
  }
}