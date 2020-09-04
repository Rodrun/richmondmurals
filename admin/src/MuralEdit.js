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
        this.state = {
            id: mural.properties.id,
            title: mural.properties.title,
            email: mural.properties.email,
            desc: mural.properties.desc,
            artist: mural.properties.artist,
            instagram: mural.properties.instagram,
            reject: mural.properties.reject,
            notes: mural.properties.notes,
            type: type,
            redirect: false,
            error: false,
            lng: mural.geometry.coordinates[0],
            lat: mural.geometry.coordinates[1],
        };
        
        this.fileInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked: target.value;
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
        event.preventDefault();
        var formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('email', this.state.email);
        for (const index in this.fileInput.current.files) {
            formData.append("image", this.fileInput.current.files[index]);
        }
        formData.append('artist', this.state.artist);
        formData.append("desc", this.state.desc);
        formData.append("instagram", this.state.instagram);
        // TO DO: handle images
        formData.append("reject", this.state.reject ? 'reject' : 'accept');
        formData.append("notes", this.state.notes);
        formData.append("lng", this.state.lng);
        formData.append("lat", this.state.lat);
        const response = await fetch('/api/pending/' + this.state.type + '/' + this.state.id, {
            method: 'PUT',
            body: formData
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
            } else {
                return (<Redirect to={"/pending" + this.state.type} />);
            }
        } else {
            return (
                <div className="pageContainer">
                    <h2>Edit Pending {this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1)} Mural</h2>
                    <Form.Group controlId="exampleForm.ControlText1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder="Enter mural title" 
                                value={this.state.title} 
                                onChange={this.handleChange}/>
                        </Form.Group>
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Submitter Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                placeholder="Enter submitter email" 
                                value={this.state.email} 
                                onChange={this.handleChange}/>
                            <Form.Text className="text-muted">
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

                        <Form.Group controlId="exampleForm.ControlText2">
                            <Form.Label>Artist Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="artist"
                                value={this.state.artist} 
                                onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Mural Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="3" 
                                placeholder="This description will be displayed on the info page for the mural."
                                name="desc"
                                value={this.state.desc} 
                                onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlText3">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Instagram handle or link" 
                                name="instagram"
                                value={this.state.instagram} 
                                onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <MapPicker 
                                onChange={this.handleLocationChange} 
                                lng={this.state.lng} 
                                lat={this.state.lat}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" 
                                checked={this.state.reject}
                                onChange={this.handleChange}
                                name="reject"
                                label="Reject mural" />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea2">
                            <Form.Label>Admin Notes</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="3" 
                                placeholder="Enter administrative notes"
                                name="notes"
                                value={this.state.notes} 
                                onChange={this.handleChange}/>
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