import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoianVhbm1lbmRnIiwiYSI6ImNrZGRqZ3F5YzFucm8ydXBkNmRraWVyZW4ifQ.fOgpbBWhLUa-hTut1Q5cRw";

class MapPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: this.props.lng,
            lat: this.props.lat,
            zoom: 10
        };
        this.onChange = this.props.onChange;
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        map.on('move', () => {
            // Update coordinate/zoom state
            this.setState({
              lng: map.getCenter().lng.toFixed(4),
              lat: map.getCenter().lat.toFixed(4),
              zoom: map.getZoom().toFixed(2)
            })
          });

        let marker = new mapboxgl.Marker({
            draggable: true
        })
            .setLngLat([this.state.lng, this.state.lat])
            .addTo(map);
                
        marker.on('dragend', () => {
            var lngLat = marker.getLngLat();
            this.onChange(lngLat.lng, lngLat.lat);
        });
    }

    render() {
        return (
            <div style={{"height": "150px"}} ref={el => this.mapContainer = el} className='mapContainer'>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
            </div>
        );   
    }
}

export default MapPicker;