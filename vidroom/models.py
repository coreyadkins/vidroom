"""vidroom Models."""

from django.db import models

class VidRoom(models.Model):
    public_id = models.UUIDField
    playlist = models.URLField()
    start_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(VidRoom(id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com/'\
        'watch?v=tS_uCfBX1No'], start_at=135))
        'VidRoom(123)'
        """
        return 'VidRoom({})'.format(self.id)

    def __repr__(self):
        """Returns repr.

        >>> repr(VidRoom(id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com'\
        '/watch?v=tS_uCfBX1No'], start_at=135))
        "VidRoom(id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com\
/watch?v=tS_uCfBX1No'], start_at=135)"
        """
        return 'VidRoom(id={!r}, playlist={!r}, start_at={})'.format(self.id, self.playlist, self.start_at)


class Event(models.Model):
    """Event is used to store the most recent pause or play event for a particular VidRoom, so that it can be queried
    for syncing.

    Each event has the ID of the VidroomID, which ensures that the server only remembers the last event for each
    Vidroom.
    """
    # Q. What to do in cases where pausing or playing happens faster than a second? This will break current model.
    # Use Foreign Key.
    # id = models.UUIDField(primary_key=True)
    event_type = models.TextField()
    video_time_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(Event(event_type='Play', video_time_at=135))
        'Event(Play at 135)'
        """
        return 'Event({} at {})'.format(self.event_type, self. video_time_at)

    def __repr__(self):
        """Returns repr.

        >>> repr(Event(event_type='Pause', video_time_at=140))
        "Event(event_type='Pause', video_time_at=140)"
        """
        return 'Event(event_type={!r}, video_time_at={!r})'.format(self.event_type, self.video_time_at)