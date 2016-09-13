'use strict';

// Global variable which stores the most recent event obtained from a server query. Default event is equivalent to
// default event created by server on creation of a new VidRoom.
var _mostRecentEvent = {event_type: 'pause', video_time_at: 0};

// Global variable which stores the most recent playlist obtained from a server query.
var _mostRecentPlaylist;

// 1. Input
var statusQueryUrl = $('#query-url').data()['url'];
var playButton = $('#play-button');
var pauseButton = $('#pause-button');
var playEventUrl = playButton.data()['url'];
var pauseEventUrl = pauseButton.data()['url'];
var player;
var playlistRemUrl = $('.playlist form').data()['remove']
var playlistReorderUrl = $('.playlist form').data()['move']
/**
 * Pulls user inputted data from playlist form.
 */
function getPlaylistInput() {
    return $('#playlistinput').val();
}

// 2. Transform

/**
 * Transforms inputted event data into format acceptable by Ajax Json call.
 */
function _format_event_data_for_json(event_name, time) {
    return {'event_type': event_name, 'video_time': time};
}

/**
 * Transforms inputted data into format acceptable by Ajax Json call.
 */
function _format_entry_data_for_json(url) {
    return {'url': url}
}

/**
 *
 */
function _format_reorder_data_for_json(url, position) {
    return {'url': url, 'new_position': position}
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

/**
 * Checks an inputted playlist against the most recent playlis stored in global variable. Returns bool value True if it
 * is a new playlist.
 */
function checkIfNewPlaylist(playlist) {
    if (_.isEqual(playlist, _mostRecentPlaylist)) {
        return false;
    } else {
        return true;
    }
}

/**
 * Takes a Youtube URL, splits it and returns just the Video ID, which is contained at the end of the URL.
 */
function getVideoID(url) {
    var splitUrl = url.split('=');
    return splitUrl[1];
}

// 3. Create

/**
 * Creates a new list item containing urls to be inserted into the playlist.
 */
function createPlaylistItem(url, videoID) {
    var deleteButton = '<a class="deletebutton" href="' + playlistRemUrl + '">X</a>';
    var img = '<img src="http://img.youtube.com/vi/' + videoID + '/sddefault.jpg" height="50" width="50">';
    return $('<li>' + img + '<a class="link" href=' + url + '>Link' + deleteButton + '</a></li>');
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
    $('ul').append(playlistItem);
}


/**
 * Creates a prompt to encourage the user to copy the path to the VidRoom to their clipboard.
 */
function windowPrompt() {
    window.prompt('VidRoom Created! Copy the URL to your clipboard to return to it at any time. Just hit Ctrl + C',
    window.location.href);
}

/**
 * Serves the url for the new playlist entry to the server to the be saved.
 */
function registerPlaylistAdd(url, actionURL) {
    var submitMethod = 'post';
    var formData = _format_entry_data_for_json(url);
    return Promise.resolve($.ajax({
        url: actionURL,
        method: submitMethod,
        data: formData
    }));
}

/**
 * Serves the delete request for the playlist entry to the server to be saved.
 */
function registerPlaylistRemove(url, actionURL) {
    var submitMethod = 'post';
    var formData = _format_entry_data_for_json(url);
    return Promise.resolve($.ajax({
        url: actionURL,
        method: submitMethod,
        data: formData
    }));
}

/**
 * Takes the status returned from the server query, checks if there is a new event and/or if the playlist has changed.
 * If either are true, updates the client-side VidRoom to match the new status.
 */
function registerServerQuery(JsonResponse) {
    var event = JsonResponse.event;
    var playlist = JsonResponse.playlist;
    var isNewEvent = checkIfNewEvent(event);
    if (isNewEvent) {
        _mostRecentEvent = event;
        player.seekTo(event.video_time_at);
        if (event.event_type === 'play') {
        player.playVideo();
        } else if (event.event_type === 'pause') {
        player.pauseVideo();
        }
    }
    var isNewPlaylist = checkIfNewPlaylist(playlist)
    if (isNewPlaylist) {
        _mostRecentPlaylist = playlist;
        $('#playlistul').empty();
        for (var i = 0; i < playlist.length; i += 1) {
             var url = playlist[i]
             var videoID = getVideoID(url);
             var playlistItem = createPlaylistItem(url, videoID);
             updatePlaylist(playlistItem);
        }
        $('.deletebutton').on('click', function(event) {
            event.preventDefault();
            var deleteButton = $(event.target);
            var entry = deleteButton.parent();
            removePlaylistEntry(entry);
        });
    }
}

/**
 * Queries the server for the most recent event associated with this VidRoom.
 */
function queryServerForStatus() {
    var submitMethod = 'get';
    var actionURL = statusQueryUrl;
    return Promise.resolve($.ajax ({
        dataType: 'json',
        url: actionURL,
        method: submitMethod
    }));
}

/**
 *
 */
function registerPositionChange(entry, position) {
    var submitMethod = 'post';
    var actionURL = playlistReorderUrl;
    var url = entry.children('.link').attr('href');
    var data = _format_reorder_data_for_json(url, position)
    return Promise.resolve($.ajax ({
        dataType: 'json',
        data: data,
        url: actionURL,
        method: submitMethod
    }));
}

// 5. Main

/**
 * Called on user input event handler, sends a play event stamp to the server, then plays the video.
 */
function runPlaySequence() {
    var time = player.getCurrentTime();
    serverLogEvent('play', time, playEventUrl).
        then(function(success) {
             player.playVideo
        });
}

/**
 *  Called on user input event handler, sends a pause event stamp to the server, then pauses the video.
 */
function runPauseSequence() {
    var time = player.getCurrentTime();
    serverLogEvent('pause', time, pauseEventUrl).
         then(function(success) {
                player.playVideo
         });
}

/**
 * Queries the server for the most recent status every 100 milliseconds, tests if either the playlist or most current
 * event has changed, then registers whatever needed functions to update the client-side VidRoom.
 */
function runStatusQueryLoop() {
    setInterval(function() {
    queryServerForStatus().
      then(registerServerQuery);
    }, 100);
}

/**
 * Piping function to add new user inputted field into the playlist.
 */
function addEntryToPlaylist(playlistAddURL) {
    var actionURL = playlistAddURL;
    var url = getPlaylistInput();
    registerPlaylistAdd(url, actionURL);
}

/**
  * Removes a entry from the playlist that has been deleted by a user clicking the deleteButton.
  */
function removePlaylistEntry(entry) {
    var actionURL = entry.children('.deletebutton').attr('href');
    var url = entry.children('.link').attr('href');
    registerPlaylistRemove(url, actionURL);
}

// 6. Register

/**
 * Sets up the event handlers for pause and play elements. Run when YouTube player is successfully set up.
 */
function initializePlayerHandlers(event) {
  playButton.on("click", function(event) {
    runPlaySequence();
   });
  pauseButton.on("click", function() {
    runPauseSequence();
   });
  runStatusQueryLoop();
}

/**
 * Initializes main event handlers on the page.
 */
function initializeEventHandlers() {
    windowPrompt();
    setUpYoutubePlayerScript();
    $('form').on('submit', function(event) {
        event.preventDefault();
        var playlistAddURL = $('.playlistqueue form').attr('action');
        addEntryToPlaylist(playlistAddURL);
    });
    $(function () {
        $('#playlistul').sortable();
    });
    $('#playlistul').on('sortchange', function(event, ui) {
        var entry = $(ui.helper)
        var newPosition = ui.item.index() + 1
        registerPositionChange(entry, newPosition)
    })
}

$(document).ready(initializeEventHandlers);