import React, { Component } from 'react';
import Youtube from 'react-youtube';
import { fetch1stContent, deleteContent, videoContent } from './actions';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Route, BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoId: '',
      playlist: '',
      playlistContent: [],
      time: ''
    }
  }

  componentWillMount() {
    this.fetchContent().then(() => {
      this.playListDet()
    })
  }

  fetchContent = async () => {
    await fetch1stContent((res) => {
      const dataId = Object.keys(res);
      if (dataId && dataId.length) {
        this.setState({
          videoId: res[`${dataId[0]}`].videoID,
          time: dataId[0],
          playlist: res
        }, () => {
          return Promise.resolve();
        })
      }
    })

    return Promise.resolve();
  }

  deleteContentFunc = () => {
    const { time } = this.state;

    deleteContent(time, (res) => {
      // console.log(res);
      console.log('new content to be called');
      this.fetchContent().then(() => {
        this.playListDet()
      })
    })
  }

  deleteBtn = (time) => {
    deleteContent(time, (res) => {
      // console.log(res);
      console.log('new content to be called');
      this.fetchContent().then(() => {
        this.playListDet()
      })
    })
  }

  onReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  onEnd = (event) => {
    this.deleteContentFunc();
  }

  playListDet = async () => {
    const { playlist } = this.state;
    const dataId = Object.keys(playlist);
    
    const playlistContent = await dataId.map(async (item) => {
      const videoObj = playlist[item];
      const jData = await videoContent(videoObj.videoID).then((data) => {
        return data;
      })
      
      const videoData = {
        videoId: videoObj.videoID,
        title: jData.items[0].snippet.title,
        thumbnail: jData.items[0].snippet.thumbnails.default.url,
        time: item
      }
      
      return videoData;
    });

    const resolveProm = await Promise.all(playlistContent);

    this.setState({
      playlistContent: resolveProm
    })

    return resolveProm;
  }

  render() {
    const { videoId, playlistContent } = this.state;
    

    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    if (videoId.length) {
      return (
        <Router>
          <div>
            <div className='d-flex justify-content-center'>
              <h1>Fuse TGIF Music Blast</h1>
            </div>
            <div className='d-flex justify-content-between'>
              
              <div>
                <Youtube
                  videoId={videoId && videoId.length ? videoId : ''}
                  opts={opts}
                  onReady={this.onReady}
                  onEnd={this.onEnd}
                />
                <Route
                  path='/admin'
                  render={(props) => (
                    <button className='btn btn-lg btn-success' onClick={this.deleteContentFunc}>Next</button>
                  )}
                />
              </div>

              <ListGroup>
                {playlistContent.map((item, index) => {
                  return (
                    <ListGroupItem key={index} className='d-flex'>
                      <img src={item.thumbnail} width={120} height={90} alt={item.title}/>
                      <p className='m-2'>{item.title}</p>
                      {/* <button className='btn btn-danger'>Delete</button> */}
                      <Route
                        path='/admin'
                        render={(props) => (
                          <FontAwesomeIcon className='offset-1' icon={faTrashAlt} onClick={() => {this.deleteBtn(item.time)}} />
                        )}
                      />
                    </ListGroupItem>
                  )
                })}
            </ListGroup>
            </div>
            <div className='d-flex justify-content-center'>
              
            </div>

            
          </div>

        </Router>
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
