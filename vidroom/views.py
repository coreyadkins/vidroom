"""vidroom Views."""

from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from . import logic
from . import models


def render_index(request):
    """Renders the home page, where user can submit to generate a VidRoom."""
    return render(request, 'vidroom/index.html')


def get_new_vidroom(request):
    """Creates a new VidRoom by generating a UUID, then saving a VidRoom with that UUID to the database. Then redirects
    the user to the correct URL for that VidRoom.

    Creates and saves a default event of 'pause' at 0.0 on initiation of VidRoom, and a default playlist entry.
    """
    vidroom_id = str(logic.create_uuid())
    vidroom = logic.create_and_save_new_vidroom(vidroom_id)
    logic.create_and_save_new_event(vidroom, 'pause', 0.0)
    logic.create_and_save_new_playlist_entry(vidroom, 'QH2-TGUlwu4')
    return HttpResponseRedirect(vidroom_id)


def render_vidroom(request, vidroom_id):
    """Renders the VidRoom by the inputted id numbers."""
    arguments = {
        'vidroom_id': vidroom_id,
        'GOOGLE_API_KEY': GOOGLE_API_KEY
    }
    return render(request, 'vidroom/vidroom.html', arguments)


def get_video_ids_and_ids_for_playlist(playlist):
    """Takes in a playlist, a list of Playlist Entries, returns a list of dictionaries containing each the video id,
    unique id and position in playlist for each entry.

    >>> playlist = [models.PlaylistEntry(vidroom=models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'),\
    video_id='1', position=0, id=0), models.PlaylistEntry(vidroom=models.VidRoom(public_id=\
    'f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='2', position=1, id=1)]
    >>> converted_playlist = get_video_ids_and_ids_for_playlist(playlist)
    >>> converted_playlist[0]['video_id']
    '1'
    >>> converted_playlist[0]['id']
    0
    >>> converted_playlist[1]['video_id']
    '2'
    >>> converted_playlist[1]['id']
    1
    """
    return [{'video_id': entry.video_id, 'id': entry.id, 'position': entry.position} for entry in playlist]


def _format_status_for_json_response(event, playlist):
    """Formats status data, including the playlist and events for a vidroom to be returned in a Json Response.

    >>> event = models.Event(event_type='play', video_time_at=135.0, timestamp=0)
    >>> vidroom = models.VidRoom(public_id='123')
    >>> playlist = [models.PlaylistEntry(vidroom=vidroom, video_id='4B9NtFlES4U', position=1, id=0)]
    >>> json_response = _format_status_for_json_response(event, playlist)
    >>> json_response['event']['timestamp']
    0
    >>> json_response['event']['event_type']
    'play'
    >>> json_response['event']['video_time_at']
    135.0
    >>> json_response['playlist'][0]['video_id']
    '4B9NtFlES4U'
    >>> json_response['playlist'][0]['id']
    0
    """
    return {
        'event': {'event_type': event.event_type, 'video_time_at': event.video_time_at, 'timestamp': event.timestamp},
        'playlist': get_video_ids_and_ids_for_playlist(playlist)
    }


def return_vidroom_status(request, vidroom_id):
    """Returns the status of the selected VidRoom, which is the most recent event associated with the VidRoom and the
    ordered playlist associated with the VidRoom."""
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    vidroom_events = logic.find_events_by_vidroom(vidroom)
    vidroom_playlist = logic.find_playlist_for_vidroom(vidroom)
    json_status = _format_status_for_json_response(vidroom_events[0], vidroom_playlist)
    return JsonResponse(json_status)


def register_vidroom_event(request, vidroom_id):
    """Registers a pause or play event on the client side and stores this event in the server for later queries."""
    event_type = request.POST['event_type']
    video_time = request.POST['video_time']
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    logic.create_and_save_new_event(vidroom, event_type, video_time)
    return HttpResponse(status=200)


def register_playlist_add(request, vidroom_id):
    """Registers an entry added to the playlist on the client side and stores this entry in the server."""
    video_id = request.POST['video_id']
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    logic.create_and_save_new_playlist_entry(vidroom, video_id)
    return HttpResponse(status=200)


def register_playlist_remove(request, vidroom_id):
    """Registers removal of a playlist entry on the client side and updates the server to remove this entry, including
    reordering the playlist to reflect the removal of this entry.
    """
    entry_id = request.POST['id']
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    deleted_entry = logic.find_playlist_entry_by_id(entry_id)
    playlist = logic.find_playlist_for_vidroom(vidroom)
    logic.reorder_playlist_on_remove(deleted_entry, playlist)
    logic.remove_playlist_entry(entry_id)
    return HttpResponse(status=200)


def register_playlist_reorder(request, vidroom_id):
    """Registers a playlist entry changing position in the playlist, stores this new position in the server and reorders
    the remainder of the playlist to fit around the new position of the playlist entry.
    """
    moved_entry_id = request.POST['id']
    new_position = int(request.POST['new_position'])
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    moved_entry = logic.find_playlist_entry_by_id(moved_entry_id)
    playlist = logic.find_playlist_for_vidroom(vidroom)
    logic.reorder_playlist(moved_entry, new_position, playlist)
    return HttpResponse(status=200)
