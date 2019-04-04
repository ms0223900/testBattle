/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react'

const coinImg = 'https://cdn3.iconfinder.com/data/icons/supermario/PNG/Retro-Coin.png'
const AVATARimg = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/user.png'

const HATs = ['http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png', 'http://www.pngpix.com/wp-content/uploads/2016/11/PNGPIX-COM-Hat-PNG-Transparent-Image--500x248.png', 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Cowboy-Hat-PNG-Transparent-Image-250x187.png']

const setTimePromise = (sec) => (
  new Promise((res, rej) => setTimeout(res, sec))
)
const loadImg = (ctx, imgSrc, imgSpec) => (
  new Promise((res, rej) => {
    const img = new Image()
    img.src = imgSrc
    // setTimeout(() => {
      console.log('draw' + img.src)
      img.onload = () => res( ctx.drawImage(img, imgSpec[0], imgSpec[1], imgSpec[2], imgSpec[3]) )
    // }, 1000) 
    img.onerror = rej
  })
)

function drawCanvasAvatar(el, hatImgSrc='') {
  const ctx = el.getContext('2d')
  ctx.clearRect(0, 0, 300, 300)
  loadImg(ctx, AVATARimg, [50, 50, 200, 200])
    .then(() => setTimePromise(1))
    .then(() => loadImg(ctx, hatImgSrc, [70, 20, 150, 100]))
}

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hat: 'http://www.pngpix.com/wp-content/uploads/2016/07/PNGPIX-COM-Hat-PNG-Transparent-Image-500x377.png',
    };
    this.setCanvas = el => this.canvas = el
  }
  componentDidMount = () => {
    drawCanvasAvatar(this.canvas, this.state.hat)
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.hat !== this.state.hat) {
      drawCanvasAvatar(this.canvas, this.state.hat)
    }
  }
  
  _handleChangeHat = (e) => {
    const imgSrc = e.target.getAttribute('src')
    this.setState({
      hat: imgSrc
    })
  }
  render() {
    return (
      <Fragment>
        <canvas ref={this.setCanvas} width={'300'} height={'300'} />
        <div>
          {HATs.map(hat => (
            <img key={hat} src={hat} style={{ width: '100px' }} onClick={this._handleChangeHat} />
          ))}
        </div>
      </Fragment>
    );
  }
}