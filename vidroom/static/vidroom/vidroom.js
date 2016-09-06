'use strict';

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    height: '390',
    width: '90%',
    videoId: 'QH2-TGUlwu4',
    playerVars: {
      controls: 0
    },
    events: {
      'onReady': onPlayerReady
    }
  });
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

var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function addToPlaylist() {
    var url = $('input').val()
    var playlistItem = $('<li><a href=' + url + '>' + url + '</a></li>')
    $('ul').append(playlistItem)
}

function initializeEventHandlers() {
    $('form').on('submit', function(event) {
    event.preventDefault();
    addToPlaylist();
    })
}


$(document).ready(initializeEventHandlers);