import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MapPicker from './MapPicker';

class SubmitMuralForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.match.params.type,
            title: '',
            desc: '',
            artist: '',
            email: '',
            instagram: '',
            redirect: false,
            error: false,
            lng: -77.44,
            lat: 37.53,
        };
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
        event.preventDefault();
        var formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('email', this.state.email);
        formData.append('artist', this.state.artist);
        for (const index in this.fileInput.current.files) {
            formData.append("image", this.fileInput.current.files[index]);
        }
        formData.append("desc", this.state.desc);
        formData.append("instagram", this.state.instagram);
        formData.append("lng", this.state.lng);
        formData.append("lat", this.state.lat);


        const response = await fetch('/api/pending/' + this.state.type, {
            method: 'POST',
            body: formData
        });
        if (response.status !== 201) {
            this.setState({error: true});
            throw Error(response.statusText);
        }
        this.setState({redirect: true});
    }
    
    render() {
        if (this.state.redirect) {
            if (this.state.error) {
                return (<Redirect to="/error" />);
            }
            else {
                return (<Redirect to="/thankyou" />);
            }
        }
        else {
            return (
                <div className="pageContainer">
                    <h2>Submit {this.state.type === "artist" ? "Your" : "a"} Mural</h2>
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="exampleForm.ControlText1">
                            <Form.Label>Mural Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder={this.state.type === 'viewer' ? "Enter a brief description. For example, 'Blue Owl Mural'." : "Enter title"}
                                value={this.state.title} 
                                onChange={this.handleChange}/>
                        </Form.Group>
    
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                placeholder="Enter email"
                                value={this.state.email} 
                                onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                            We'll notify you if the mural is added to our site.
                            </Form.Text>
                        </Form.Group>
    
                        <Form.Group>
                            <Form.File 
                                id="submitFormControlFile" 
                                label="Mural Photo" 
                                name="image"
                                ref={this.fileInput}
                                onChange={this.handleFileChange}
                                multiple
                                accept="image/*" />
                        </Form.Group>

                        {this.state.type === "artist" ? 
                            <div>
                                <Form.Group controlId="exampleForm.ControlText2">
                                    <Form.Label>Artist Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="artist"
                                        placeholder="Enter artist name"
                                        value={this.state.artist} 
                                        onChange={this.handleChange}/>
                                </Form.Group>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Mural Description</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="3" 
                                        placeholder="This description will be displayed on the info page for your mural."
                                        name="desc"
                                        value={this.state.desc} 
                                        onChange={this.handleChange}/>
                                </Form.Group>
            
                                <Form.Group controlId="exampleForm.ControlText3">
                                    <Form.Label>Instagram</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter artist Instagram handle or link" 
                                        name="instagram"
                                        value={this.state.instagram} 
                                        onChange={this.handleChange}/>
                                </Form.Group>
                            </div> :
                            <div></div>
                        }
                        
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <MapPicker 
                                onChange={this.handleLocationChange} 
                                lng={this.state.lng} 
                                lat={this.state.lat}/>
                        </Form.Group>
                        
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
                
            );
        }
    }
}

export default SubmitMuralForm;