import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

class MuralPopup extends Component {
    render() {
        return (
            <Card style={{ "marginTop": "10px" }}>
                <Card.Img variant="top" src={this.props.image} />
                <Card.Body>
                    <Card.Title>{this.props.title}</Card.Title>
                    <Card.Text>{this.props.desc}</Card.Text>
                    <a href={"/mural/" + this.props.id} as={Link} to="/info" className="btn btn-primary">More info</a>
                </Card.Body>
            </Card>
        );
    }
}

export default MuralPopup;