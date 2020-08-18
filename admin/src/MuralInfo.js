import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
// import MuralMap from './MuralMap';

class MuralInfo extends Component {
    // TO DO: CHANGE TO BE A FORM
    render() {
        let mural = this.props.location.state.mural;
        return (
            <div className="pageContainer">
                {mural ? 
                    <div>
                        <h2>{mural.properties.title}</h2>
                        <div style={{"textAlign": "center"}}>
                        <Carousel style={{"margin": "30px"}}>
                            {mural.properties.images.map((image, i) => {
                                return (<Carousel.Item key={i}>
                                    <img
                                    className="d-block w-100"
                                    src={image}
                                    alt="First slide"
                                    />
                                </Carousel.Item>);
                            })}
                        </Carousel>
                        </div>
                          
                        <p>{mural.properties.desc}</p>
                        <hr/>
                        <h5>Artist: {mural.properties.artist}</h5> 
                        {/* TO DO: add additional properties */}
                        <hr/>
                        {/* <MuralMap coordinates={mural.geometry.coordinates} /> */}
                        <hr/>
                        <a href="/" as={Link} to="/" className="btn btn-primary">Return to Home</a>
                    </div> : 
                    <div></div>}
            </div>
        ); 
    }
}

export default withRouter(MuralInfo);