import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MapPicker from './MapPicker';


// TO DO: HANDLE IMAGES
class MuralEdit extends Component {
    constructor(props) {
        super(props);
        const mural = this.props.location.state.mural;
        const type = this.props.location.state.type;
        if (type === "viewer") {
            this.state = {
                id: mural.properties.id,
                title: mural.properties.title,
                email: mural.properties.email,
                type: type,
                redirect: false,
                error: false,
                lng: mural.geometry.coordinates[0],
                lat: mural.geometry.coordinates[1],
            };
        } else {
            this.state = {
                id: mural.properties.id,
                title: mural.properties.title,
                email: mural.properties.email,
                description: mural.properties.description,
                artist: mural.properties.artist,
                instagram: mural.properties.instagram,
                type: type,
                redirect: false,
                error: false,
                lng: mural.geometry.coordinates[0],
                lat: mural.geometry.coordinates[1],
            };
        }
        
        this.fileInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleLocationChange = (lng, lat) => {
        this.setState({
            lng: lng,
            lat: lat
        });
    }

    handleFileChange = (event) => {
        for (const index in this.fileInput.current.files) {
            if(this.fileInput.current.files[index].size > 10485760) {
                alert("Uploaded image(s) too large. Images must be less than 10MB.");
                event.target.value = null;
            }
        }
    }

    handleSubmit = async (event) => {
        this.setState({redirect: true});
        var formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('email', this.state.email);
        for (const index in this.fileInput.current.files) {
            formData.append("image", this.fileInput.current.files[index]);
        }
        formData.append("lng", this.state.lng);
        formData.append("lat", this.state.lat);

        if (this.state.type === "viewer") {
            const response = await fetch('/api/pending/viewer/' + this.state.id, {
                method: 'PUT',
                body: formData
            });
            if (response.status !== 200) {
                this.setState({error: true});
                throw Error(response.statusText);
                
            }
        } else {
            formData.append('artist', this.state.artist);
            formData.append("description", this.state.description);
            formData.append("instagram", this.state.instagram);
            const response = await fetch('/api/pending/artist/' + this.state.id, {
                method: 'PUT',
                body: formData
            });
            if (response.status !== 200) {
                this.setState({error: true});
                throw Error(response.statusText);
                
            }
        }
    }

    render() {
        if (this.state.redirect) {
            if (this.state.error) {
                return (<Redirect to="/error" />);
            }
            else {
                return (<Redirect to={"/pending" + this.state.type} />);
            }
        }
        else {
            return (
                <div className="pageContainer">
                    <h2>Edit Pending {this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1)} Mural</h2>
                    <Form.Group controlId="exampleForm.ControlText1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder="Enter a brief description. For example, 'Blue Owl Mural'." 
                                value={this.state.value} 
                                defaultValue={this.state.title}
                                onChange={this.handleChange}/>
                        </Form.Group>
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Your Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                placeholder="Enter email" 
                                value={this.state.value} 
                                defaultValue={this.state.email}
                                onChange={this.handleChange}/>
                            <Form.Text className="text-muted">
                            We'll notify you if the mural is added.
                            </Form.Text>
                        </Form.Group>
    
                        <Form.Group>
                            <Form.File 
                                id="submitFormControlFile" 
                                label="Photo"
                                name="image"
                                ref={this.fileInput}
                                onChange={this.handleFileChange}
                                multiple 
                                accept="image/*"/>
                        </Form.Group>

                        {this.state.type === "artist" ? 
                            <div>
                            <Form.Group controlId="exampleForm.ControlText2">
                                <Form.Label>Artist Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="artist"
                                    value={this.state.value} 
                                    defaultValue={this.state.artist}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mural Description</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows="3" 
                                    placeholder="This description will be displayed on the info page for your mural."
                                    name="description"
                                    value={this.state.value} 
                                    defaultValue={this.state.description}
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlText3">
                                <Form.Label>Instagram</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Instagram handle or link" 
                                    name="instagram"
                                    value={this.state.value} 
                                    onChange={this.handleChange}/>
                            </Form.Group>
                            
                            </div> :
                            <p></p>
                        }
                        
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <MapPicker 
                                onChange={this.handleLocationChange} 
                                lng={this.state.lng} 
                                lat={this.state.lat}/>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </div>
            );
        }
    }
}

export default MuralEdit;