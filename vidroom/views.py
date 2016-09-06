"""vidroom Views."""

from django.shortcuts import render
from django.http import HttpResponseRedirect
from . import logic


def render_index(request):
    return render(request, 'vidroom/index.html', {'hi': 'bye'})


def get_new_vidroom(request):
    vidroom_id = logic.create_uuid()
    logic.create_and_save_new_vidroom(vidroom_id)
    return HttpResponseRedirect('vidroom/' + str(vidroom_uuid))


def render_vidroom(request, vidroom_id):
    vidroom = logic.find_vidroom_by_uuid(vidroom_id)
    return render(request, 'vidroom/vidroom.html')