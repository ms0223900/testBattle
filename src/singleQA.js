import React from 'react'

const styles = {
  starBTN: {
    normal: {
      'backgroundColor': '#ddd',
      'color': '#111'
    },
    active: {
      'backgroundColor': '#333',
      'color': '#fff'
    }
  }
}


export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { starBTN } = styles


    const { 
      changeAnswer,
      starIt, 
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
        <form onChange={changeAnswer} id={id} onSubmit={e => e.preventDefault()}>
          <h3>{id} <span>{thisAnswer.checked !== 'notYet' ? (thisAnswer.checked ? '✔' : '✘') : ''}</span> </h3>
          <p>{question}</p>
          <span>{thisAnswer.answer}</span>
          {options.map(op => 
            <label>
              <input 
                type='radio' 
                name={id} 
                value={op}
                disabled={isHandIn} 
              /> {op}
            </label>
          )}
          <button onClick={starIt} name={id} style={ thisAnswer.star ? starBTN.active : starBTN.normal} >STAR</button>
          <button>NOTE</button>
        </form>
      </div>
    );
  }
}