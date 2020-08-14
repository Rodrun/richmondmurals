import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import artistSubmission from './images/artistsubmission.jpg';
import viewerSubmission from './images/viewersubmission.jpg';

class Submit extends Component {
    render() {
        return (
            <div className="pageContainer">
                <Container>
                    <Row>
                        <Col xs={12} md={6}>
                            <Card className="submitCard">
                                <Card.Img variant="top" src={artistSubmission} />
                                <Card.Body>
                                    <Card.Title>Artist Submission</Card.Title>
                                    <Card.Text>
                                    Are you a muralist wanting to get your mural on this site?
                                    </Card.Text>
                                    <a href="/submitartist" as={Link} to="/submitartist" className="btn btn-primary">Submit your mural</a>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card className="submitCard">
                                <Card.Img variant="top" src={viewerSubmission} />
                                <Card.Body>
                                    <Card.Title>Viewer Submission</Card.Title>
                                    <Card.Text>
                                    See a mural you think should be on this site?
                                    </Card.Text>
                                    <a href="/submitviewer" as={Link} to="/submitviewer" className="btn btn-primary">Submit a mural</a>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </div>
        ); 
    }
}

export default Submit;