'use strict';

var player;
function onYouTubeIframeAPIReady() {
  var player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'QH2-TGUlwu4',
    events: {
      'onReady': onPlayerReady(player)
    }
  });
  return player;
}

function onPlayerReady(event) {
  var playButton = document.getElementById("play-button");
  playButton.addEventListener("click", function() {
   player.playVideo();
  });
  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function() {
    player.pauseVideo();
  });
}

function setUpPlayer() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player = onYouTubeIframeAPIReady(player);
}

function initializeEventHandlers() {
  setUpPlayer();
}

$(document).ready(initializeEventHandlers)
