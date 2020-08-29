import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Switch, Route, Link } from 'react-router-dom';
import Home from './Home';
import { PendingList, ActiveList } from './ListView';
import MuralInfo from './MuralInfo';
import MuralEdit from './MuralEdit';
import Login from './Login';
import Logs from './Logs';
import Error from './Error';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = { auth: null };
    }

    render() {
        return (
            <div>
                <Navbar className='nav' bg="light" expand="lg">
                    <Navbar.Brand as={Link} to="/admin">Richmond Mural <b>Admin</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Pending" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={{ pathname: "/pendingviewer", state: this.state }}>Viewer Submitted</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={{ pathname: "/pendingartist", state: this.state }}>Artist Submitted</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to={{ pathname: "/active", state: this.state }}>Active</Nav.Link>
                        <Nav.Link as={Link} to={{ pathname: "/logs", state: this.state }}>Logs</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/admin" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/pendingviewer" render={() => (<PendingList type={"viewer"} />)} />
                    <Route exact path="/pendingartist" render={() => (<PendingList type={"artist"} />)} />
                    <Route exact path="/active" component={ActiveList} />
                    <Route exact path="/logs" component={Logs} />
                    <Route exact path="/error" component={Error} />
                    <Route path="/mural/:id" component={MuralInfo}/>
                    <Route path="/edit/:id" component={MuralEdit}/>
                    <Route render={function () {
                        return <h2>Whoops, this page doesn't exist!</h2>
                    }} />
                </Switch>
            </div>
      );
    }
}

export default App;
