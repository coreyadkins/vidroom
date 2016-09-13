"""vidroom Logic."""

import uuid
from . import models
import datetime
from django.core.exceptions import MultipleObjectsReturned

def create_uuid():
    """Creates a UUID, or universally unique identifier, which will be used to identify and access the newly created
    VidRoom."""
    return uuid.uuid4()


def create_and_save_new_vidroom(vidroom_id):
    """Takes a UUID, and creates and saves a new vidroom with the supplied id.

    >>> vidroom = create_and_save_new_vidroom('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.VidRoom.objects.get(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    """
    new_vidroom = models.VidRoom(public_id=vidroom_id)
    new_vidroom.save()
    return new_vidroom


def find_vidroom_by_public_id(vidroom_id):
    """Returns the vidroom which contains the inputted public id number.

    >>> models.VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> find_vidroom_by_public_id('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    """
    return models.VidRoom.objects.get(public_id=vidroom_id)


def create_and_save_new_event(vidroom, event_type, video_time):
    """Takes in the VidRoom the event occurred in, an event type ('pause', or 'play'), and the time of the event on the
    video, stores as an Event object in the database.

    Returns the timestamp of the event to be

    >>> models.VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> create_and_save_new_event(vidroom, 'play', 135.0)
    >>> vidroom_events_by_most_recent = models.Event.objects.filter(vidroom=vidroom, event_type='play', ).order_by(\
    '-timestamp')
    >>> most_recent_event = vidroom_events_by_most_recent[0]
    >>> default_time = datetime.datetime(1970, 1, 1, 0, 0)
    >>> most_recent_event.timestamp = default_time
    >>> most_recent_event
    Event(vidroom=VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6'), event_type='play', video_time_at=135.0, \
timestamp=datetime.datetime(1970, 1, 1, 0, 0))
    """
    new_event = models.Event(vidroom=vidroom, event_type=event_type, video_time_at=video_time)
    new_event.save()


def find_events_by_vidroom(vidroom):
    """Returns all event objects associated with inputted vidroom, sorted in order of most recent by timestamp.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.Event(vidroom=vidroom, event_type='play', video_time_at=135.0).save()
    >>> result = list(find_events_by_vidroom(vidroom))
    >>> default_time = datetime.datetime(1970, 1, 1, 0, 0, 0)
    >>> result_event = result[0]
    >>> result_event.timestamp = default_time
    >>> result_event
    Event(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), event_type='play', video_time_at=135.0, \
timestamp=datetime.datetime(1970, 1, 1, 0, 0))
    """
    return models.Event.objects.filter(vidroom=vidroom).order_by('-timestamp')


def create_and_save_new_playlist_entry(vidroom, url):
    """"""
    vidroom_playlist = find_playlist_for_vidroom(vidroom)
    playlist_count = len(get_urls_for_playlist(vidroom_playlist))
    new_playlist_entry = models.PlaylistEntry(vidroom=vidroom, url=url, order=playlist_count + 1)
    new_playlist_entry.save()


def find_single_playlist_entry(vidroom, url):
    """"""
    try:
        return models.PlaylistEntry.objects.get(vidroom=vidroom, url=url)
    except MultipleObjectsReturned:
        return models.PlaylistEntry.objects.filter(vidroom=vidroom, url=url)


def remove_playlist_entry(vidroom, url):
    """"""
    playlist_entry = find_single_playlist_entry(vidroom, url)
    playlist_entry.delete()


def get_urls_for_playlist(playlist):
    """"""
    return [entry.url for entry in playlist]


def find_playlist_for_vidroom(vidroom):
    """"""
    return models.PlaylistEntry.objects.filter(vidroom=vidroom).order_by('order')