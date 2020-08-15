import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Error extends Component {
    render() {
        return (
            <div className="pageContainer">
               <h3>Error </h3>
                
                <p>Something went wrong.</p>
               <a href="/" as={Link} to="/" className="btn btn-primary">Return to Home</a>

            </div>
        ); 
    }
}

export default Error;