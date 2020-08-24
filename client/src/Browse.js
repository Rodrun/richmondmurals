import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';

class Submit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            murals: null
        };
    }
    componentDidMount() {
        this.callBackendAPI()
            .then(res => {
                this.setState({
                    murals: res.murals
                });
            });
    }
    callBackendAPI = async () => {
        const response = await fetch('/api/list');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    }
    render() {
        if (this.state.murals) {
            return (
                <div className="pageContainer">
                    <h3 style={{"marginBottom": "30px", "margin-left": "15px"}}>Browse Murals</h3>
                    <Container>
                        <Row>
                            {this.state.murals.map((mural, i) => {
                                console.log(mural);
                                return (
                                    <Col key={i} xs={12} md={6} lg={4} style={{"margin-bottom": "30px"}}>
                                        <Card className="h-100">
                                            <a href={"/mural/" + mural.properties.id} as={Link} to={"/mural/" + mural.properties.id}>
                                                <Card.Img 
                                                    style={{
                                                        "height": "200px", 
                                                        "overflow": "hidden", 
                                                        "object-fit": "cover"}} 
                                                    variant="top" 
                                                    src={mural.properties.images[0]} />
                                                <Card.Body>
                                                    <Card.Title
                                                        style={{"color": "black"}}>
                                                        {mural.properties.title}
                                                    </Card.Title>
                                                </Card.Body>
                                            </a>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Container>
                </div>
            ); 
        }
        else {
            return (<div />);
        }
        
    }
}

export default Submit;