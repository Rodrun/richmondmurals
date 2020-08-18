import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Switch, Route, Link } from 'react-router-dom';
import Mapbox from './Mapbox.js';
import About from './About.js';
import Browse from './Browse.js';
import Submit from './Submit.js';
import SubmitArtistForm from './SubmitArtistForm.js';
import SubmitViewerForm from './SubmitViewerForm.js';
import Submitted from './Submitted.js';
import Error from './Error.js';
import MuralInfo from './MuralInfo.js';

class Navigation extends Component {
    render() {
        return (
            <div className='outer'>
                <Navbar className='nav' bg="light" expand="lg">
                    <Navbar.Brand as={Link} to="/">Richmond Mural Project</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/browse">Browse Murals</Nav.Link>
                        <Nav.Link as={Link} to="/submit">Submit a Mural</Nav.Link>
                        
                    </Nav>

                    {/* TO DO: want link in navbar? */}
                    {/* <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/login">Artist Login</Nav.Link>
                    </Nav> */}
                    
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/" component={Mapbox}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/browse" component={Browse}/>
                    <Route exact path="/submit" component={Submit}/>
                    <Route exact path="/submitartist" component={SubmitArtistForm}/>
                    <Route exact path="/submitviewer" component={SubmitViewerForm}/>
                    <Route exact path="/thankyou" component={Submitted}/>
                    <Route exact path="/error" component={Error}/>
                    <Route path="/mural/:id" component={MuralInfo}/>
                    <Route render={function () {
                        return <h2> Page not found</h2>
                    }} />
                </Switch>
            </div>
        );
    }
}

export default Navigation;
        
        