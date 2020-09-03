import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { Link } from 'react-router-dom';

/**
 * Vertical list component, shows list of mural objects.
 */
class ListView extends Component {
    /**
     * props used:
     * list - List of mural objects to render.
     * key - Authentication key.
     */

    getDate(dateString) {
        if (!dateString)
            return '';
        const date = new Date(dateString);
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const y = date.getFullYear();
        return m + '-' + d + '-' + y;
    }

    render() {
        if (this.props.murals) {
            return (
                <div className="pageContainer">
                    <h3>{this.props.type !== "active" ? "Pending " : ""}{this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)} Murals</h3>
                    <Table bordered striped size="sm">
                        <thead>
                            <tr>
                                <th>Date Updated</th>
                                <th>Title</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.murals.map((mural, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{this.getDate(mural.properties.date)}</td>
                                        <td>
                                            <Link to={{
                                                pathname: "/mural/" + mural.properties.id,
                                                state: {
                                                    mural: mural,
                                                    type: this.props.type
                                                }
                                            }}>
                                                {mural.properties.title}
                                            </Link>
                                            </td>
                                        <td>{mural.properties.email}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            );
        } else {
            return (<div></div>);
        }
        
    }
}

export class PendingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            murals: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => {
                this.setState({murals: res.list});
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.type !== this.props.type) {
            this.setState({
                type: this.props.type,
            }, () => {
                this.callBackendAPI()
                    .then(res => {
                        this.setState({murals: res.list});
                    });
            });
            
        }
    }

    callBackendAPI = async () => {
        const response = await fetch("/api/pending/" + this.state.type);
        const body = await response.json();
        console.log(body);

        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    }

    render() {
        return (
            <div>   
                <ListView murals={this.state.murals} type={this.state.type} />
            </div>
            
        );
    }
}

export class ActiveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            murals: null
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => {
                this.setState({murals: res.murals});
            });
    }

    callBackendAPI = async () => {
        const response = await fetch("/api/list");
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    }

    render() {
        return (
            <ListView murals={this.state.murals} type={"active"} />
        );
    }
}

export default ListView;
