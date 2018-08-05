import React, { Component } from 'react';
import Youtube from 'react-youtube';
import { fetch1stContent, deleteContent } from './actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: '',
      playlist: '',
    }
  }

  componentWillMount() {
    this.fetchContent();
  }

  fetchContent = () => {
    fetch1stContent((res) => {
      debugger;
      let dataId = Object.keys(res);
      if (dataId && dataId.length) {
        this.setState({
          videoId: dataId[0],
          playlist: dataId
        })
      } 
    })
  }

  deleteContentFunc = () => {
    const { videoId } = this.state;

    deleteContent(videoId, (res) => {
      // console.log(res);
      console.log('new content to be called');
      this.fetchContent();
    })
  }

  onReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  onEnd = (event) => {
    this.deleteContentFunc();
  }

  render() {
    const { videoId } = this.state;
    

    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    if (videoId.length) {
      return (
        <div>
          <div className='d-flex justify-content-center'>
            <h1>Fuse TGIF Music Blast</h1>
          </div>
          <div className='d-flex justify-content-center'>
            
            <Youtube
              videoId={videoId && videoId.length ? videoId : ''}
              opts={opts}
              onReady={this.onReady}
              onEnd={this.onEnd}
            />
          </div>
          <div className='d-flex justify-content-center'>
            <button className='btn btn-lg btn-success' onClick={this.deleteContentFunc}>Next</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading...</h1>
          <h6>Please wait...</h6>
          <h6>Please check the database has songs or not</h6>
        </div>
      )
    }
  }
}

export default App;
