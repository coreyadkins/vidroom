# VidRoom

VidRoom is a web app which allows users to create “VidRooms,” which are stored, accessible web pages which the user can distribute and access at any time. These VidRooms store a playlist of YouTube videos, submitted via a URL, which all users of the VidRoom can watch together. Pause and play controls are synchronized across the VidRoom, so that if the video is paused by one user, it is paused at the same time for all other users.

# Setup
No special setup required, just clone the repository, set up your VirtualEnv, install the requirements,
and run a local server to test.

# Usage
The home page allows you to submit to be directed to a new VidRoom, which is a stored instance.

In each VidRoom, you can add videos to the playlist, change playlist order with drag and drop, and play and pause the video. All commands are synchronized across the webserver, meaning all clients at that directory will have their VidRooms updated to the same state.