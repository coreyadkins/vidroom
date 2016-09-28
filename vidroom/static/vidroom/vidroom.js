'use strict';

// Youtube API Setup
// 1. Input
var player;

// 2. Transform

// 3. Create

// 4. Modify and Synchronize
/**
 * Returns the current time on the video in the player, in seconds.
 */
function getVideoTime() {
  return player.getCurrentTime();
}
/**
 * Plays the YouTube Video.
 */
function playVideo() {
  player.playVideo();
}

/**
 * Pauses the YouTube Video.
 */
function pauseVideo() {
  player.pauseVideo();
}

/**
 * Cues the inputted video by ID number.
 */
function cueVideo(videoID) {
  player.cueVideoById(videoID, 0.0, 'large');
}
/**
 * Seeks the video to the inputted time.
 */
function videoSeekTo(time) {
  player.seekTo(time);
}
/**
 * Sets up event handlers on YouTube API to run specific sequences corresponding
 * to the type of event.
 *
 * Run by onYouTubeIframeAPIReady function on any video event change.
 */
function onPlayerStateChange(event) {
  var videoEventType = event.data;
  if(videoEventType === 0) {
    serveNextVideo(); //eslint-disable-line no-use-before-define
  }
  if (videoEventType === 1) {
    initializeVideoEventHandlers('play'); //eslint-disable-line no-use-before-define
  }
  if (videoEventType === 2) {
    initializeVideoEventHandlers('pause'); //eslint-disable-line no-use-before-define
  }
}

/**
 * Sets up the YouTube iFrame player, then runs onPlayerStateChange, which
 * handles events related to the player, and runs runStatusQueryLoop, which sets
 * up a loop querying the server for new data.
 *
 * Run by the YouTube API script which is imported from a separate module in the
 * HTML.
 *
 * This script from YouTube API Docs,
 * https://developers.google.com/youtube/iframe_api_reference
*/
function onYouTubeIframeAPIReady() { // eslint-disable-line no-unused-vars
  player = new YT.Player('player', { // eslint-disable-line no-undef
    height: '600',
    width: '90%',
    videoId: 'QH2-TGUlwu4',
    events: {
      'onReady': runStatusQueryLoop, //eslint-disable-line no-use-before-define
      'onStateChange': onPlayerStateChange //eslint-disable-line no-use-before-define
    }
  });
}

/**
 * Sets up the YouTube player script which runs the code to create the YouTube
 * player.
 *
 * Run by the YouTube API script which is imported from a separate module in the
 * HTML.
 *
 * This script from YouTube API Docs,
 * https://developers.google.com/youtube/iframe_api_reference
 */
function setUpYoutubePlayerScript() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 5. Main

// 6. Register

// Video Events
// 1. Input
var VIDEO_EVENT_LOG_URL = $('.player').data().log;
var _mostRecentVideoEventTime;
var _mostRecentVideoEventType;

// 2. Transform
/**
 * Transforms inputted event data into format acceptable by Ajax Json call.
 */
function _formatVideoEventDataForJson(eventType, time) {
  return {'event_type': eventType, 'video_time': time};
}

/**
 * Checks an inputted event against the most recent event time stored in global
 * variable. Returns bool value True if it is different.
 */
function checkIfNewVideoEvent(videoEvent) {
  if (videoEvent.timestamp !== _mostRecentVideoEventTime) {
    return true;
  } else {
    return false;
  }
}

// 3. Create

// 4. Modify and Synchronize
/**
 * Sends an AJAX call to the server to log each pause or play video event after
 * inputted by the user.
 */
function logVideoEvent(eventType, time, actionURL) {
  var submitMethod = 'post';
  var formData = _formatVideoEventDataForJson(eventType, time);
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod,
    data: formData
  }));
}

// 5. Main
/**
 * Called on user input event handler, logs a play video event to the server,
 * then plays the video.
 */
function runPlaySequence() {
  var time = getVideoTime();
  logVideoEvent('play', time, VIDEO_EVENT_LOG_URL).
    then(function() {
      playVideo();
    });
}

/**
 *  Called on user input event handler, logs a pause video event to the server,
 *  then pauses the video.
 */
function runPauseSequence() {
  var time = getVideoTime();
  logVideoEvent('pause', time, VIDEO_EVENT_LOG_URL).
    then(function() {
      pauseVideo();
    });
}

// 6. Register
/**
 * Takes the most recent video event returned by the server query, detects if it
 * is a new event, if so runs the necessary sequences to follow through with the
 * event and make sure that client is up to date with all other clients.
 */
function registerVideoEvent(videoEvent) {
  var isNewVideoEvent = checkIfNewVideoEvent(videoEvent);
  if (isNewVideoEvent) {
    _mostRecentVideoEventTime = videoEvent.timestamp;
    videoSeekTo(videoEvent.video_time_at);
    if (videoEvent.event_type === 'play') {
      playVideo();
      _mostRecentVideoEventType = 'play';
    } else if (videoEvent.event_type === 'pause') {
      pauseVideo();
      _mostRecentVideoEventType = 'pause';
    }
  }


}
/**
 * Sets up event handlers to run correct sequences on user video input event of
 * pause or play.
 */
function initializeVideoEventHandlers(videoEventType) {
  if (videoEventType === 'play' &
      videoEventType !== _mostRecentVideoEventType) {
    runPlaySequence();
  } else if (videoEventType === 'pause' &
             videoEventType !== _mostRecentVideoEventType) {
    runPauseSequence();
  }
}

// Playlist
// 1. Input
var PLAYLIST_ENTRY_ADD_URL = $('#playlistform').attr('action');
var PLAYLIST_ENTRY_REM_URL = $('#playlistform').data().remove;
var PLAYLIST_REORDER_URL = $('#playlistform').data().move;
var _mostRecentPlaylist;
var _currentVideoID;

/**
 * Pulls user inputted data from playlist form.
 */
function getPlaylistInput() {
  return $('#playlistinput').val();
}

// 2. Transform
/**
 * Transforms inputted playlist entry add data into format acceptable by Ajax
 * Json call.
 */
function _formatEntryAddDataForJson(videoID) {
  return {'video_id': videoID};
}

/**
 * Transforms inputted playlist entry remove data into format acceptable by Ajax
 * Json call.
 */
function _formatEntryRemoveDataForJson(videoID, entryID) {
  return {'video_id': videoID, 'id': entryID};
}

/**
 * Transforms inputted playlist entry move data into format acceptable by Ajax
 * Json call.
 */
function _formatReorderDataForJson(videoID, entryID, position) {
  return {'video_id': videoID, 'id': entryID, 'new_position': position};
}

/**
* Takes a Youtube URL, parses it and returns the videoID, which is located under
* the 'v' GET query parameter.
*
* Adapted from function by communitywiki on StackOverflow, located at:
* http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */
function getVideoID(url) {
  var name = 'v';
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Returns the length of the current playlist.
 */
function getPlaylistLength() {
  return _mostRecentPlaylist.length;
}

/**
 * Checks an inputted playlist against the most recent playlis stored in global
 * variable. Returns bool value True if it is a new playlist.
 */
function checkIfNewPlaylist(playlist) {
  if (_.isEqual(playlist, _mostRecentPlaylist)) {
    return false;
  } else {
    return true;
  }
}

// 3. Create
/**
 * Creates a YouTube URL from an inputted YouTube Video ID.
 */
function createYoutubeUrl(videoID) {
  return 'https://www.youtube.com/watch?v=' + videoID;
}

/**
 * Creates a new list element with an id corresponding to the videoID,
 * a thumbnail preview image, and a link to a video url to be inserted into the
 * playlist.
 */
function createPlaylistItem(videoID, entryID, title) {
  var url = createYoutubeUrl(videoID);
  var deleteButton = '<a class="deletebutton" href="' + PLAYLIST_ENTRY_REM_URL +
   '">X' + '</a>';
  var img = '<img src="http://img.youtube.com/vi/' + videoID + '/sddefault.jp' +
   'g" height="50" width="50">';
  return $('<li id="' + videoID + '" data-id="' + entryID + '">' + img +
          '<span>' + title + '</span><a class="link" href=' + url + '>Link' +
          '</a>' + deleteButton + '</li>');
}

// 4. Modify and Synchronize
/**
 * Updates the playlist on the DOM with the newly created element.
 */
function appendPlaylist(playlistItem) {
  $('ul').append(playlistItem);
}

/**
 * Sends a request to the YouTube Data API to retrieve the title of the YouTube
 * video.
 */
function retrieveVideoTitle(videoID) {
  var actionURL = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoID +
                '&key=' + GOOGLE_API_KEY + '&fields=items(snippet(title))&par' + //eslint-disable-line no-undef
                't=snippet';
  var submitMethod = 'get';
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod
  }));
}


/**
 * Logs a new playlist entry to the server.
 */
function logPlaylistAdd(videoID) {
  var actionURL = PLAYLIST_ENTRY_ADD_URL;
  var submitMethod = 'post';
  var formData = _formatEntryAddDataForJson(videoID);
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod,
    data: formData
  }));
}

/**
 * Logs deletion of a playlist entry to the server.
 */
function logPlaylistRemove(videoID, entryID, actionURL) {
  var submitMethod = 'post';
  var formData = _formatEntryRemoveDataForJson(videoID, entryID);
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod,
    data: formData
  }));
}

/**
 * Logs a playlist entry changing position to the server.
 */
function logPositionChange(videoID, entryID, newPosition) {
  var submitMethod = 'post';
  var actionURL = PLAYLIST_REORDER_URL;
  var data = _formatReorderDataForJson(videoID, entryID, newPosition);
  return Promise.resolve($.ajax({
    data: data,
    url: actionURL,
    method: submitMethod
  }));
}

// 5. Main
/**
 * Submits AJAX API requests for all of the video titles in the playlist,
 * appends promises for these into an array that it returns.
 */
function retrieveAllVideoTitles() {
  var videoTitles = [];
  for (var i = 0; i < _mostRecentPlaylist.length; i += 1) {
    videoTitles.push(retrieveVideoTitle(_mostRecentPlaylist[i].video_id));
  }
  return videoTitles;
}

/**
 * Creates a new playlist element and updates it to the playlist. Runs function
 * which sets up the delete button handler on the entry.
 */
function updatePlaylistDisplay(videoID, entryID, title) {
  var playlistItem = createPlaylistItem(videoID, entryID, title);
  appendPlaylist(playlistItem);
  var entry = $('#' + videoID);
  initializeDeleteButtonHandler(entry); //eslint-disable-line no-use-before-define
}

/**
 * Called when a new (or newly ordered) playlist is received, sets this playlist
 * as most recent, clears the current DOM displayed playlist, and repopulates
 * with the new playlist.
 *
 * First fulfills all promises to retrieve video titles from YouTube Data API to
 * ensure items are appended in the correct order.
 */
function updatePlaylist(playlist) {
  _mostRecentPlaylist = playlist;
  $('#playlistqueue').empty();
  Promise.all(retrieveAllVideoTitles()).
    then(function(jsonResponseArray) {
      for (var i = 0; i < playlist.length; i += 1) {
        var title = jsonResponseArray[i].items[0].snippet.title;
        var videoID = playlist[i].video_id;
        var entryID = playlist[i].id;
        updatePlaylistDisplay(videoID, entryID, title);
      }
    });
}


/**
 * Called when user adds new playlist entry via form, logs this playlist entry
 * to the server.
 */
function addPlaylistEntry() {
  var url = getPlaylistInput();
  var videoID = getVideoID(url);
  logPlaylistAdd(videoID);
}
/**
  * Called when user deletes a playlist entry via the delete button. Logs this
  * entry delete to the server.
  */
function removePlaylistEntry(entry) {
  var actionURL = entry.children('.deletebutton').attr('href');
  var videoID = entry.attr('id');
  var entryID = entry.data().id;
  logPlaylistRemove(videoID, entryID, actionURL);
}

/**
 * Finds the next video in the playlist, logs the position changes of the
 * previous video and next video to the server, cues the YouTube player to play
 * the next video, then updates the global variable holding the current video.
 */
function serveNextVideo() {
  var nextVideoID = _mostRecentPlaylist[1].video_id;
  var nextEntryID = _mostRecentPlaylist[1].id;
  var bottomPosition = getPlaylistLength();
  logPositionChange(_currentVideoID, nextEntryID, bottomPosition);
  logPositionChange(nextVideoID, nextEntryID, 0);
  cueVideo(nextVideoID);
  _currentVideoID = nextVideoID;
}

/**
 * Called when the user moves a new video into the top of the playlist,
 * indicating that they want to now play this video. Cues the YouTube player
 * to play the video, then updates the global variable holding the current video.
 */
function serveNewVideo(newVideoID) {
  cueVideo(newVideoID);
  _currentVideoID = newVideoID;
}

// 6. Register
/**
 * Called on each entry each time the playlist is updated, sets up event handler
 * to send delete log to the server on user click of the delete button.
 */
function initializeDeleteButtonHandler(entry) {
  entry.children('.deletebutton').on('click', function(event) {
    event.preventDefault();
    removePlaylistEntry(entry);
  });
}


/**
 * Takes in the playlist returned by the server query, detects if it is a new
 * playlist, if it is, runs the main to update the playlist.
 *
 * Then tests if the first entry has changed, and if so, cues up the new video.
 *
 * If a new playlist entry is in the first position of the playlist, runs
 * function to play that video
 */
function registerPlaylist(playlist) {
  playlist = _.sortBy(playlist, 'position');
  var isNewPlaylist = checkIfNewPlaylist(playlist);
  if (isNewPlaylist) {
    updatePlaylist(playlist);
    if (_.isEqual(_mostRecentPlaylist[0], _currentVideoID) !== true) {
      serveNewVideo(_mostRecentPlaylist[0].video_id);
    }
  }
}
/**
 * Initializes Event Handlers related to the submit form and reorder item
 * actions on the playlist..
 */
function initializePlaylistHandlers() {
  $('#playlistform').on('submit', function(event) {
    event.preventDefault();
    addPlaylistEntry();
  });
  $(function() {
    $('#playlistqueue').sortable({
      stop: function(event, ui) {
        var movedEntry = $(ui.item);
        var newPosition = ui.item.index();
        var movedVideoID = movedEntry.attr('id');
        var movedEntryID = movedEntry.data().id;
        logPositionChange(movedVideoID, movedEntryID, newPosition);
      }
    });
  });
}


// Server Querying
// 1. Input
var STATUS_QUERY_URL = $('.player').data().query;

// 2. Transform

// 3. Create

// 4. Modify and Synchronize
/**
 * Sends a query to the server for the most recent event and playlist.
 */
function queryServerForStatus() {
  var submitMethod = 'get';
  var actionURL = STATUS_QUERY_URL;
  return Promise.resolve($.ajax({
    dataType: 'json',
    url: actionURL,
    method: submitMethod
  }));
}

// 5. Main
/**
 * Takes the playlist and most recent video event returned from the Server Query,
 * pipes those into the respective functions to update the page.
 */
function registerServerQuery(JsonResponse) {
  registerVideoEvent(JsonResponse.event);
  registerPlaylist(JsonResponse.playlist);
}
// 6. Register

/**
 * Queries the server for the most recent status every 100 milliseconds, then
 * sends response into registerServerQuery which pipes response into modules.
 *
 * Run by onYouTubeIframeAPIReady function on player ready.
 */
function runStatusQueryLoop() {
  setInterval(function() {
    queryServerForStatus().
      then(registerServerQuery);
  }, 100);
}

//Main
// 1. Input

// 2. Transform

// 3. Create

// 4. Modify and Synchronize
/**
 * Creates a prompt to encourage the user to copy the path to the VidRoom to
 * their clipboard.
 */
function windowPrompt() {
  window.prompt('VidRoom Created! Copy the URL to your clipboard to return to' +
   ' it at any time. Just hit Ctrl + C', window.location.href);
}

// 5. Main

// 6. Register
/**
 * Initializes page setup runs component modules.
 */
function initializeSetup() {
  windowPrompt();
  setUpYoutubePlayerScript();
  initializePlaylistHandlers();
}

$(document).ready(initializeSetup);
