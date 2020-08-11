import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import artistSubmission from './images/artistsubmission.jpg';
import viewerSubmission from './images/viewersubmission.jpg';

class Submit extends Component {
    render() {
        return (
            <div class="pageContainer">
                <Container>
                    <Row>
                        <Col>
                            <Card className="submitCard">
                                <Card.Img variant="top" className="embed-responsive-item" src={artistSubmission} />
                                <Card.Body>
                                    <Card.Title>Artist Submission</Card.Title>
                                    <Card.Text>
                                    Are you a muralist wanting to get your mural on this site?
                                    </Card.Text>
                                    <a href="/artistsubmission" as={Link} to="/artistsubmission" class="btn btn-primary">Submit your mural</a>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="submitCard">
                                <Card.Img variant="top" src={viewerSubmission} />
                                <Card.Body>
                                    <Card.Title>Viewer Submission</Card.Title>
                                    <Card.Text>
                                    See a mural you think should be on this site?
                                    </Card.Text>
                                    <a href="/viewersubmission" as={Link} to="/viewersubmission" class="btn btn-primary">Submit a mural</a>
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