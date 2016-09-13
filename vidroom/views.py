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

    Creates and saves a default event of 'pause' at 0.0 on initiation of VidRoom.
    """
    vidroom_id = str(logic.create_uuid())
    vidroom = logic.create_and_save_new_vidroom(vidroom_id)
    logic.create_and_save_new_event(vidroom, 'pause', 0.0)
    return HttpResponseRedirect(vidroom_id)


def render_vidroom(request, vidroom_id):
    """Renders the VidRoom by the inputted id number.s"""
    arguments = {
        'vidroom_id': vidroom_id
    }
    return render(request, 'vidroom/vidroom.html', arguments)


def _format_status_for_json_response(event, playlist):
    """Formats status data to be returned in a Json Response.

    >>> event = models.Event(event_type='play', video_time_at=135.0)
    >>> playlist = ['https://www.youtube.com/watch?v=eDyEGP0FhcQ']
    >>> json_response = _format_status_for_json_response(event, playlist)
    >>> json_response['event']
    {'event_type': 'play', 'video_time_at': 135.0}
    >>> json_response['playlist']
    ['https://www.youtube.com/watch?v=eDyEGP0FhcQ']
    """
    return {
        'event': {'event_type': event.event_type, 'video_time_at': event.video_time_at},
        'playlist': logic.get_urls_for_playlist(playlist)
    }


def return_vidroom_status(request, vidroom_id):
    """Returns the status of the selected VidRoom, whcih is the most recent event associated with the VidRoom and the
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
    """"""
    url = request.POST['url']
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    logic.create_and_save_new_playlist_entry(vidroom, url)
    return HttpResponse(status=200)


def register_playlist_remove(request, vidroom_id):
    """"""
    url = request.POST['url']
    vidroom = logic.find_vidroom_by_public_id(vidroom_id)
    logic.remove_playlist_entry(vidroom, url)
    return HttpResponse(status=200)


def register_playlist_reorder(request, vidroom_id):
    """"""
    pass