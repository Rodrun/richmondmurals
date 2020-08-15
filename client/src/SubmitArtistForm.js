import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

class SubmitArtistForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            artist: '',
            description: '',
            instagram: '',
            redirect: false,
            error: false
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
        console.log("handleSubmit");
        this.setState({redirect: true});
        var formData = new FormData();
        formData.append('email', this.state.email);
        formData.append("image", this.fileInput.current.files[0]);
        formData.append("description", this.state.description);
        formData.append("instagram", this.state.instagram);

        const response = await fetch('/api/pendingartist', {
            method: 'POST',
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
                    <h2>Submit Your Mural</h2>
                    <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="exampleForm.ControlText1">
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
                                ref={this.fileInput} />
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
    
                        <Form.Group controlId="exampleForm.ControlText2">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Instagram handle or link" 
                                name="instagram"
                                value={this.state.value} 
                                onChange={this.handleChange}/>
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

export default SubmitArtistForm;