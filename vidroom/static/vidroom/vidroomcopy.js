'use strict';

// Video Events
// 1. Input

// 2. Transform

// 3. Create

// 4. Modify and Synchronize

// 5. Main

// 6. Register
/**
 *
 */
function registerVideoEventChange(videoEvent) {
  var isNewVideoEvent = checkIfNewVideoEvent(videoEvent);
  if (isNewVideoEvent) {
    _mostRecentVideoEventTime = videoEvent.timestamp;
    player.seekTo(videoEvent.video_time_at);
    if (videoEvent.event_type === 'play') {
      playVideo();
      mostRecentVideoEventType = 'play';
    } else if (videoEvent.event_type === 'pause') {
      pauseVideo();
      mostRecentVideoEventType = 'pause';
    }
  }


}
/**
 *
 */
function initializeVideoEventHandlers(videoEventType) {
  if (videoEventType === 'play' & videoEventType !== _mostRecentVideoEventType) {

  }
  else if (videoEventType === 'pause' & videoEventType !== _mostRecentVideoEventType) {

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
 * Transforms inputted playlist entry data into format acceptable by Ajax Json
 * call.
 */
function _formatEntryDataForJson(videoID) {
  return {'video_id': videoID};
}

/**
 *
 */
function _formatReorderDataForJson(videoID, position) {
  return {'video_id': videoID, 'new_position': position};
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

/**
 * Returns the next video in _mostRecentPlaylist, by finding the current video
 * position and then adding one to the position. If the current video is the
 * last in the list, determined by testing if the next video would be undefined,
 * returns to the beginning of the playlist.
 */
function findNextVideo() {
  var currentPosition = _.findIndex(_mostRecentPlaylist, _currentVideoID);
  var nextVideo = _mostRecentPlaylist[currentPosition + 1];
  if (nextVideo === undefined) {
    nextVideo = _mostRecentPlaylist[0];
  }
  return nextVideo;
}
// 3. Create
/**
 * Creates a new list item containing urls to be inserted into the playlist.
 */
function createPlaylistItem(videoID) {
  var url = createYoutubeUrl(videoID);
  var deleteButton = '<a class="deletebutton" href="' + PLAYLIST_ENTRY_REM_URL +
   '">X' + '</a>';
  var img = '<img src="http://img.youtube.com/vi/' + videoID + '/sddefault.jp' +
   'g" height="50" width="50">';
  return $('<li id="' + videoID + '">' + img + '<a class="link" href=' + url +
   '>Link' + deleteButton + '</a></li>');
}

// 4. Modify and Synchronize
/**
 * Updates the playlist with the newly created element.
 */
function appendPlaylist(playlistItem) {
  $('ul').append(playlistItem);
}
/**
 * Serves the url for the new playlist entry to the server to the be saved.
 */
function logPlaylistAdd(videoID) {
  var actionURL = PLAYLIST_ENTRY_ADD_URL;
  var submitMethod = 'post';
  var formData = _formatEntryDataForJson(videoID);
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod,
    data: formData
  }));
}

/**
 * Serves the delete request for the playlist entry to the server to be saved.
 */
function logPlaylistRemove(videoID, actionURL) {
  var submitMethod = 'post';
  var formData = _formatEntryDataForJson(videoID);
  return Promise.resolve($.ajax({
    url: actionURL,
    method: submitMethod,
    data: formData
  }));
}

/**
 * Logs a playlist entry changing position to the server.
 */
function logPositionChange(videoID, newPosition) {
  var submitMethod = 'post';
  var actionURL = PLAYLIST_REORDER_URL;
  var data = _formatReorderDataForJson(videoID, newPosition);
  return Promise.resolve($.ajax({
    data: data,
    url: actionURL,
    method: submitMethod
  }));
}

// 5. Main
/**
 * Creates a new playlist item and updates it to the playlist.
 */
function updatePlaylistDisplay(videoID) {
  var playlistItem = createPlaylistItem(videoID);
  appendPlaylist(playlistItem);
}

/**
 *
 */
function updatePlaylist(playlist) {
  _mostRecentPlaylist = playlist;
  $('#playlistqueue').empty();
  for (var i = 0; i < playlist.length; i += 1) {
    var videoID = playlist[i];
    updatePlaylistDisplay(videoID);
  }
}


/**
 * Piping function to add new user inputted field into the playlist.
 */
function addPlaylistEntry() {
  var url = getPlaylistInput();
  var videoID = getVideoID(url);
  logPlaylistAdd(videoID);
}
/**
  * Removes a entry from the playlist that has been deleted by a user clicking
  * the deleteButton.
  */
function removePlaylistEntry(entry) {
  var actionURL = entry.children('.deletebutton').attr('href');
  var videoID = entry.attr('id');
  logPlaylistRemove(videoID, actionURL);
}

/**
 * Finds the next video in the playlist, serves it to the YouTube API to cue up,
 * then logs the position changes of the previous video and next video to the
 * server.
 */
function serveNextVideo() {
  var nextVideoID = findNextVideo();
  var bottomPosition = getPlaylistLength();
  logPositionChange(_currentVideoID, bottomPosition);
  logPositionChange(nextVideoID, 0);
  cueVideo(nextVideoID); // eslint-disable-line no-use-before-define
  _currentVideoID = nextVideoID;
}

// 6. Register
/**
 * Takes in the playlist returned by the server query, detects if it is a new
 * playlist, if it is, runs the main to update the playlist.
 *
 * Then creates the event handler for deleting an entry, so that is refreshed
 * for each playlist update.
 */
function registerPlaylistChange(playlist) {
  var isNewPlaylist = checkIfNewPlaylist(playlist);
  if (isNewPlaylist) {
    updatePlaylist(playlist);
    $('.deletebutton').on('click', function(event) {
      event.preventDefault();
      var deleteButton = $(event.target);
      var entry = deleteButton.parent();
      removePlaylistEntry(entry);
    });
  }
}
/**
 * Initializes Event Handlers related to the Playlist elements on page.
 */
function initializePlaylistHandlers() {
  $('#playlistform').on('submit', function(event) {
    event.preventDefault();
    addPlaylistEntry();
  });
  $(function() {
    $('#playlistqueue').sortable({
      stop: function(event, ui) {
        var entry = $(ui.item);
        var newPosition = ui.item.index();
        var videoID = entry.attr('id');
        logPositionChange(videoID, newPosition);
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
  registerVideoEventChange(JsonResponse.event);
  registerPlaylistChange(JsonResponse.playlist);
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

// Youtube API Setup
// 1. Input
var player;

// 2. Transform

// 3. Create
/**
 * Creates the script to run the YouTube player API.
 */
function createYoutubePlayerScript() {
  return $('script').attr({src: 'https://www.youtube.com/iframe_api'});
}

// 4. Modify and Synchronize
/**
 * Plays the YouTube Video.
 */
function playVideo() {
  player.playVideo();
}

/**
 * Pauses teh YouTube Video.
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
 * Sets up event handlers on YouTube API to run specific sequences corresponding
 * to the type of event.
 *
 * Run by onYouTubeIframeAPIReady function on any video event change.
 */
function onPlayerStateChange(event) {
  var videoEventType = event.data;
  if(videoEventType === 0) {
    serveNextVideo();
  }
  if (videoEventType === 1) {
    initializeVideoEventHandlers('play');
  }
  if (videoEventType === 2) {
    initializeVideoEventHandlers('pause');
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
    height: '390',
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
  var tag = createYoutubePlayerScript();
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


// 5. Main

// 6. Register

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
