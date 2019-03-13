import React from 'react'


export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { 
      changeAnswer, 
      myAnswer=[], 
      id=1, 
      question='', 
      options=[], 
      isHandIn=false,
    } = this.props
    console.log(isHandIn)
    const thisAnswer = myAnswer.filter(a => a.id === id)[0]
    return (
      <div>
        <form onChange={changeAnswer} id={id}>
          <h3>{id} <span>{thisAnswer.checked !== 'notYet' ? (thisAnswer.checked ? '✔' : '✘') : ''}</span> </h3>
          <p>{question}</p>
          <span>{thisAnswer.answer}</span>
          {options.map(op => 
            <label>
              <input type='radio' name={id} value={op} disabled={isHandIn}/>{op}
            </label>
          )}
          <button>STAR</button>
          <button>NOTE</button>
        </form>
      </div>
    );
  }
}