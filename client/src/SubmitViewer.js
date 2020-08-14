import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class SubmitViewer extends Component {
    callBackendAPI = async () => {
        var formData = new FormData();
        var email = document.querySelector("input[type='email']");
        formData.append('email', email);

        const response = await fetch('api/submitviewer', {
            method: 'POST',
            body: formData
        });
        if (response.status !== 200) {
            throw Error(response.statusText);
        }
    }

    render() {
        return (
            <div className="pageContainer">
                <h2>Submit a Mural</h2>
                <Form onSubmit={this.callBackendAPI}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Your Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll notify you if the mural is added.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.File id="submitFormControlFile" label="Photo" />
                    </Form.Group>

                    {/* Location */}

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default SubmitViewer;