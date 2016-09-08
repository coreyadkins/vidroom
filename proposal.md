# Vidroom

## Product Overview
VidRoom is a web app which allows users to create “VidRooms,” which are stored, accessible web pages which the user can distribute and access at any time. These VidRooms store a playlist of YouTube videos, submitted via a URL, which all users of the VidRoom can watch together. Pause and play controls are synchronized across the VidRoom, so that if the video is paused by one user, it is paused at the same time for all other users.

Viewers of VidRoom are consistent, meaning that it is assumed all viewers of a video are “in” the VidRoom when the video is played and paused.

## Specific Functionality
**Main Page**- Welcome Screen- Contains Title, description. Create a VidRoom- Button that opens a new page that is a unique VidRoom.

**VidRoom**- Title. Video- Shell for where the video will be shown in the page, including pause, play, volume buttons. Share- Button to copy the URL of the VidRoom page to user’s clipboard. Playlist- Displays all of the queued videos to play, with a scroll bar if the list is longer than the screen size. Each video displays as a box element with a small image preview of the video, the title of the video, a URL, and buttons to change the order of the playlist. Also contains an add button which when clicked prompts the user for a URL to add a new video to the playlist.

## Data Model
**VidRoom**
The linked YouTube video inputted by the user.
- Public ID: UUID which is used in the file path to access Vidroom.
- Playlist: List which contains URLs of videos submitted by users.
- Play At: Video time that the video was last paused at.

**Event**
When a video is played or paused, the Database stores:
- VidRoom ID: UUID of the Vidroom which the occurred in. One-to-many relationship.
- Event type flag which contains event name ("play, pause")
- Video_time_at: Video play time at event
- Timestamp: UTC server time that the event occurred at


## Technical Components
Syncing of pausing and play elements will be done via storing events and communicating them with the web server via HTTP, with the client side checking for new events every interval.

Saving of VidRooms URLs and their associated playlists and event content will be done with Django in a SQL database.

Creation of playlists will be handled via a custom UI. Adding and reordering of playlist elements will be done with jQuery DOM manipulation and event handling.

Python will be used to generate new VidRooms, including the shortuuid library for the creation of unique URLs for new pages.

UI for playing of videos will be handled by the YouTube Player API. Server can store and return startPos and endPos variables which remember what time the video was paused and played at.

## Schedule
- Syncing of Pause and Play Elements- Hard, 1 week
- Vidroom Generation- Easy, 0.5 day
- YouTube API Setup and manipulation- Medium, 3 days
- Webpage setup- HTML/CSS, JS DOM Manipulation- Medium, 3 days
- Playlist and events DB storage- Medium, 2 days

## Further Work
- Use of WebSocket server for synchronization, using chat frameworks.
- Custom UI outside of YouTube API.
- Drag and drop for playlist video reordering.
- Support for platforms outside of YouTube
- A chat box in the VidRoom
- “Favoriting” capability on videos in playlist
- Users, which could include functionality for:
  - Remembering “My favorites”
  - Sending invitations to VidRooms
  - Displaying which user paused or played a video in a VidRoom
- Options for users to customize their vidroom:
  - Change name of Vidroom
  - Change color of text, background
  - Upload a background image.
- Image sharing capability within vidroom framework?
- Further Synchronization work:
  - Handling connectivity issues, buffering, etc.

## Personal Notes
- Explore whether or not to use YouTube API with login. YouTube API allows storage of video data.
