import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PendingList, ActiveList } from './ListView';

class Home extends Component {
    render() {
        return (
            <div className="pageContainer">
               <ActiveList />
               <PendingList type={"artist"} />
               <PendingList type={"viewer"} />

            </div>
        ); 
    }
}

export default Home;