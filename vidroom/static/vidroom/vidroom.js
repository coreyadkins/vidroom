'use strict';

// Clean up code and add doc comments. Might be a better way to structure it.

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

function serverLogEvent(event_name, time, actionURL) {
    var submitMethod = 'post'
    var formData = {'event_type': event_name, 'video_time_at': time};
    return Promise.resolve($.ajax({
        dataType: 'json',
        url: actionURL,
        method: submitMethod,
        data: formData
    }));
}

function queryServerForEvents() {
    var submitMethod = 'get'
    var actionURL = document.getElementById("query-url").data()
    return Promise.resolve($.ajax ({
        dataType: 'json',
        url: actionURL,
        method: submitMethod
    }));
}

function onPlayerReady(event) {
  var playButton = document.getElementById("play-button");
  playButton.addEventListener("click", function(event) {
   var actionURL = playButton.data()
   var time = player.getCurrentTime();
   serverLogEvent('play', time, actionURL).
       then(player.playVideo);
   )});
  var pauseButton = document.getElementById("pause-button");
  pauseButton.addEventListener("click", function() {
   var actionURL = pauseButton.data()
   var time = player.getCurrentTime();
   serverLogEvent('play', time, actionURL).
       then(player.playVideo);
   )});
   setInterval(queryServerForEvents, 1000).
       then(checkIfNewEvent).
       then(registerCommand).
       then()
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
    window.prompt('VidRoom Created! Copy the URL to your clipboard to return to it at any time. Just hit Ctrl + C',
    window.location.href)
    $('form').on('submit', function(event) {
    event.preventDefault();
    addToPlaylist();
    })
}


$(document).ready(initializeEventHandlers);