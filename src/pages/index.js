import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';

import Layout from 'components/Layout';
import Map from 'components/Map';

import { locations } from 'data/locations';

const LOCATION = {
  lat: 1.355868912704237, 
  lng: 103.8593623315489
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    if ( !leafletElement ) return;

    leafletElement.eachLayer((layer) => leafletElement.removeLayer(layer));

    const tripPoints = createTripPointsGeoJson({ locations });
    const tripLines = createTripLinesGeoJson({ locations });

    const tripPointsGeoJsonLayers = new L.geoJson(tripPoints, {
      pointToLayer: tripStopPointToLayer
    });

    const tripLinesGeoJsonLayers = new L.geoJson(tripLines);

    tripPointsGeoJsonLayers.addTo(leafletElement);
    tripLinesGeoJsonLayers.addTo(leafletElement);

    const bounds = tripPointsGeoJsonLayers.getBounds();

    leafletElement.fitBounds(bounds);
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings} />
      <Container type="content" className="text-center home-start">
        <p>
        My first time to attend and complete 9 days misa de gallo/simbang gabi outside Philippines + attended Christmas Eve mass at Novena Church. <br />
        Thank you for this wonderful experience. 🇸🇬 I'm so happy. Best christmas gift for myself. <br />
        Merry christmas everyone. 🥰 <br />
        #paskongpinoy #christmas2022 #✅️bucketlist #jollikid😂 #forevergrateful #foreverblessed
        </p>
      </Container>
    </Layout>
  );
};

export default IndexPage;

/**
 * tripStopPointToLayer
 */

function createTripPointsGeoJson({ locations } = {}) {
  return {
    "type": "FeatureCollection",
    "features": locations.map(({ church, address, placename, location = {}, image, info, todo = [] } = {}) => {
      const { lat, lng } = location;
      return {
        "type": "Feature",
        "properties": {
          church,
          address,
          placename,
          todo,
          info,
          image
        },
        "geometry": {
          "type": "Point",
          "coordinates": [ lng, lat ]
        }
      }
    })
  }
}

/**
 * tripStopPointToLayer
 */

function createTripLinesGeoJson({ locations } = {}) {
  return {
    "type": "FeatureCollection",
    "features": locations.map((stop = {}, index) => {
      const prevStop = locations[index - 1];

      if ( !prevStop ) return [];

      const { church, address, placename, location = {}, info, todo = [] } = stop;
      const { lat, lng } = location;
      const properties = {
        church,
        address,
        placename,
        todo,
        info
      };

      const { location: prevLocation = {} } = prevStop;
      const { lat: prevLat, lng: prevLng } = prevLocation;

      return {
        type: 'Feature',
        properties,
        geometry: {
          type: 'LineString',
          coordinates: [
            [ prevLng, prevLat ],
            [ lng, lat ]
          ]
        }
      }
    })
  }
}

/**
 * tripStopPointToLayer
 */

function tripStopPointToLayer( feature = {}, latlng ) {
  const { properties = {} } = feature;
  const {church, address, placename, todo = [], image, info } = properties;

  const list = todo.map(what => `<li>${ what }</li>`);
  let listString = '';
  let imageString = '';

  if ( Array.isArray(list) && list.length > 0 ) {
    listString = list.join('');
    listString = `
      <p>${church}</p>
      <ul>${listString}</ul>
    `
  }

  if ( image ) {
    imageString = `
      <span class="trip-stop-image" style="background-image: url(${image})">${placename}</span>
    `;
  }

  const text = `
    <div class="trip-stop">
      ${ imageString }
      <div class="trip-stop-content">
        <h2>${placename}</h2>
        <p>${address}</p>
        <p class="trip-stop-date"><a href="${info}" target="_blank">More Photos</a></p>
        ${ listString }
      </div>
    </div>
  `;

  const popup = L.popup({
    maxWidth: 250
  }).setContent(text);

  const layer = L.marker( latlng, {
    icon: L.divIcon({
      className: 'icon',
      html: `<span class="icon-adventurer"></span>`,
      iconSize: 20
    }),
    riseOnHover: true
  }).bindPopup(popup);

  return layer;
}