"""vidroom Models."""

from django.db import models

class VidRoom(models.Model):
    public_id = models.UUIDField
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
    vidroom_id = models.ForeignKey(VidRoom)
    event_type = models.TextField()
    video_time_at = models.IntegerField()
    timestamp = models.DateTimeField()

    def __str__(self):
        """Returns str.

        >>> time = arrow.get('2013-05-05T12:30:45+00:00')
        >>> str(Event(vidroom_id='123', event_type='Play', video_time_at=135, timestamp=time))
        'Event(2013-05-05-12:30:45: Play at 135 in VidRoom 123)'
        """
        return 'Event({} at {} in VidRoom {})'.format(self.timestamp.format('YYYY-MM-DD-HH:mm:ss'), self.event_type,
                                                      self. video_time_at, self.vidroom_id)

    def __repr__(self):
        """Returns repr.

        >>> time = arrow.get('2013-05-05T12:30:45+00:00')
        >>> repr(Event(vidroom_id='123', event_type='Pause', video_time_at=140, timestamp=time))
        "Event(vidroom_id='123', event_type='Pause', video_time_at=140, timestamp=<Arrow [2013-05-05T12:30:45+00:00]>)"
        """
        return 'Event(vidroom_id={!r}, event_type={!r}, video_time_at={!r}, timestamp={!r})'.format(self.vidroom_id,
                                                                                                    self.event_type,
                                                                                                    self.video_time_at,
                                                                                                    self.timestamp)
