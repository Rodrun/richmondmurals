import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import viewerSubmission from './images/viewersubmission.jpg';

class MuralPopup extends Component {
    render() {
        return (
            <Card style={{ "marginTop": "10px" }}>
                {/* To do: replace w/ image from database */}
                <Card.Img variant="top" src={viewerSubmission} />
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>{this.props.desc}</Card.Text>
                    <Button variant="primary">More info</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default MuralPopup;