import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoianVhbm1lbmRnIiwiYSI6ImNrZGRqZ3F5YzFucm8ydXBkNmRraWVyZW4ifQ.fOgpbBWhLUa-hTut1Q5cRw";

class MuralMap extends Component {
    constructor(props) {
        super(props);  
        this.state = {
            lng: this.props.coordinates[0],
            lat: this.props.coordinates[1],
            zoom: 10
        };
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: [this.state.lng, this.state.lat], 
            zoom: this.state.zoom 
        });

        new mapboxgl.Marker()
            .setLngLat([this.state.lng, this.state.lat])
            .addTo(map);

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });
        this.getAddress()
            .then(res => {
                this.setState({address: res});
            });
        
    }

    getAddress = async () => {
        let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + this.state.lng + "," + this.state.lat + ".json?access_token=" + mapboxgl.accessToken;
        const response = await fetch(url);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body.features[0].place_name;
    }

    render() {
        return (
            <Card style={{ width: '18rem' }}>
                <div style={{"height": "150px"}} ref={el => this.mapContainer = el}></div>
                <Card.Body>
                    {this.state.address ? 
                        <address style={{"fontSize":"14px", "fontWeight": "bold"}}>
                            {this.state.address}
                        </address> :
                        <address></address>
                    }
                </Card.Body>
            </Card>

            
        );
    }
}

export default MuralMap;