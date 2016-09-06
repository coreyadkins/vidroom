"""vidroom Models."""

from django.db import models

class VidRoom(models.Model):
    id = models.UUIDField(primary_key=True)
    playlist = models.URLField()
    start_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(VidRoom(id='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com/'\
        'watch?v=tS_uCfBX1No'], start_at=135))
        Vidroom(123)
        """
        return 'Vidroom({})'.format(self.id)

    def __repr__(self):
        """Returns repr.

        >>> repr(VidRoom(id=123, playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com'\
        '/watch?v=tS_uCfBX1No'], start_at=135))
        "Vidroom(id=123, playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com'\
        '/watch?v=tS_uCfBX1No'], start_at=135)"
        """
        return 'Vidroom(uuid={}, playlist={!r}, start_at={})'.format(self.id, self.playlist, self.start_at)


class Event(models.Model):
    event_type = models.TextField()
    video_time_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(Event(event_type='Play', video_time_at='135'))
        Event(Play at 135)
        """
        return 'Event({} at {})'.format(self.event_type, self. video_time_at)

    def __repr__(self):
        """Returns repr.

        >>> repr(Event(event_type='Pause', video_time_at='140'))
        Event(event_type='Pause', video_time_at='140')
        """
        return 'Event(event_type={!r}, video_time_at={!r})'.format(self.event_type, self.video_time_at)