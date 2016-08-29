"""vidroom Views."""

from django.shortcuts import render


def get_home(request):
    return render(request, 'vidroom/index.html', {'hi': 'bye'})

def get_vidroom(request, vidroom_number):
    return render(request, 'vidroom/vidroom.html', {})