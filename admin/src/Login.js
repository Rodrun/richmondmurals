import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

/**
 * Login form component.
 */
class Login extends Component {
    render() {
        return (
            <Form>
                <Form.Group controlId="loginEmail">
                    <Form.Label>User Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" />
                </Form.Group>
                <Form.Group controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        );
    }
}

export default Login;
