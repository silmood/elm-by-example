import './main.css';
import { Main } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';

var app = Main.embed(document.getElementById('root'));

app.ports.shareScreen.subscribe(function () {
  getUserScreen().then(function(stream)  {
    let screenVideo = document.getElementById("screen-container");
    screenVideo.srcObject = stream
  })

});


registerServiceWorker();

// Request Screen

function isFirefox() {
  var mediaSourceSupport = !!navigator.mediaDevices.getSupportedConstraints()
    .mediaSource;
  var matchData = navigator.userAgent.match(/Firefox\/(\d+)/);
  var firefoxVersion = 0;
  if (matchData && matchData[1]) {
    firefoxVersion = parseInt(matchData[1], 10);
  }
  return mediaSourceSupport && firefoxVersion >= 52;
}

function isChrome() {
  return 'chrome' in window;
}

function canScreenShare() {
  return isChrome || isFirefox;
}

function getUserScreen() {

  // You should replace this line with your extension id
  var extensionId = 'pgpaldnhddchngnplongafpaolglofjd';
  if (!canScreenShare()) {
    return;
  }
  if (isChrome()) {
    return new Promise((resolve, reject) => {
      const request = {
        sources: ['screen', 'window']
      };
      chrome.runtime.sendMessage(extensionId, request, response => {
        if (response && response.type === 'success') {
          resolve({ streamId: response.streamId });
        } else {
          reject(new Error('Could not get stream'));
        }
      });
    }).then(response => {
      return navigator.mediaDevices.getUserMedia({
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: response.streamId
          }
        }
      });
    });
  } else if (isFirefox()) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        mediaSource: 'screen'
      }
    });
  }
}