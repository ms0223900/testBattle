import React from 'react'
import { styles } from '../config'

export class SingleQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditNote: false,
    };
  }
  _handleOpenNote = () => {
    this.setState((state) => ({
      isEditNote: !state.isEditNote
    }))
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
      // noteContext='nothing',
      editNote,
    } = this.props
    const { isEditNote } = this.state
    const thisAnswer = myAnswer.filter(a => a.id === id)[0]
    console.log(thisAnswer)
    return (
      <div>
        <form 
          onChange={changeAnswer} 
          id={id} 
          onSubmit={e => e.preventDefault()}
        >
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
          
          <button onClick={this._handleOpenNote} name={id} >NOTE</button>
        </form>
        <form>
          <textarea 
            name={id}
            onChange={editNote}
            value={thisAnswer.note}
            style={{display: isEditNote ? 'block' : 'none',  width: 400, height: 100 }}
          />
        </form>
      </div>
    );
  }
}




// export const TxtWithBTN = WithButtonHOC(TxtDiv, 'Hello', clickAlert)
