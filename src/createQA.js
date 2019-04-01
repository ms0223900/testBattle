import React from 'react'
import { DownloadJSONLink } from './TestPaper'
import { 
  setValueOfArrObj, 
  convertABCDtoNum,
  checkAnyOfObjArrIsEmpty,
  convert1234ToABCD,
 } from './functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SingleOption = ({id='option-0-0', changeFn, choice='A', value='', placeholder='option here'}) => (
  <div className={'single-option-container'}>
    <span>{choice}</span>
    <input id={id} onChange={changeFn} value={value} placeholder={placeholder} type='text'></input>
  </div>
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
        <h3 className='single-createQA-title'>Question {id + 1} </h3>
        <textarea value={question} id={'question-' + id} onChange={changeFn}></textarea>
        <h3>Options</h3>
        {options.map(op => (
          <SingleOption key={`a-${id}-${op.id}`} id={`option-${id}-${op.id}`} choice={op.choice} value={op.option} changeFn={changeFn}/>
        ))}
      <hr />
      </form>
      
    );
  }
}


export default class CreateQAPanel extends React.Component {
  constructor(props) {
    super(props)
    this.qaPlate = (idNum=0) => ({id: idNum, question: '', correctAnswer:'', options: [
      {id: 0, choice: 'A', option: ''},
      {id: 1, choice: 'B', option: ''},
      {id: 2, choice: 'C', option: ''},
      {id: 3, choice: 'D', option: ''},
    ]})
    this.state = {
      createQAData: [this.qaPlate()],
      database: '',
      lastIdOfOldData: 0,
      answer: '',
      resultJSON: [{}],
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
  _handleChangeDatabaseName = (e) => {
    const { value } = e.target
    this.setState({
      database: value,
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
    this.bottom.scrollIntoView({behavior: 'smooth'})
  }
  _handleChangeAnswer = (e) => {
    const { value } = e.target
    const { answer } = this.state
    const valueWithCovert = convert1234ToABCD(value) ? convert1234ToABCD(value).toUpperCase() : value.toUpperCase()
    const valueLength = valueWithCovert.length
    const lengthCondition = (valueLength - 6)
    let handledValue = answer
    
    if(valueLength > answer.length && valueWithCovert.search(/[a|b|c|d]$/gi, '') !== -1) {
      handledValue = lengthCondition % 6 === 0 ? 
        valueWithCovert.slice(0, valueLength - 1) 
          + '\n' 
          + valueWithCovert.slice(valueLength - 1) : 
        valueWithCovert
    } else if(valueLength < answer.length) {
      handledValue = valueWithCovert
    }
    this.setState({
      answer: handledValue,
    })
  }
  _checkAmoutOfQA = (e) => {
    const { answer, createQAData } = this.state
    const answerLength = answer.replace('\n', '').length
    // e.preventDefault()

    if(answerLength !== createQAData.length) {
      e.preventDefault()
      window.alert('題數與解答的數量不符~')
    } else if(checkAnyOfObjArrIsEmpty(createQAData.map(c => c = {...c , correctAnswer: 'mockAnswer'})) === false) {
      e.preventDefault()
      console.log(createQAData)
      window.alert('題目或是選項還有未填寫的喔～')
    }else {
      this.setState({
        resultJSON: this.convertDataToJSON(createQAData),
      })
    }
    
  }
  convertDataToJSON = (objArr) => {
    const { lastIdOfOldData, answer } = this.state
    const resultPlusLastId = objArr.map(ob => ob = {...ob, id: (ob.id + lastIdOfOldData),})
    const result = resultPlusLastId.map(re => re = {...re, options: re.options.map(op => op = op.option)})
    let addAnswerResult = []
    const answerArr = answer.replace('\n', '').split('').map(a => a = convertABCDtoNum(a))
    console.log(answerArr)
    for (let i = 0; i < answerArr.length; i++) {
      addAnswerResult[i] = { 
        ...result[i], 
        databaseSort: this.database || '未分類',
        correctAnswer: result[i].options[answerArr[i]],
       }
    }
    console.log(addAnswerResult)
    return addAnswerResult
  }
  render() {
    const { createQAData, answer } = this.state
    const { oldData=[] } = this.props
    const answerLength = answer.replace(/[\n]/gi, '').length
    const compareAnsAndQuestionLength = () => {
      if(answerLength > createQAData.length) {
        return 'more than ans'
      } else if (answerLength < createQAData.length) {
        return 'less than ans'
      } return 'No problem~'
    }
    return (
      <div>
        <div id='createQaArea' className='clearfix'>
          <h2>Create Your Own Questions And Answers</h2>
          <hr />
          <div className='createQA-container question'>
            <h4>Your Database Name:</h4>
            <input 
              type='text'
              className='database-input' 
              onChange={this._handleChangeDatabaseName} 
              value={this.database}
              placeholder={'填入題庫名稱，如不填則預設為"未分類"'} />
              <hr />
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
          </div>
          <div className='createQA-container answer' ref={el => this.answerContainer = el}>
            <h3>Correct Answer</h3>
            {/* <br /> */}
            <span>{answerLength}個答案</span>
            <span>{'(' + compareAnsAndQuestionLength()}</span>
            <textarea onChange={this._handleChangeAnswer} value={answer}></textarea>
          </div>
          <div className='createQA-container' >
            <hr />
            <button>
              <DownloadJSONLink obj={ [...oldData, ...this.state.resultJSON] } clickFn={this._checkAmoutOfQA} />
            </button>
          </div>
        </div>
        <div ref={el => this.bottom = el} style={{ width: '100px', height: '20px' }}></div>
      </div>);
  }
}