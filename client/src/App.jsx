import React, { Component } from 'react';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import GroupTable from './GroupTable';
import GroupVideo from './GroupVideo';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className='d-flex justify-content-center'>
          <h1>Fuse TGIF Music Blast</h1>
        </div>
        <Router>
          <Switch>
            <Route exact path='/group' component={GroupVideo}/>
            <Route component={GroupTable}/> 
          </Switch>
        </Router>
        {/* this.videoRender() */}
      </React.Fragment>
    )
  }
}

export default App;
