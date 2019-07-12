import React from "react"
import Youtube from "react-youtube"
import { fetch1stContent, deleteContent, videoContent } from "../actions"
// import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faArrowAltCircleLeft, faCompactDisc } from "@fortawesome/free-solid-svg-icons"
import { ListGroup } from "react-bootstrap"
import queryString from "query-string"

class GroupVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      videoId: "",
      playlist: "",
      playlistContent: [],
      time: "",
      noVideoCase: false,
      admin: false,
    }
  }

  componentDidMount() {
    this.fetchContent().then(() => {
      this.playListDet()
    })
  }

  fetchContent = async () => {
    const queryParams = queryString.parse(this.props.location.search)

    if (queryParams.id) {
      await fetch1stContent(queryParams.id).then(res => {
        const dataId = Object.keys(res)
        if (dataId && dataId.length) {
          this.setState(
            {
              videoId: res[`${dataId[0]}`].videoID,
              time: dataId[0],
              playlist: res,
              admin: queryParams.admin ? true : false,
            },
            () => {
              return Promise.resolve()
            }
          )
        } else {
          this.setState({
            noVideoCase: true,
          })
          return Promise.reject()
        }
      })
    } else {
      return Promise.reject()
    }
  }

  deleteContentFunc = () => {
    const { time } = this.state
    const queryParams = queryString.parse(this.props.location.search)

    if (queryParams.id) {
      deleteContent(time, queryParams.id, res => {
        // console.log(res);
        console.log("new content to be called")
        this.fetchContent().then(() => {
          this.playListDet()
        })
      })
    }
  }

  deleteBtn = time => {
    const queryParams = queryString.parse(this.props.location.search)
    deleteContent(time, queryParams.id, res => {
      // console.log(res);
      console.log("new content to be called")
      this.fetchContent().then(() => {
        this.playListDet()
      })
    })
  }

  onReady = event => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  onEnd = event => {
    this.deleteContentFunc()
  }

  playListDet = async () => {
    const { playlist } = this.state
    const dataId = Object.keys(playlist)

    const playlistContent = await dataId.map(async item => {
      const videoObj = playlist[item]
      const jData = await videoContent(videoObj.videoID).then(data => {
        return data
      })

      const videoData = {
        videoId: videoObj.videoID,
        title: jData.items[0].snippet.title,
        thumbnail: jData.items[0].snippet.thumbnails.default.url,
        time: item,
      }
      return videoData
    })

    const resolveProm = await Promise.all(playlistContent)

    this.setState({
      playlistContent: resolveProm,
    })

    return resolveProm
  }

  render() {
    const { videoId, playlistContent, noVideoCase, admin } = this.state

    const opts = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    }

    return (
      <div className="container">
        <Link className="btn btn-primary" to="/">
          <FontAwesomeIcon size="1x" icon={faArrowAltCircleLeft} /> Back
        </Link>
        {noVideoCase ? (
          <div>
            <h1>This Group Has No Video At The Moment</h1>
            <h2>Please request some videos at your group</h2>
          </div>
        ) : (
          <React.Fragment>
            {videoId ? (
              <React.Fragment>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <Youtube
                      videoId={videoId && videoId.length ? videoId : ""}
                      opts={opts}
                      onReady={this.onReady}
                      onEnd={this.onEnd}
                    />
                    {admin ? (
                      <button className="btn btn-lg btn-success" onClick={this.deleteContentFunc}>
                        Next
                      </button>
                    ) : (
                      ""
                    )}
                  </div>

                  <ListGroup>
                    {playlistContent.map((item, index) => {
                      return (
                        <ListGroup.Item key={index} className="d-flex">
                          <img src={item.thumbnail} width={120} height={90} alt={item.title} />
                          <p className="m-2">{item.title}</p>
                          {admin ? (
                            <FontAwesomeIcon
                              className="offset-1"
                              icon={faTrashAlt}
                              onClick={() => {
                                this.deleteBtn(item.time)
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                </div>
                <div className="d-flex justify-content-center" />
              </React.Fragment>
            ) : (
              <div className="d-flex flex-column align-items-center mt-5">
                <FontAwesomeIcon icon={faCompactDisc} size="6x" spin />
                <h1>Loading</h1>
                <h6>Please wait...</h6>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default GroupVideo
