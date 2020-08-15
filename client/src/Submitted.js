import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Submitted extends Component {
    render() {
        return (
            <div className="pageContainer">
               <h3>Thanks for your submission! </h3>
                
                <p>You will receive an email if your submission has been accepted.</p>
               <a href="/" as={Link} to="/" className="btn btn-primary">Return to Home</a>

            </div>
        ); 
    }
}

export default Submitted;