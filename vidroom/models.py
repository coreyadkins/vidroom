"""vidroom Models."""

from django.db import models

class VidRoom(models.Model):
    uuid = models.UUIDField()
    playlist = models.URLField()
    start_at = models.IntegerField()

    def __str__(self):
        """Returns str.

        >>> str(VidRoom(uuid='123', playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com/'\
        'watch?v=tS_uCfBX1No'], start_at=135))
        Vidroom(123)
        """
        return 'Vidroom({})'.format(self.uuid)

    def __repr__(self):
        """Returns repr.

        >>> repr(VidRoom(uuid=123, playlist=['https://www.youtube.com/watch?v=ORjtrEW8whg', 'https://www.youtube.com'\
        '/watch?v=tS_uCfBX1No'], start_at=135))
        """
        return 'Vidroom(uuid={}, playlist={!r}, start_at={})'.format()