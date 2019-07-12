import React from "react"
import { Modal } from "react-bootstrap"
import Youtube from "react-youtube"

const Instruction = props => {
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }

  const onReady = event => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
  }

  const onEnd = event => {
    this.deleteContentFunc()
  }

  return (
    <Modal size="lg" show={props.instuction} backdrop="static" onHide={props.handleInstructionModal}>
      <Modal.Header closeButton>
        <Modal.Title>Instruction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <Youtube videoId={"j9p2pYOVFT8"} opts={opts} onReady={onReady} onEnd={onEnd} />

            <div className="form-group">
              <h3>Steps to be followed</h3>
              <ol>
                <li>Create a chat group in workplace</li>
                <li>Add TGIF Playlist bot in the group with all the other members</li>
                <li>Copy the chat id from url</li>
                <li>Go to http://tgif-music-fest.herokuapp.com</li>
                <li>Click on the Add Group button</li>
                <li>
                  Fill up the form where group id should be the chat id and group name should be chat name from the
                  workplace
                </li>
                <li>Click Save</li>
                <li>Click on the row of group name you have created</li>
                <li>Add youtube song in the group and enjoy :)</li>
              </ol>
              <div>
                <label>Chat id should be same from workplace and try to keep the group name same too :)</label>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}

export default Instruction
