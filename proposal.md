# VidRoom

## Product Overview
VidRoom is a web app which allows users to create “VidRooms,” which are stored,
accessible web pages which the user can distribute and access at any time. These
VidRooms store a playlist of YouTube videos, submitted via a URL, which all
users of the VidRoom can watch together. Pause and play controls, as well as
playlist order and content, are synchronized across the VidRoom, so that if the
video is paused by one user, it is paused at the same time for all other users.

Viewers of VidRoom are consistent, meaning that it is assumed all viewers of a
video are “in” the VidRoom when the video is played and paused.

## Specific Functionality
**Main Page**- Welcome Screen- Contains Title. Create a VidRoom-
Button that opens a new page that is a unique VidRoom.

**VidRoom**- Title. Video- Shell for where the video will be shown in the page,
including pause, play, volume buttons. Playlist- Displays all of the queued
videos to play, with a scroll bar if the list is longer than the screen size.
Each video displays as a box element with a small image preview of the video,
the title of the video, a URL. Form to add new videos by inputting a YouTube
URL at the top.

## Data Model
**VidRoom**
The linked YouTube video inputted by the user.
- public : UUID which is used in the file path to access Vidroom.

**Event**
When a video is played or paused, the Database stores:
- vidroom: VidRoom which the occurred in. One-to-many relationship.
- event_type: Event type flag which contains event name ("play, pause")
- Video_time_at: Video time at time of the event
- timestamp: UTC server time that the event occurred at

**PlaylistEntry**
Created for each playlist entry, or video, in the playlist for the vidroom.
- vidroom: Vidroom which the playlist entry belongs to. One-to-many relationship.
- Video_id: YouTube video ID of the video.
- position: Position of the playlist entry within the playlist (0-based index)


## Technical Components
Syncing of pausing and play elements will be done via storing events and
communicating them with the web server via HTTP, with the client side checking
for new events every interval.

Saving of VidRooms public ids and their associated playlists and event content
will be done with Django in a SQL database.

Creation of playlists will be handled via a custom UI. Adding and reordering of
playlist elements will be done with jQuery DOM manipulation and event handling.

Python will be used to generate new VidRooms, including the uuid library for the
creation of unique URLs for new pages.

UI for playing of videos will be handled by the YouTube Player API.

## Schedule
- Syncing of Pause and Play Elements- Hard, 3 days
- Syncing of Playlist Elements- Hard, 5 days
- Vidroom Generation- Easy, 0.5 day
- YouTube API Setup and manipulation- Easy, 1 days
- Webpage setup- HTML/CSS, JS DOM Manipulation- Medium, 3 days

## Further Work
- Share button to copy the URL of the VidRoom page to user’s clipboard.
- Replace playlist form with add button which prompts input of a link.
- Window Prompt only on the first load of a vidroom per client (using cookies?).
- Store ID of video in Video Events, which would allow videos to be queued with
their last recorded event, and also eliminate any bugs around users joining a
VidRoom mid-video.
- Sexify pages.
- More documentation on the main page, explaining VidRooms.
- Use of WebSocket server for synchronization, using chat frameworks.
- Custom UI outside of YouTube API.
- Support for platforms outside of YouTube
- A chat box in the VidRoom
- Video Chatting capability
- “Favoriting” capability on videos in playlist
- Users, which could include functionality for:
..* Remembering “My favorites”
..* Sending invitations to VidRooms
..* Displaying which user paused or played a video in a VidRoom
..* Options for users to customize their vidroom:
..* Change name of Vidroom
..* Change color of text, background
..* Upload a background image.
- Image sharing capability within vidroom framework?
- Further Synchronization work:
..* Handling connectivity issues, buffering, etc.
..* Be able to toggle video quality
