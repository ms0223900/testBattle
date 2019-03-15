import React from 'react'

export const TxtDiv = ({title='default Title', context='default Context', count=0}) => (
  <div>
    <h2>{ title }</h2>
    <p>{ context }</p>
    <p>click count: { count }</p>
  </div>
)
export class AvataDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1000,
    };
  }
  render() {
    const { tel='00-1234', account='aaa000', email='aaa@bbb.com' } = this.props
    return (
      <div>
        <h2>{ 'Your Infomation' }</h2>
        <ul>
          <li>{ tel } </li>
          <li>{ account } </li>
          <li>{ email } </li>
        </ul>
        <p>click count: { this.state.count }</p>
      </div>
    );
  }
}


const WithButtonHOC = (MyComponent,BTNWord, clickFn) => class  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 100,
    };
  }
  _handleCount = () => {
    this.setState({
      count: clickFn(this.state.count)
    })
  }

  render() {
    return (
      <div>
        <MyComponent  {...this.props} {...this.state} />
        <button onClick={this._handleCount}>{BTNWord}</button>
      </div>
    );
  }
}
const clickToAdd = c => c + 1
const clickToMinus = c => c - 1
export const AddCount_TxtBTN = WithButtonHOC(TxtDiv, 'add', clickToAdd)
export const MinusCount_TxtBTN = WithButtonHOC(TxtDiv, 'minus', clickToMinus)