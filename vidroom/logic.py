"""vidroom Logic."""

import uuid
import arrow
from . import models

def create_uuid():
    """Creates a UUID, or universally unique identifier, which will be used to identify and access the newly created
    VidRoom."""
    return uuid.uuid4()


def create_and_save_new_vidroom(vidroom_id):
    """Takes a UUID, and creates and saves a new vidroom with the supplied id.

    >>> create_and_save_new_vidroom('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    >>> models.VidRoom.objects.get(id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(id=UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'), playlist='[]', start_at=0)
    """
    new_vidroom = models.VidRoom(id=vidroom_id, playlist=[], start_at=0)
    new_vidroom.save()


def find_vidroom_by_id(vidroom_id):
    """Returns the vidroom which contains the inputted id number.

    >>> models.VidRoom(id='f81d4fae-7dec-11d0-a765-00a0c91e6bf6', playlist=[], start_at=0).save()
    >>> find_vidroom_by_id('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
    VidRoom(id=UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6'), playlist='[]', start_at=0)
    """
    return models.VidRoom.objects.get(id=vidroom_id)


def create_and_save_new_event(event_type, video_time, vidroom_id):
    """Takes in an event type ('pause', or 'play'), and the time of the event on the video, stores as an Event object
    in the database.
    """
    new_event = models.Event(vidroom_id=vidroom_id, event_type=event_type, video_time_at=video_time)
    new_event.save()
    # Use Foreign key on models. Need to delete previous events if I want a single event.


def find_event_by_id(vidroom_id):
    """Returns the event object associated with this ID."""
    return models.Event.objects.get(id=vidroom_id)
