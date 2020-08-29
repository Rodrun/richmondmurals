import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MapPicker from './MapPicker';

class MuralEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mural: this.props.location.state.mural
        };
        console.log(this.state);
        this.fileInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const newProperties = {...this.state.newProperties};
        newProperties[name] = value;
        this.setState({
            newProperties: newProperties
        });
    }

    handleLocationChange = (lng, lat) => {
        const newProperties = {...this.state.newProperties};
        newProperties.lng = lng;
        newProperties.lat = lat;
        this.setState({
            newProperties: newProperties
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
        for (const [key, value] of Object.entries(this.state.newProperties)) {
            console.log("key: ", key);
            console.log("value: ", value);
            formData.append(key, value);
        }
        // for (const index in this.fileInput.current.files) {
        //     formData.append("image", this.fileInput.current.files[index]);
        // }

        const response = await fetch('/api/pendingartist/' + this.state.mural.properties.id, {
            method: 'PUT',
            body: formData
        });
        if (response.status !== 200) {
            this.setState({error: true});
            throw Error(response.statusText);
        }
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
                    <h2>Edit Pending Mural</h2>
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="exampleForm.ControlText1">
                            <Form.Label>Mural Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                value={this.state.value} 
                                onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlText2">
                            <Form.Label>Artist Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="artist"
                                value={this.state.value} 
                                onChange={this.handleChange}/>
                        </Form.Group>
    
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                placeholder="Enter email"
                                value={this.state.value} 
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
    
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Mural Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="3" 
                                placeholder="This description will be displayed on the info page for your mural."
                                name="description"
                                value={this.state.value} 
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
                        
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <MapPicker 
                                onChange={this.handleLocationChange} 
                                lng={this.state.mural.geometry.coordinates[0]} 
                                lat={this.state.mural.geometry.coordinates[1]}/>
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

export default MuralEdit;