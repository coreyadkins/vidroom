"""vidroom Views."""

from django.shortcuts import render
from . import logic

def render_index(request):
    return render(request, 'vidroom/index.html', {'hi': 'bye'})

def get_new_vidroom(request):
    vidroom_uuid = logic.create_uuid()
    logic.create_and_save_new_vidroom(vidroom_uuid)


def render_vidroom(request, vidroom_number):
    return render(request, 'vidroom/vidroom.html', {})