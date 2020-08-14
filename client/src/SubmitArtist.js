import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class SubmitArtist extends Component {
    render() {
        return (
            <div className="pageContainer">
                <h2>Submit Your Mural</h2>
                <Form>

                    <Form.Group controlId="exampleForm.ControlText1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll notify you if the mural is added to our site.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.File id="submitFormControlFile" label="Mural Photo" />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Mural Description</Form.Label>
                        <Form.Control as="textarea" rows="3" placeholder="This description will be displayed on the info page for your mural."/>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlText2">
                        <Form.Label>Instagram</Form.Label>
                        <Form.Control type="text" placeholder="Enter Instagram handle or link" />
                    </Form.Group>


                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default SubmitArtist;