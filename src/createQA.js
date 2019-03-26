import React from 'react'
import { DownloadJSONLink } from './TestPaper'
import { setValueOfArrObj } from './functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SingleOption = ({id='option-0-0', changeFn, value='', placeholder='option here'}) => (
  <input id={id} onChange={changeFn} value={value} placeholder={placeholder}></input>
)

export class SingleCreateQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { id, question, options, changeFn } = this.props
    return (
      <form onChange={changeFn} className='single-QA' id={id}>
        <h3>Question</h3>
        <textarea value={question} id={'question-' + id} onChange={changeFn}></textarea>
        <h3>Options</h3>
        {options.map(op => (
          <SingleOption key={`a-${id}-${op.id}`} id={`option-${id}-${op.id}`} value={op.option} changeFn={changeFn}/>
        ))}
      <hr />
      </form>
      
    );
  }
}
export default class CreateQAPanel extends React.Component {
  constructor(props) {
    super(props)
    this.qaPlate = (idNum=0) => ({id: idNum, question: '', options: [
      {id: 0, option: ''},
      {id: 1, option: ''},
      {id: 2, option: ''},
      {id: 3, option: ''},
    ]})
    this.state = {
      createQAData: [this.qaPlate()],
      lastIdOfOldData: 0,
    }
  }
  componentDidUpdate = (prevProps) => {
    if(prevProps.oldData !== this.props.oldData) {
      const { oldData=[{id: -1}] } = this.props
      this.setState({
        lastIdOfOldData: oldData[oldData.length - 1].id + 1
      })
    }
  }
  
  _handleChange = (e) => {
    const { id, value } = e.target
    const { createQAData } = this.state
    let data;
    if(id.search(/question-/gi) !== -1) {
      const ID = id.slice(9) * 1
      data = setValueOfArrObj(createQAData, ID, 'question', value)
    } else if (id.search(/option-/gi) !== -1) {
      const dataID = id.split('-')[1] * 1
      const optionID = id.split('-')[2] * 1
      const optionData = setValueOfArrObj(createQAData[dataID].options, optionID, 'option', value)
      data = setValueOfArrObj(createQAData, dataID, 'options', optionData)
    }
    this.setState({
      createQAData: data,
    })
  }
  _handleAddQuestion = () => {
    const { createQAData } = this.state
    const latestData = [
      ...createQAData, 
      this.qaPlate(createQAData[createQAData.length - 1].id + 1)
    ]
    this.setState({
      createQAData: latestData,
    })
  }
  convertDataToJSON = (objArr) => {
    const { lastIdOfOldData } = this.state
    const resultPlusLastId = objArr.map(ob => ob = {...ob, id: (ob.id + lastIdOfOldData),})
    const result = resultPlusLastId.map(re => re = {...re, options: re.options.map(op => op = op.option)})
    return result
  }
  render() {
    const { createQAData } = this.state
    const { oldData=[] } = this.props
    const resultJSON = this.convertDataToJSON(createQAData)
    console.log(resultJSON)
    return (
      <div id='createQaArea'>
        <h2>Create Your Own Questions And Aswers</h2>
        {createQAData.map(cr => (
          <SingleCreateQA 
            key={'form' + cr.id}
            id={cr.id}
            question={cr.question}
            options={cr.options}
            changeFn={this._handleChange}
          />
        ))}
        <button onClick={this._handleAddQuestion}>
          <FontAwesomeIcon icon='plus-circle' />
        </button>
        <hr />
        <button>
          <DownloadJSONLink obj={ [...oldData, ...resultJSON] } />
        </button>
      </div>);
  }
}