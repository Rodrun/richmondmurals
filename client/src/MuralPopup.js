import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

class MuralPopup extends Component {
    render() {
        return (
            <Card style={{ "marginTop": "10px" }}>
                <Card.Img variant="top" src={JSON.parse(this.props.mural.images)[0].url} />
                <Card.Body>
                    <Card.Title>{this.props.mural.title}</Card.Title>
                    <Card.Text>{this.props.mural.desc}</Card.Text>
                    <a href={"/mural/" + this.props.mural.id} as={Link} className="btn btn-primary">More info</a>
                </Card.Body>
            </Card>
        );
    }
}

export default MuralPopup;