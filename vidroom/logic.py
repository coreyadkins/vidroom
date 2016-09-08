"""vidroom Logic."""

import uuid
from . import models
import arrow

def create_uuid():
    """Creates a UUID, or universally unique identifier, which will be used to identify and access the newly created
    VidRoom."""
    return uuid.uuid4()


def create_and_save_new_vidroom(vidroom_id):
    """Takes a UUID, and creates and saves a new vidroom with the supplied id.

    >>> create_and_save_new_vidroom('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.VidRoom.objects.get(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(public_id=UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'), playlist='[]', start_at=0)
    """
    new_vidroom = models.VidRoom(public_id=vidroom_id, playlist=[], start_at=0)
    new_vidroom.save()


def find_vidroom_by_public_id(vidroom_id):
    """Returns the vidroom which contains the inputted public id number.

    >>> models.VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6', playlist=[], start_at=0).save()
    >>> find_vidroom_by_public_id('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(public_id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6'), playlist='[]', start_at=0)
    """
    return models.VidRoom.objects.get(public_id=vidroom_id)


def create_and_save_new_event(vidroom, event_type, video_time):
    """Takes in the VidRoom the event occurred in, an event type ('pause', or 'play'), and the time of the event on the
    video, stores as an Event object in the database.
    """
    time = arrow.utcnow()
    new_event = models.Event(vidroom=vidroom, event_type=event_type, video_time_at=video_time, timestamp=time)
    new_event.save()


def find_events_by_id(vidroom):
    """Returns all event objects associated with inputted Vidroom ID, sorted in order of most recent by timestamp."""
    return models.Event.objects.filter(vidroom=vidroom).order_by('-timestamp')
