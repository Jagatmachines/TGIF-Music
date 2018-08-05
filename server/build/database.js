'use strict';

var firebase = require('firebase-admin');

var serviceAccount = require('./tgif-music-firebase.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://tgif-music.firebaseio.com"
});

function appStartDefine() {
    console.log('GET webhook');

    var obj = {
        videoID: 'DH4ugAjuCHA'
    };

    var userRef = firebase.database().ref('/TGIFTechnology/' + obj.videoID);
    // let userRef = firebase.database().ref(`/TGIFTechnology`)

    userRef.push(obj);

    /* const {userId} = req.query;
    db.ref(`words/${userId}`).once('value')
    .then( snapshot => {
      res.send(snapshot.val());
    }); */

    userRef.once('value').then(function (snap) {
        console.log(snap.val());
    });

    userRef.orderByKey().limitToFirst(1).once('value', function (snap) {
        console.log(snap.val()); // first item, in format {"<KEY>": "<VALUE>"}
    });
}

function appStart(request, response) {
    var userRef = firebase.database().ref('/TGIFTechnology');

    userRef.limitToLast(1).once('value').then(function (snap) {
        console.log(snap.val());
        response(true);
    }).catch(function (err) {
        console.log(err);
        response(false);
    });
}

function deleteVideoId(videoId, response) {

    var userRef = firebase.database().ref('/TGIFTechnology');
    var videoIdRef1 = req.query.videoId;
    console.log(videoIdRef1);

    var childVideo = userRef.child(videoIdRef1);

    childVideo.once('value').then(function (snap) {
        console.log('deleteSnap', snap.val());
        if (snap.val() != null) {
            console.log('delete started');
            childVideo.remove().then(function () {
                console.log('delete successfully');
                res.sendStatus(204);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(403);
            });
        }
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(403);
    });
}

module.exports = { appStartDefine: appStartDefine, appStart: appStart, deleteVideoId: deleteVideoId };