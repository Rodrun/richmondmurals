import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import MuralMap from './MuralMap';

class MuralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mural: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => {
                this.setState({
                    mural: res.mural[0]
                });
            });
        
    }

    callBackendAPI = async () => {
        const id = this.props.match.params.id;
        const response = await fetch('/api/mural/' + id);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    }

    render() {
        return (
            <div className="pageContainer">
                {this.state.mural ? 
                    <div>
                        <h2>{this.state.mural.properties.title}</h2>
                        {/* TO DO: multiple photos */}
                        <Image src={this.state.mural.properties.images[0]} style={{"width": "100%"}} fluid/>
                        <p>{this.state.mural.properties.desc}</p>
                        <hr/>
                        <h5>Artist: {this.state.mural.properties.artist}</h5> 
                        {/* TO DO: add additional properties */}
                        <hr/>
                        <MuralMap coordinates={this.state.mural.geometry.coordinates} />
                        <hr/>
                        <a href="/" as={Link} to="/" className="btn btn-primary">Return to Home</a>
                    </div> : 
                    <div></div>}
            </div>
        ); 
    }
}

export default withRouter(MuralInfo);