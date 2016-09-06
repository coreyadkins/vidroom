"""vidroom Logic."""

import uuid
import arrow
from . import models

# NODE = uuid.getnode()

def create_uuid():
    """Creates a UUID, or universally unique identifier, which will be used to identify and access the newly created
    VidRoom."""
    return uuid.uuid4()


def create_and_save_new_vidroom(vidroom_id):
    """Takes a UUID, and creates a new vidroom with the """
    new_vidroom = models.Vidroom(id=vidroom_id, playlist=[], start_at=0)
    new_vidroom.save()


def find_vidroom_by_uuid(vidroom_id):
    """"""
    return models.VidRoom.objects.get(uuid=vidroom_id)
