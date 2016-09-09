'use strict';

// Global variable which stores the most recent event obtained from a server query. Default event is equivalent to
// default event created by server on creation of a new VidRoom.
var _mostRecentEvent = {event_type: 'pause', video_time_at: 0};

// 1. Input
var queryUrl = $('#query-url').data()['url'];
var playButton = $('#play-button');
var pauseButton = $('#pause-button');
var playEventUrl = playButton.data()['url'];
var pauseEventUrl = pauseButton.data()['url'];
var player;

/**
 * Pulls user inputted data from playlist form.
 */
function getPlaylistInput() {
    return $('input').val();
}

// 2. Transform

/**
 * Transforms inputted event data into format acceptable by Ajax Json call.
 */
function _format_event_data_for_json(event_name, time) {
    return {'event_type': event_name, 'video_time': time};
}

/**
 * Checks an inputted event against the most recent event stored in global variable. Returns bool value True if it is a
 * new event.
 */
function checkIfNewEvent(event) {
    if (event.event_type === _mostRecentEvent.event_type & event.video_time_at === _mostRecentEvent.video_time_at ) {
        return false;
    } else {
        return true;
    }
}

// 3. Create

/**
 * Creates a new list item containing urls to be inserted into the playlist.
 */
function createPlaylistItem(url) {
    return $('<li><a href=' + url + '>' + url + '</a></li>');
}

// 4. Modify and Synchronize

/**
 * Sets up the YouTube iFrame player, then runs initializePlayerHandlers function.
 *
 * This script from YouTube API Docs, https://developers.google.com/youtube/iframe_api_reference
*/
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    height: '390',
    width: '90%',
    videoId: 'QH2-TGUlwu4',
    playerVars: {
      controls: 0
    },
    events: {
      'onReady': initializePlayerHandlers
    }
  });
}

/**
 * Sends an AJAX call to the server to log each pause or play event inputted by the user.
 */
function serverLogEvent(event_name, time, actionURL) {
    var submitMethod = 'post';
    var formData = _format_event_data_for_json(event_name, time);
    return Promise.resolve($.ajax({
        url: actionURL,
        method: submitMethod,
        data: formData
    }));
}

/**
 * Queries the server for the most recent event associated with this VidRoom.
 */
function queryServerForEvent() {
    var submitMethod = 'get';
    var actionURL = queryUrl;
    return Promise.resolve($.ajax ({
        dataType: 'json',
        url: actionURL,
        method: submitMethod
    }));
}

/**
 * Takes the event returned from the server query, checks if it is a new event. If it is, pauses or plays the video\
 * according to the event type of the event.
 */
function registerServerEvent(eventJson) {
    var event = eventJson;
    var isNewEvent = checkIfNewEvent(eventJson);
    if (isNewEvent) {
        _mostRecentEvent = event;
        player.seekTo(event.video_time_at);
        if (event.event_type === 'play') {
        player.playVideo();
        } else if (event.event_type === 'pause') {
        player.pauseVideo();
        }
    }
}

/**
 * Sets up the YouTube player script which runs the code to create the YouTube player.
 *
 * This script from YouTube API Docs, https://developers.google.com/youtube/iframe_api_reference
 */
function setUpYoutubePlayerScript() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/**
 * Updates the playlist with the newly created element.
 */
function updatePlaylist(playlistItem) {
    $('ul').append(playlistItem)
}


/**
 * Creates a prompt to encourage the user to copy the path to the VidRoom to their clipboard.
 */
function windowPrompt() {
    window.prompt('VidRoom Created! Copy the URL to your clipboard to return to it at any time. Just hit Ctrl + C',
    window.location.href);
}


// 5. Main

/**
 * Piping function, runs through the sequence of events on a user pressing the play button.
 */
function runPlaySequence() {
    var time = player.getCurrentTime();
    serverLogEvent('play', time, playEventUrl).
        then(function(success) {
             player.playVideo
        });
}

/**
 * Piping function, runs through the sequence of events on a user pressing the pause button.
 */
function runPauseSequence() {
    var time = player.getCurrentTime();
    serverLogEvent('pause', time, pauseEventUrl).
         then(function(success) {
                player.playVideo
         });
}

/**
 * Sets up the functionality for querying the server for new events every 100 milliseconds.
 */
function runQueryLoop() {
    setInterval(function() {
    queryServerForEvent().
      then(registerServerEvent)
    }, 100)
}

/**
 * Piping function to add new user inputted field into the playlist.
 */
function addToPlaylist() {
    var url = getPlaylistInput();
    var playlistItem = createPlaylistItem(url);
    updatePlaylist(playlistItem);
}

// 6. Register

/**
 * Sets up the event handlers for pause and play elements. Run when YouTube player is successfully set up.
 */
function initializePlayerHandlers(event) {
  playButton.on("click", function(event) {
    runPlaySequence()
   });
  pauseButton.on("click", function() {
    runPauseSequence()
   });
  runQueryLoop()
}

/**
 * Initializes main event handlers on the page.
 */
function initializeEventHandlers() {
    windowPrompt();
    setUpYoutubePlayerScript();
    $('form').on('submit', function(event) {
        event.preventDefault();
        addToPlaylist();
    })

}

$(document).ready(initializeEventHandlers);