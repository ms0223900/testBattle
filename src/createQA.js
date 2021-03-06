import React from 'react'
import { database } from './avatar'
import { REF } from '../config'
import { DownloadJSONLink } from './TestPaper'
import { 
  setValueOfArrObj, 
  convertABCDtoNum,
  checkAnyOfObjArrIsEmpty,
  convert1234ToABCD,
 } from './functions'
import { HOCwithHint } from './singleQA'
import { FormattedMessage, injectIntl } from 'react-intl'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faMinusCircle)




export const SingleOption = ({id='option-0-0', changeFn, choice='A', value='', placeholder='option here'}) => (
  <div className={'single-option-container'}>
    <span>{choice}</span>
    <input id={id} onChange={changeFn} value={value} placeholder={placeholder} type='text'></input>
  </div>
)
export const DeleteQuestion = ({id=0, deleteQuestion=()=>{}}) => (
  <span name={id} onClick={deleteQuestion.bind(this, id)} className={'delete-createQA'}><FontAwesomeIcon name={id} icon={'minus-circle'} /></span>
)
export const DeleteQuestionWithHint = HOCwithHint(DeleteQuestion, 'Delete This Question', 'delete-createQA')


export class SingleCreateQA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { id, question, options, changeFn, deleteQuestion } = this.props
    return (
      <form onChange={changeFn} className='single-QA' id={id}>
        <h3 className='single-createQA-title'>Question {id + 1} </h3>
        <DeleteQuestionWithHint id={id} deleteQuestion={deleteQuestion}  />
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


class CreateQAPanel extends React.Component {
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
  componentDidMount = () => {
    const getTempSave = localStorage.getItem('tempSave')
    if(getTempSave) {
      this.setState({
        createQAData: JSON.parse(getTempSave),
      })
    } else {
      localStorage.setItem('tempSave', '')
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
    localStorage.setItem('tempSave', JSON.stringify(data))
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
  _handleDeleteQuestion = (id) => {
    // const name = e.target.getAttribute('name')
    // console.log(name)
    const { createQAData } = this.state
    const afterThisData = createQAData.filter(c => c.id > id * 1)
    const afterDataMinusOne = afterThisData.map(af => af = {...af, id: af.id - 1})
    const beforeThisData = createQAData.filter(c => c.id < id * 1)
    if(createQAData.length > 1) {
      if(!beforeThisData) {
        this.setState({
          createQAData: [...afterDataMinusOne],
        })
      } else if(!afterThisData) {
        this.setState({
          createQAData: [...beforeThisData],
        })
      } else {
        this.setState({
          createQAData: [...beforeThisData, ...afterDataMinusOne],
        })
      }
    }
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
  _resetCreateQA = () => {
    if(window.confirm('Are you sure deleting these QA?')) {
      localStorage.setItem('tempSave', '')
    }
  }
  _checkAmoutOfQA = (e) => {
    const { answer, createQAData } = this.state
    const { oldData=[] } = this.props
    const answerLength = answer.replace(/\n/gi, '').length
    // e.preventDefault()

    if(answerLength !== createQAData.length) {
      console.log(answerLength, createQAData.length)
      e.preventDefault()
      window.alert('題數與解答的數量不符~')
    } else if(checkAnyOfObjArrIsEmpty(createQAData.map(c => c = {...c , correctAnswer: 'mockAnswer'})) === false) {
      e.preventDefault()
      console.log(createQAData)
      window.alert('題目或是選項還有未填寫的喔～')
    }else {
      this.props.setCoin(createQAData.length * 100)
      const res = [...oldData, ...this.convertDataToJSON(createQAData)]
      this.setState({
        resultJSON: res,
      })
      database.ref(REF).set(res)
      window.alert('database have been updated')
    }
    
  }
  convertDataToJSON = (objArr) => {
    const { lastIdOfOldData, answer, database } = this.state
    const resultPlusLastId = objArr.map(ob => ob = {...ob, id: (ob.id + lastIdOfOldData),})
    const result = resultPlusLastId.map(re => re = {...re, options: re.options.map(op => op = op.option)})
    let addAnswerResult = []
    const answerArr = answer.replace(/[\n]/gi, '').split('').map(a => a = convertABCDtoNum(a))
    console.log(answerArr)
    for (let i = 0; i < answerArr.length; i++) {
      addAnswerResult[i] = { 
        ...result[i], 
        databaseSort: database || '未分類',
        correctAnswer: result[i].options[answerArr[i]],
       }
    }
    console.log(addAnswerResult)
    return addAnswerResult
  }
  render() {
    const { createQAData, answer } = this.state
    // const { oldData=[] } = this.props
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
          <FormattedMessage 
            id={'createQA.bigTitle'} 
            tagName={'h2'}
            values={{ someone: 'Hellen' }}
          />
          <hr />
          <div className='createQA-container question'>
            <h4>Your Database Name:</h4>
            <input 
              type='text'
              className='database-input' 
              onChange={this._handleChangeDatabaseName} 
              value={this.database}
              placeholder={this.props.intl.formatMessage({
                id: 'createQA.databaseName'
              })} />
              <hr />
            {createQAData.map(cr => (
              <SingleCreateQA 
                key={'form' + cr.id}
                id={cr.id}
                question={cr.question}
                options={cr.options}
                changeFn={this._handleChange}
                deleteQuestion={this._handleDeleteQuestion}
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
              <DownloadJSONLink obj={ this.state.resultJSON } clickFn={this._checkAmoutOfQA} />
            </button>
            <button onClick={this._resetCreateQA}>Reset QAs</button>
          </div>
        </div>
        <div ref={el => this.bottom = el} style={{ width: '100px', height: '20px' }}></div>
      </div>);
  }
}
export default injectIntl(CreateQAPanel)