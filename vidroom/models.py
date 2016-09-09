"""vidroom Models."""

from django.db import models
import uuid
import datetime


class VidRoom(models.Model):
    public_id = models.TextField(default=str(uuid.uuid4))
    playlist = models.URLField()
    start_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com/'\
        'watch?v=tS_uCfBX1No'], start_at=135))
        'VidRoom(123)'
        """
        return 'VidRoom({})'.format(self.public_id)

    def __repr__(self):
        """Returns repr.

        >>> repr(VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com'\
        '/watch?v=tS_uCfBX1No'], start_at=135))
        "VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com\
/watch?v=tS_uCfBX1No'], start_at=135)"
        """
        return 'VidRoom(public_id={!r}, playlist={!r}, start_at={})'.format(self.public_id, self.playlist, self.start_at)


class Event(models.Model):
    """Event is used to store the most recent pause or play event for a particular VidRoom, so that it can be queried
    for syncing.

    Each event has the ID of the VidroomID, which ensures that the server only remembers the last event for each
    Vidroom.
    """
    vidroom = models.ForeignKey(VidRoom)
    event_type = models.TextField()
    video_time_at = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self):
        """Returns str.
        >>> time = datetime.datetime(2013, 5, 5, 12, 30, 45)
        >>> vidroom = VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg'], start_at=135)
        >>> str(Event(vidroom=vidroom, event_type='Play', video_time_at=135, timestamp=time))
        'Event(2013-05-05 12:30:45: Play at 135 in VidRoom(123))'
        """
        return 'Event({}: {} at {} in {})'.format(self.timestamp, self.event_type,
                                                      self.video_time_at, self.vidroom)

    def __repr__(self):
        """Returns repr.

        >>> time = datetime.datetime(2013, 5, 5, 12, 30, 45)
        >>> vidroom = VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg'], start_at=135)
        >>> repr(Event(vidroom=vidroom, event_type='Pause', video_time_at=140, timestamp=time))
        "Event(vidroom=VidRoom(public_id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg'\
], start_at=135), event_type='Pause', video_time_at=140, timestamp=datetime.datetime(2013, 5, 5, 12, 30, 45))"
        """
        return 'Event(vidroom={!r}, event_type={!r}, video_time_at={!r}, timestamp={!r})'.format(self.vidroom,
                                                                                                    self.event_type,
                                                                                                    self.video_time_at,
                                                                                                    self.timestamp)
