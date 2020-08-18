import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MuralPopup from './MuralPopup';

mapboxgl.accessToken = "pk.eyJ1IjoianVhbm1lbmRnIiwiYSI6ImNrZGRqZ3F5YzFucm8ydXBkNmRraWVyZW4ifQ.fOgpbBWhLUa-hTut1Q5cRw";

class Mapbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            lng: -77.44,
            lat: 37.53,
            zoom: 10
        };
    }
    
    componentDidMount() {
        // Fun map setup and config
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [this.state.lng, this.state.lat],
          zoom: this.state.zoom
        });
    
        // Load marker image
        map.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
          (error, image) => {
            if (error) throw error
              map.addImage('custom-marker', image)
            }
        );
    
        // User's location
        map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
    
        map.on('move', () => {
          // Update coordinate/zoom state
          this.setState({
            lng: map.getCenter().lng.toFixed(4),
            lat: map.getCenter().lat.toFixed(4),
            zoom: map.getZoom().toFixed(2)
          })
        });
    
        /**
         * Handles geocoder searches.
         */
        let forwardGeocoder = (query) => {
          var matchingFeatures = [];
          for (var i = 0; i < this.state.data.features.length; i++) {
            var feature = this.state.data.features[i];
            if (feature.properties.title.toLowerCase().includes(query.toLowerCase())) {
              feature['place_name'] = 'Mural:' + feature.properties.title
              feature['center'] = feature.geometry.coordinates
              feature['place_type'] = ['mural']
              matchingFeatures.push(feature)
            }
          }
          return matchingFeatures;
        };
    
        // Show mouse pointer over mural hover (points layer)
        map.on('mouseenter', 'points', function() {
          map.getCanvas().style.cursor = 'pointer'
        });
      
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'points', function() {
          map.getCanvas().style.cursor = ''
        });
    
        map.on('load', () => {
          // Load mural data
          this.callBackendAPI()
            .then(res => {
              // Update state with mural data
              // TODO: Perhaps change the database document?
              this.setState({ data:
                {
                  type: 'FeatureCollection',
                  features: res.murals
                }
              });
    
              // Geocoder search bar
              map.addControl(new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                placeHolder: 'Search',
                localGeocoder: forwardGeocoder,
                mapboxgl: mapboxgl
              }));
    
              // Add mural data as a source
              map.addSource('murals', {
                type: 'geojson',
                data: this.state.data
              });
    
              // Add marker layer
              map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'murals',
                'layout': {
                  'icon-image': 'custom-marker',
                  // get the title name from the source's "title" property
                  'text-field': ['get', 'title'],
                  'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                  ],
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top'
                }
              });
    
              // Show popup on mural click
              map.on('click', 'points', (e) => {
                let coordinates = e.features[0].geometry.coordinates.slice();
    
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                let popup = <MuralPopup mural={e.features[0].properties}/>
                const popupContainer = document.createElement('div');
                ReactDOM.render(popup, popupContainer);

                new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupContainer)
                .addTo(map);
              });
            }) // then
            .catch(err => console.log(err))
        }); // on load
    }

    callBackendAPI = async () => {
        const response = await fetch('/api/list');
        const body = await response.json();
    
        if (response.status !== 200) {
          throw Error(body.message);
        }
        return body;
    }
    
    render() {
        return (
            <div ref={el => this.mapContainer = el} className='mapContainer'>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
            </div>
        );
    }
}

export default Mapbox;