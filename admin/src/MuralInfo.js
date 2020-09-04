import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import MuralMap from './MuralMap';

class MuralInfo extends Component {
    render() {
        let mural = this.props.location.state.mural;
        console.log(mural);
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
                        <h5>Instagram: {mural.properties.instagram}</h5>
                        <h5>Submitter email: {mural.properties.email}</h5>

                        <hr/>
                        <MuralMap coordinates={mural.geometry.coordinates} />
                        <hr/>
                        <h5>Marked as rejected: {mural.properties.reject ? "Yes" : "No"}</h5>
                        <h5>Admin Notes: {mural.properties.notes}</h5>
                        <hr/>
                        <Link to={{
                            pathname: "/edit/" + mural.properties.id,
                            state: {
                                mural: mural,
                                type: this.props.location.state.type
                            }
                        }} className="btn btn-primary">Edit</Link>
                    </div> : 
                    <div></div>}
            </div>
        ); 
    }
}

export default withRouter(MuralInfo);