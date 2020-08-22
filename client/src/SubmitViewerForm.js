import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import MapPicker from './MapPicker';

class SubmitViewerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            email: '',
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

    handleSubmit = async (event) => {
        this.setState({redirect: true});
        var formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('email', this.state.email);
        formData.append("image", this.fileInput.current.files[0]);
        formData.append("lng", this.state.lng);
        formData.append("lat", this.state.lat);

        const response = await fetch('/api/pendingviewer', {
            method: 'POST',
            body: formData
        });
        if (response.status !== 200) {
            this.setState({error: true});
            throw Error(response.statusText);
        }
    }

    handleLocationChange = (lng, lat) => {
        this.setState({
            lng: lng,
            lat: lat
        });
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
                    <h2>Submit a Mural</h2>
                    <Form.Group controlId="exampleForm.ControlText1">
                            <Form.Label>Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="title"
                                placeholder="Enter a brief description. For example, 'Blue Owl Mural'." 
                                value={this.state.value} 
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
                                ref={this.fileInput} />
                        </Form.Group>
                        
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

export default SubmitViewerForm;