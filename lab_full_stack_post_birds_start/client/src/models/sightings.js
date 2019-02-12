const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');

const Sightings = function (url) {
  this.url = url;
  this.request = new RequestHelper(this.url);
};

Sightings.prototype.bindEvents = function () {
  PubSub.subscribe('SightingView:sighting-delete-clicked', (evt) => {
    this.deleteSighting(evt.detail);
  });

  PubSub.subscribe('SightingView:bird-submitted', (evt) => {
    this.postBird(evt.detail);
  })

};

Sightings.prototype.getData = function () {
  this.request.get()
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

Sightings.prototype.deleteSighting = function (sightingId) {
  this.request.delete(sightingId)
    .then((sightings) => {
      PubSub.publish('Sightings:data-loaded', sightings);
    })
    .catch(console.error);
};

Sightings.prototype.postBird = function (bird) {
  const request_helper = new RequestHelper (this.url);
  request_helper.post(bird)
  .then((birds) => {
    PubSub.publish('Sightings:data-loaded', birds);
  })
  .catch("Test: ", console.error);
};

module.exports = Sightings;
