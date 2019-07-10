import bodyParser from 'body-parser'
import express from 'express';
import path from 'path';
import firebase from 'firebase-admin';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors({origin: true}));

// get reference to the client build directory
const staticFiles = express.static(path.join(__dirname, '../../client/build'));

// pass the static files (react app) to the express app. 
app.use(staticFiles);

const router = express.Router();

// Creates the endpoint for our webhook 
router.post('/', (req, res) => {  
  console.log('POST webhook');
  const body = req.body;
  
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.map((entry) => {
          // Gets the message. entry.messaging is an array, but 
          // will only ever contain one message, so we get index 0

          let webhook_event = entry.messaging[0];
          // console.log(webhook_event);
          entry.messaging.map((mesgData) => {
              const messageItem = mesgData.message.text;
              const threadId = mesgData.thread.id;

              console.log('thread id', threadId);
              console.log('message', messageItem);
              if (messageItem) {
                  messageItem.match(/(http:|https:|)\/\/(player.|www.|.+)?(youtu(be\.com|\.be|be\.googleapis\.com))\/(medias|video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

                  
                  if (!RegExp.$3) {
                      console.log('Not event a url');
                      res.status(200).send('Not event a url');
                  } else if (RegExp.$3.indexOf('youtu') > -1) {
                      // type = 'youtube';
                      // console.log(message);
                      var video_id = messageItem.split('v=')[1];

                      if (video_id) {
                          var ampersandPosition = video_id.indexOf('&');
                      
                          if(ampersandPosition != -1) {
                              video_id = video_id.substring(0, ampersandPosition);
                          }
                          appStartDefine(video_id, threadId, () => {
                            console.log('Response of api');
                            res.sendStatus(200);
                          });
                      } else {
                        res.status(200).send('Incorrect Youtube url');
                      }
                  }
              }
          })



          // console.log(index, 'body Data haru', entryData);
      })
      /* body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
          console.log('yeta xau');
          console.log(webhook_event);

      let details = webhook_event;

      debugger;

      if (details.message) {
          details.message.text.match(/(http:|https:|)\/\/(player.|www.|.+)?(youtu(be\.com|\.be|be\.googleapis\.com))\/(medias|video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

          if (RegExp.$3.indexOf('youtu') > -1) {
              // type = 'youtube';
              // console.log(message);

              var video_id = message.body.split('v=')[1];
              var ampersandPosition = video_id.indexOf('&');
              if(ampersandPosition != -1) {
                  video_id = video_id.substring(0, ampersandPosition);
              }

              loadGoogleAuth(video_id);


              console.log('Response of api');


          }
      }
      }); */

      // Returns a '200 OK' response to all requests
      
  } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
  }

});

/* router.get('/authStart', (req, res) => {
  console.log('Auth entered');
  loadGoogleAuth('vFN3eNe0_Hs');
  res.send(req.query);
})

router.get('/getToken', (req, res) => {
  console.log(req.query.verify);

  if (req.query.verify) {
      completeNewToken(req.query.verify);
  }

  res.send(req.query);
}) */

// Adds support for GET requests to our webhook
router.get('/', (req, res) => {

  console.log('GET webhook');
  console.log('verify', process.env.VERIFY_TOKEN);
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});




var serviceAccount = require('./tgif-music-firebase.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://fuse-tgif.firebaseio.com"
});


const appStartDefine = (videoID, threadId, callBack) => {
  console.log('GET webhook appStartDefine');

    

  let obj = {
      videoID,
      time: (new Date()).getTime()
  }
  let userRef = firebase.database().ref(`/TGIF/${threadId}/${obj.time}`)
  // let userRef = firebase.database().ref(`/TGIFTechnology`)
  
  userRef.set(obj).then((snap) => {
    console.log('Data Saved Successfully');
    callBack();
  }).catch((err) => {
    console.log('Error occured');
    console.log(err);
    callBack();
  })

  /* const {userId} = req.query;
db.ref(`words/${userId}`).once('value')
  .then( snapshot => {
    res.send(snapshot.val());
  }); */

  /* userRef.once('value').then((snap) => {
      console.log(snap.val());
  }) */

  /* userRef.orderByKey().limitToFirst(1).once('value', (snap) => {
      console.log(snap.val());
    }); */
}


// Creates the endpoint for our webhook 
router.get('/appStartDefine', (req, res) => {
  appStartDefine('DH4ugAjuCHA', '', () => {})

  res.status(200).send('EVENT_RECEIVED');
  //res.sendStatus(403);
});

router.post('/appStart', (req, res) => {
  console.log('GET webhook');
  res.status(200).send('EVENT_RECEIVED');
});







//Get 1st music when App Start
router.get('/appStart', (req, res) => {
  const userRef = firebase.database().ref(`/TGIF/t_${req.query.groupId}`)
  // userRef.limitToLast(1).once('value')
  userRef.orderByValue().once('value', (snap) => {
    // console.log(snap.val());
    res.status(200).send(snap.val());
  })/* 
  .catch((err) => {
      console.log(err);
      res.sendStatus(403)
  }) */
});

router.get('/getPlaylist', (req, res) => {
    const playlist = firebase.database().ref(`/TGIFTechnology`);

    playlist.once('value').then((snap) => {
        // console.log(snap.val());
        res.status(200).send(snap.val());
    }).catch((err) => {
        console.log(err);
        res.sendStatus(403)
    })
})

app.get('/deteteVideo', (req, res) => {
  let userRef = firebase.database().ref(`/TGIFTechnology`)
 
  if (req.query.videoId) {
      const videoIdRef = req.query.videoId
      // console.log(videoIdRef);
    
        const childVideo = userRef.child(videoIdRef);

      childVideo.once('value')
      .then((snap) => {
          console.log('deleteSnap', snap.val());
          if (snap.val() != null) {
              console.log('delete started')
              childVideo.remove((err) => {
                if (err) {
                    console.log('err', err);
                    res.status(403).send(err);
                } else {
                    res.sendStatus(204);
                }
              });
              
              
          }
      }).catch((err) => {
          console.log(err);
          res.sendStatus(403)
      })

      /* return childVideo.remove()
        .then(() => {
            console.log('delete successfully');
            // res.sendStatus(204)
        }).catch((err) => {
            console.log(err);
            // res.sendStatus(403)
        }) */
  }
})








router.post('/groupName', (req, res) => {  
  // res.status(200).send('EVENT_RECEIVED');
  const { groupId, createdBy, groupName } = req.body;
  const obj = {
    groupId,
    createdBy,
    groupName,
    createdOn: (new Date()).toLocaleDateString()
  }
  const userRef = firebase.database().ref(`/Groups/${obj.groupId}`)
  // let userRef = firebase.database().ref(`/TGIFTechnology`)

  userRef.set(obj).then((snap) => {
    console.log('Group Data Saved Successfully');
    res.status(200).send(obj);
  }).catch((err) => {
    console.log('Error occured');
    console.log(err);
    res.status(400).send(err);
  })
})

router.get('/groupName', (req, res) => {  
  const userRef = firebase.database().ref(`/Groups`)
  userRef.orderByValue().once('value', (snap) => {
    res.status(200).send(snap.val());
  })
});

  













app.use(router);

app.use('/app/*', staticFiles)

app.listen(port, () => console.log(`Listening on port ${port}`));