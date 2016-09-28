"""vidroom Logic."""

import uuid
from . import models
import datetime


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
    timestamp = datetime.datetime.utcnow()
    new_event = models.Event(vidroom=vidroom, event_type=event_type, video_time_at=video_time, timestamp=timestamp)
    new_event.save()


def find_events_by_vidroom(vidroom):
    """Returns all event objects associated with inputted vidroom, sorted in order of most recent by timestamp.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> time = datetime.datetime(1970, 1, 1, 0, 0, 0)
    >>> models.Event(vidroom=vidroom, event_type='play', video_time_at=135.0, timestamp=time).save()
    >>> find_events_by_vidroom(vidroom)
    <QuerySet [Event(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), event_type='play', video_time_a\
t=135.0, timestamp=datetime.datetime(1970, 1, 1, 0, 0, tzinfo=<UTC>))]>
    """
    return models.Event.objects.filter(vidroom=vidroom).order_by('-timestamp')


def create_and_save_new_playlist_entry(vidroom, video_id):
    """Creates a new playlist entry model, determines its proper position by measuring the length of the playlist, then
    saves the new playlist entry.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> models.PlaylistEntry.objects.get(vidroom=vidroom, video_id='1', id=0)
    PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='1', position=0, id=0)
    """
    vidroom_playlist = find_playlist_for_vidroom(vidroom)
    playlist_count = len(vidroom_playlist)
    position = playlist_count
    new_playlist_entry = models.PlaylistEntry(vidroom=vidroom, video_id=video_id, position=position)
    new_playlist_entry.save()


def find_single_playlist_entry(vidroom, video_id, entry_id):
    """Returns a single playlist entry.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> find_single_playlist_entry(vidroom, '1', 0)
    PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='1', position=0, id=0)
    """
    return models.PlaylistEntry.objects.get(vidroom=vidroom, video_id=video_id, id=entry_id)


def remove_playlist_entry(vidroom, video_id, entry_id):
    """Removes the playlist entry whose vidroom, video_id, and unique id corresponds with inputted data.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> remove_playlist_entry(vidroom, '1', 0)
    >>> models.PlaylistEntry.objects.filter(vidroom=vidroom, video_id='1', id=0)
    <QuerySet []>
    """
    playlist_entry = find_single_playlist_entry(vidroom, video_id, entry_id)
    playlist_entry.delete()


def find_playlist_for_vidroom(vidroom):
    """Returns the playlist associated with the inputted vidroom.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='2', position=1, id=1).save()
    >>> find_playlist_for_vidroom(vidroom)
    <QuerySet [PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='1', position=\
0, id=0), PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='2', position=1, id\
=1)]>
    """
    return models.PlaylistEntry.objects.filter(vidroom=vidroom).order_by('position')


def change_entry_position(entry, new_position):
    """Changes the position of inputted playlist entry to the new inputted position.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> entry = models.PlaylistEntry.objects.get(vidroom=vidroom, video_id='1', id=0)
    >>> change_entry_position(entry, 1)
    >>> updatedEntry = models.PlaylistEntry.objects.get(vidroom=vidroom, video_id='1', id=0)
    >>> updatedEntry.position
    1
    """
    entry.position = new_position
    entry.save()


def find_if_entry_moved_up(original_position, new_position):
    """Returns True if the the entry moved up in the playlist (new position number is lower than
    original position number.

    >>> find_if_entry_moved_up(1, 0)
    True
    >>> find_if_entry_moved_up(0, 1)
    False
    """
    return original_position > new_position


def reorder_playlist_on_remove(removed_entry, playlist):
    """Reorders the playlist on the removal of a playlist entry.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='2', position=1, id=1).save()
    >>> playlist = models.PlaylistEntry.objects.filter(vidroom=vidroom).order_by('position')
    >>> removed_entry = models.PlaylistEntry.objects.get(vidroom=vidroom, video_id='1', id=0)
    >>> reorder_playlist_on_remove(removed_entry, playlist)
    >>> delete = removed_entry.delete()
    >>> models.PlaylistEntry.objects.filter(vidroom=vidroom)
    <QuerySet [PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='2', position=\
0, id=1)]>
    """
    removed_entry_position = removed_entry.position
    for entry in playlist:
        entry_orig_position = entry.position
        if entry_orig_position > removed_entry_position:
            updated_position = entry_orig_position - 1
            change_entry_position(entry, updated_position)


def reorder_playlist(moved_entry, moved_entry_new_position, playlist):
    """Reorders the playlist based on the moved playlist entry. First detects if the playlist entry
    moved up or down, then changes the position and saves for each entry based on the new position
    of the moved playlist entry.

    >>> models.VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6').save()
    >>> vidroom = models.VidRoom.objects.get(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='1', position=0, id=0).save()
    >>> models.PlaylistEntry(vidroom=vidroom, video_id='2', position=1, id=1).save()
    >>> playlist = models.PlaylistEntry.objects.filter(vidroom=vidroom).order_by('position')
    >>> moved_entry = models.PlaylistEntry.objects.get(vidroom=vidroom, video_id='1', id=0)
    >>> moved_entry_new_position = 1
    >>> reorder_playlist(moved_entry, moved_entry_new_position, playlist)
    >>> models.PlaylistEntry.objects.filter(vidroom=vidroom).order_by('position')
    <QuerySet [PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='2', position=\
0, id=1), PlaylistEntry(vidroom=VidRoom(public_id='f91d4fae-7dec-11d0-a765-00a0c91e6bf6'), video_id='1', position=1, id\
=0)]>
    """
    moved_entry_orig_position = moved_entry.position
    entry_moved_up = find_if_entry_moved_up(moved_entry_orig_position, moved_entry_new_position)
    for entry in playlist:
        entry_orig_position = entry.position
        if entry_moved_up:
            if entry_orig_position >= moved_entry_new_position and entry.position < moved_entry_orig_position:
                updated_position = entry_orig_position + 1
                change_entry_position(entry, updated_position)
        else:
            if entry_orig_position > moved_entry_orig_position and entry.position <= moved_entry_new_position:
                updated_position = entry_orig_position - 1
                change_entry_position(entry, updated_position)
    change_entry_position(moved_entry, moved_entry_new_position)
