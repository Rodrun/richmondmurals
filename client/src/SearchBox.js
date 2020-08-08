import React, { Component } from "react";
import './App.css';
import { Button, Container } from "react-bootstrap"

class SearchBox extends Component {

    constructor(props) {
        super(props)
        this.state = { search: "" }
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        this.setState({
            search: e.target.value
        })
    }

    render() {
        return (
            <Container fluid className="search-pane">
                <Container fluid className="App-header">
                    <div className="search-area">
                        <input className="search-input" type="text" onChange={this.onChange} />
                        <input className="search-btn" type="submit" value="Go" onSubmit={this.props.goSearch} />
                    </div>
                </Container>
                <Container fluid className="results">
                    golden wind
                </Container>
            </Container>);
    }
}

export default SearchBox;
