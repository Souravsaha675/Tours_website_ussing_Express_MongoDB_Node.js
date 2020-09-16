/* eslint-disable*/
//const mapboxgl = require('mapbox-gl');

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic291cmF2c2FoYTY3NSIsImEiOiJja2Y1djFnMjAwOG9kMnhvemFrMzR0NDh3In0.Rc_Mu0Hsma44_iKj2xdPbg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/souravsaha675/ckf5wadz130mh19oa6nzxm5pv',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  const el = document.createElement('div');

  e.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
