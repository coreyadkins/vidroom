'use strict';

///**
// * Creates a UUID, a universally unique identifier, to be used in the generation
// * of unique URLs for vidrooms.
// * Source: Stackoverflow, Briguy37.
// */
//function generateUUID() {
//  var d = new Date().getTime();
//  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c
//  ) {
//    var r = (d + Math.random() * 16) % 16 | 0;
//    d = Math.floor(d / 16);
//    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//  });
//  return uuid;
//}
//
///**
// * Generates unique URL for vidroom creation.
// * @return {string} URL for creation of a new vidroom.
// */
//function createCustomURL(uuid) {
//  var baseUrl = '/';
//  return baseUrl + uuid;
//}
//
//function openVidRoom(url) {
//  window.location.href = url
//}
//
//function createVidRoom() {
//  var uuid = generateUUID();
//  var url = createCustomURL(uuid);
//  openVidRoom(url);
//}
//
//
//function initializeEventHandlers() {
//  $('button').on('click', function(event) {
//    event.preventDefault();
//    createVidRoom();
//  });
//}
//
//$(document).ready(initializeEventHandlers);
