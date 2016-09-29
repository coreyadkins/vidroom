# VidRoom

VidRoom is a web app which allows users to create “VidRooms,” which are stored,
accessible web pages which the user can distribute and access at any time. These
VidRooms store a playlist of YouTube videos, submitted via a URL, which all users
of the VidRoom can watch together. Pause and play controls, as well as playlist
order and content, are synchronized across the VidRoom, so that if the video is
paused by one user, it is paused at the same time for all other users.

# Setup
Requires  a YouTube Data API Key. If you want to run this locally, you'll need
to obtain a key at https://console.developers.google.com/, and then add it to a
script tag that you then add into vidroom/templates/vidroom/vidroom.html,
above the script tag for vidroom.js. You can copy in the following code, adding
your API key.:

<script> var GOOGLE_API_KEY = 'INSERT_YOUR_API_KEY_HERE'; </script>

Otherwise no special setup is required, just clone the repository, set up your
VirtualEnv, install the requirements,and run a local server to test.

# Usage
The home page allows you to submit to be directed to a new VidRoom, which is a
stored instance.

In each VidRoom, you can add videos to the playlist, change playlist order with
drag and drop, and play and pause the video. All commands are synchronized
across the webserver, meaning all clients at that directory will have their
VidRooms updated to the same state.

To queue a new video in the player, simply drag that video to the top position
in the playlist.
