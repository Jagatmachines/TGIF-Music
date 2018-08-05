var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2ClientUni;




const {GoogleAuth, JWT} = require('google-auth-library');
// const keys = require('./client_secret_service.json');


















// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */



function authorize(credentials, requestData, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}





/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, requestData, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  
  oauth2ClientUni = oauth2Client;

  console.log('Authorize this app by visiting this url: ', authUrl);
  /* var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  }); */
}

function completeNewToken (code) {

  let playlistItem =  
  {
    'params': {
      'part': 'snippet',
      'onBehalfOfContentOwner': ''
    },
    'properties': {
      'snippet.playlistId': 'PLRBYBgTvgBPgBGNNU854jN8jsyFojJgQs',
      'snippet.resourceId.kind': 'youtube#video',
      'snippet.resourceId.videoId': 'vFN3eNe0_Hs',
      'snippet.position': ''
    }
  }

  oauth2ClientUni.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    oauth2ClientUni.credentials = token;
    storeToken(token);
    playlistItemsInsert(oauth2ClientUni, playlistItem)
    // callback(oauth2Client, requestData);
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  var service = google.youtube('v3');
  service.playlistItems.insert({
    auth: auth,
    "resourceId": {
      "kind": "youtube#video",
      "videoId": "aA_pxW-txyI"
    },
    part: 'snippet,contentDetails',
    id: 'PLRBYBgTvgBPgBGNNU854jN8jsyFojJgQs',
    

  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    // var channels = response.data.items;
    console.log(response);
    /* if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    } */
  });
}

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}


function playlistItemsInsert(auth, requestData) {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  parameters['resource'] = createResource(requestData['properties']);
  service.playlistItems.insert(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    // console.log(response.body);
  });

  service.playlistItems.list({'maxResults': '25',
  'part': 'snippet,contentDetails',
  'playlistId': 'PLRBYBgTvgBPgBGNNU854jN8jsyFojJgQs'
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
      console.log(response);
    }
  })
}




/* function playlistItem(videoId) {
  let playlist =  
  {
    'params': {
      'part': 'snippet',
      'onBehalfOfContentOwner': ''
    },
    'properties': {
      'snippet.playlistId': 'PLRBYBgTvgBPgBGNNU854jN8jsyFojJgQs',
      'snippet.resourceId.kind': 'youtube#video',
      'snippet.resourceId.videoId': videoId,
      'snippet.position': ''
    }
  }

  return playlist;
} */


// const playlist = playlistItem();

// Load client secrets from a local file.
function loadGoogleAuth(videoId) {
  let playlistItem =  
  {
    'params': {
      'part': 'snippet',
      'onBehalfOfContentOwner': ''
    },
    'properties': {
      'snippet.playlistId': 'PLRBYBgTvgBPgBGNNU854jN8jsyFojJgQs',
      'snippet.resourceId.kind': 'youtube#video',
      'snippet.resourceId.videoId': videoId,
      'snippet.position': ''
    }
  }



  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    authorize(JSON.parse(content), playlistItem, playlistItemsInsert);
  
  });
}

module.exports = {loadGoogleAuth, completeNewToken}
