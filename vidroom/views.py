"""vidroom Views."""

from django.shortcuts import render
from django.http import HttpResponseRedirect
from . import logic


def render_index(request):
    """Renders the home page, where user can submit to generate a VidRoom."""
    return render(request, 'vidroom/index.html')


def get_new_vidroom(request):
    """Creates a new VidRoom by generating a UUID, then saving a VidRoom with that UUID to the database. Then redirects
    the user to the correct URL for that VidRoom."""
    vidroom_id = logic.create_uuid()
    logic.create_and_save_new_vidroom(vidroom_id)
    return HttpResponseRedirect(vidroom_id)


def render_vidroom(request, vidroom_id):
    """Renders the VidRoom by the inputted id number.s"""
    vidroom = logic.find_vidroom_by_id(vidroom_id)
    return render(request, 'vidroom/vidroom.html')