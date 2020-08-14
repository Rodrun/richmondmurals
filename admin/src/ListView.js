import React, { Component } from "react";
import { Table } from "react-bootstrap";

/**
 * Vertical list component, shows list of mural objects.
 */
class ListView extends Component {
    /**
     * props used:
     * list - List of mural objects to render.
     * key - Authentication key.
     */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table bordered size="sm">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                </Table>
            </div>
        );
    }
}

export class PendingList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListView />
        );
    }
}

export class ActiveList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListView />
        );
    }
}

export default ListView;
