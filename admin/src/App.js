import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Switch, Route, Link } from 'react-router-dom';
import { PendingList, ActiveList } from './ListView';
import MuralInfo from './MuralInfo';
import Login from './Login';
import Logs from './Logs';
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
                    <Navbar.Brand as={Link} to="/pending">Richmond Mural <b>Admin</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to={{ pathname: "/pending", state: this.state }}>Pending</Nav.Link>
                        <Nav.Link as={Link} to={{ pathname: "/active", state: this.state }}>Active</Nav.Link>
                        <Nav.Link as={Link} to={{ pathname: "/logs", state: this.state }}>Logs</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/pending" component={PendingList} />
                    <Route exact path="/active" component={ActiveList} />
                    <Route exact path="/logs" component={Logs} />
                    <Route path="/mural/:id" component={MuralInfo}/>
                    <Route render={function () {
                        return <h2>Whoops, this page doesn't exist!</h2>
                    }} />
                </Switch>
            </div>
      );
    }
}

export default App;
