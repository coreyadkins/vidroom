'use strict';

/**
 * Creates a UUID, a universally unique identifier, to be used in the generation
 * of unique URLs for vidrooms.
 * Source: Stackoverflow, Briguy37.
 */
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * Generates unique URL for vidroom creation.
 * @return {string} URL for creation of a new vidroom.
 */
function createCustomURL(uuid) {
  var baseUrl = 'http://www.vidroom.com/';
  return baseUrl + uuid;
}

function createUrlDisplay(url) {
  var section = $('#success');
  section.empty();
  var displayBody = '<div><h2>Success!</h2></div><div><p>Your private vidroom' +
   ' is located at ' + url + '</p></div>';
  var displayElement = $(displayBody);
  section.append(displayElement);
}

function openVidRoom() {
  window.open('vidroom.html');
}

function createVidRoom() {
  var uuid = generateUUID();
  var url = createCustomURL(uuid);
  createUrlDisplay(url);
  openVidRoom();
}


function initializeEventHandlers() {
  $('button').on('click', function(event) {
    event.preventDefault();
    createVidRoom();
  });
}

$(document).ready(initializeEventHandlers);
