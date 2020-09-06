import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Button, Carousel } from 'react-bootstrap';

import MuralMap from './MuralMap';

class MuralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mural: this.props.location.state.mural,
            type: this.props.location.state.type,
            redirect: false,
            error: false
        };
    }

    submitMural = async() => {
        const mural = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [this.state.mural.geometry.lng, this.state.mural.geometry.lat]
            },
            properties: {
                title: this.state.mural.properties.title,
                desc: this.state.mural.properties.desc,
                artist: this.state.mural.properties.artist,
                email: this.state.mural.properties.email,
                instagram: this.state.mural.properties.instagram,
                images: this.state.mural.properties.images,
                id: this.state.mural.properties.id
            }
        };
        const activeResponse = await fetch('/api/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mural)
        });
        if (activeResponse.status !== 201) {
            this.setState({error: true});
            throw Error(activeResponse.statusText);
        }

        this.deleteMural(false);
        this.setState({redirect: true});
    }

    deleteMural = async(deleteImages) => {
        let url = '/api/';
        this.state.type === 'active' ? url += 'list/' : url += 'pending/' + this.state.type + '/';

        // Add images to response body if deleteImages
        const body = {};
        if (deleteImages) {
            body.images = this.state.mural.properties.images;
        }

        const response = await fetch(url + this.state.mural.properties.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(body)
        });
        if (response.status !== 200) {
            this.setState({error: true});
            throw Error(response.statusText);
        }
        this.setState({redirect: true});
    }

    render() {
        if (this.state.redirect) {
            if (this.state.error) {
                return (<Redirect to="/error" />);
                // to do: flash error?
            } else {
                return (<Redirect to={"/admin"} />);
            }
        } else {
            let mural = this.state.mural;
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
                                        src={image.url}
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
                            {this.state.type !== 'active' ? 
                                <Button variant="btn btn-success" style={{"marginLeft": "10px"}} onClick={this.submitMural}>
                                    Submit Mural
                                </Button>
                                : <span/>
                            }
                            
                            <Button variant="btn btn-danger" style={{"marginLeft": "10px"}} onClick={() => this.deleteMural(true)}>
                                Delete Mural
                            </Button>
                        </div> : 
                        <div></div>}
                </div>
            ); 
        }
    }
}

export default withRouter(MuralInfo);