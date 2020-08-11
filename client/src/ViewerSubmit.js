import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class ViewerSubmit extends Component {
    render() {
        return (
            <div class="pageContainer">
                <h2>Submit a Mural</h2>
                <Form>
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

export default ViewerSubmit;