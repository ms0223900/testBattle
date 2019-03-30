import React from 'react'

// const mockValue = ['A', 'B', 'C']


export class SelectDatabase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { allTestFilterConditions } = this.props
    return (
      <select defaultValue={'Choose'} onInput={this.props.changeSelect}>
        <option style={{ display: 'none' }} value='Choose'>{'Choose'}</option>
        {allTestFilterConditions.map(all => (
          <option key={all} value={all}>{all}</option>
        ))}
      </select>
    );
  }
}

export class SelectMenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArr: [],
    };
  }
  _handleChangeSelect = (e) => {
    const { selectedArr } = this.state
    const { value } = e.target
    if(selectedArr.indexOf(value) === -1) {
      this.setState(state => ({
        selectedArr: [...state.selectedArr, value]
      }))
    }
  }
  _handleDeleteSelect = (e) => {
    const name = e.target.getAttribute('name')
    console.log(name)
    const deletedArr = this.state.selectedArr.filter(s => s !== name)
    this.setState({
      selectedArr: deletedArr,
    })
  }
  render() {
    const { allTestFilterConditions, nowFIlterCondition, changeSelectDatabase, deleteSelectDatabase  } = this.props
    return (
      <div>
        <SelectDatabase 
          allTestFilterConditions={allTestFilterConditions} 
          changeSelect={changeSelectDatabase} 
        />
        {nowFIlterCondition.map(now => (
          <div 
            className={'seleced-tag'} 
            key={now}
          >
            {now}
            <span name={now} onClick={deleteSelectDatabase}> (X) </span>
          </div>
        ))}
      </div>
    )
    
  }
}