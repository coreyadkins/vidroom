'use strict';

// Clean up code and add doc comments. Might be a better way to structure it.

var _mostRecentEvent = {event_type: "pause", video_time_at: 0}

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
    var actionURL = $("#query-url").data()['url']
    return Promise.resolve($.ajax ({
        dataType: 'json',
        url: actionURL,
        method: submitMethod
    }));
}

function checkIfNewEvent(event) {
    if (event.event_type === _mostRecentEvent.event_type & event.video_time_at === _mostRecentEvent.video_time_at ) {
        return false
    } else {
        return true
    }
}

function registerCommand(eventJson) {
    var event = eventJson
    var isNewEvent = checkIfNewEvent(eventJson)
    if (isNewEvent) {
        _mostRecentEvent = event
        player.seekTo(event.video_time_at)
        if (event.event_type === 'play') {
        player.playVideo()
        } else if (event.event_type === 'pause') {
        player.pauseVideo()
        }
    }
}

function onPlayerReady(event) {
  var playButton = $("#play-button");
  playButton.on("click", function(event) {
   var actionURL = playButton.data()['url']
   var time = player.getCurrentTime();
   serverLogEvent('play', time, actionURL).
       then(player.playVideo);
   });
  var pauseButton = $("#pause-button");
  pauseButton.on("click", function() {
   var actionURL = pauseButton.data()['url']
   var time = player.getCurrentTime();
   serverLogEvent('play', time, actionURL).
       then(player.playVideo);
   });
   setInterval(function() {
   queryServerForEvents().
     then(registerCommand)
   }, 1000)
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