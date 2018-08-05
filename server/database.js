const firebase = require('firebase-admin');

const serviceAccount = require('./tgif-music-firebase.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://tgif-music.firebaseio.com"
});


function appStartDefine () {
  console.log('GET webhook');

  let obj = {
      videoID: 'DH4ugAjuCHA'
  }

  let userRef = firebase.database().ref(`/TGIFTechnology/${obj.videoID}`)
  // let userRef = firebase.database().ref(`/TGIFTechnology`)
  
  userRef.push(obj);

  /* const {userId} = req.query;
db.ref(`words/${userId}`).once('value')
  .then( snapshot => {
    res.send(snapshot.val());
  }); */

  userRef.once('value').then((snap) => {
      console.log(snap.val());
  })

  userRef.orderByKey().limitToFirst(1).once('value', (snap) => {
      console.log(snap.val()); // first item, in format {"<KEY>": "<VALUE>"}
    });
}

function appStart (request, response) {
  let userRef = firebase.database().ref(`/TGIFTechnology`)
    
  userRef.limitToLast(1).once('value')
  .then((snap) => {
      console.log(snap.val());
      response(true);
  }).catch((err) => {
      console.log(err);
      response(false);
  })
}

function deleteVideoId (videoId, response) {
  
   
  let userRef = firebase.database().ref(`/TGIFTechnology`)
  const videoId = req.query.videoId
  console.log(videoId);

  const childVideo = userRef.child(videoId)

  childVideo.once('value')
  .then((snap) => {
      console.log('deleteSnap', snap.val());
      if (snap.val() != null) {
          console.log('delete started')
          childVideo.remove().then(() => {
              console.log('delete successfully');
              res.sendStatus(204)
          }).catch((err) => {
              console.log(err);
              res.sendStatus(403)
          })
      }
  }).catch((err) => {
      console.log(err);
      res.sendStatus(403)
  })
}





module.exports = { appStartDefine, appStart, deleteVideoId };