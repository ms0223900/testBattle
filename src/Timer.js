/* eslint-disable no-unused-vars */
import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { convertSecToMin } from './functions'
import { withStyles } from '@material-ui/core'

const styles = {
  button: {
    display: 'inline-block',
    margin: '0px 10px',
    verticalAlign: 'top',
  },
  paper: {
    width: '300px',
    padding: '10px',
    margin: 'auto',
    textAlign: 'center',
  },
  timer: {
    display: 'inline-block'
  }
}


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStart: false,
      isCountDown: false,
      time: 3,
    }
    this.timer = null
  }
  componentWillMount = () => {
    this.resetTime()
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevProps.isStart !== this.props.isStart) {
      this._handleTimerStartPause()
    }
    if(prevProps.isHandIn !== this.props.isHandIn) {
      this.resetTime()
    }
  }
  resetTime = () => {
    this.setState({
      time: this.props.time
    })
  }
  timerFn = () => {
    const { time, overAndCheckAns, timerStartPause } = this.props
    this.timer = setInterval(() => {
      if(this.state.time > 0) {
        this.setState({
          time: this.state.time - 1,
        })
      }
      else {
        this.setState({
          isStart: false,
          time: time,
        })
        timerStartPause()
        overAndCheckAns(true)
        clearInterval(this.timer)
      }
      console.log('timer on')
    }, 1000)
  }
  _handleTimerStartPause = () => {
    const { isStart } = this.props
    if(isStart) {
      this.timerFn()
    } else {
      clearInterval(this.timer)
    }
  }
  render() {
    const { time } = this.state
    const { isStart, timerStartPause, classes, } = this.props
    return (
      <div>
        <Paper elevation={1} className={classes.paper}>
          <Button
            variant='contained' 
            color={isStart ? 'primary' : 'default'} 
            aria-label={'start'} 
            className={classes.button}
            onClick={timerStartPause}
          >
            {isStart ? 'Pause' : 'Start' }
          </Button>
          <Typography className={classes.timer}  variant='h4' component='h3' >
            {convertSecToMin(time)[0] + ' : ' + convertSecToMin(time)[1]}
          </Typography>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(Timer)