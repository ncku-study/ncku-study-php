import React, { Component } from 'react';
import './icon.css';

class icon extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const outsideColor = this.props.isWhite ? 'white' : '#e1af13';
        const insideColor = this.props.isWhite
            ? 'rgba(255,255,255,0.6)'
            : '#e1af13';
        return (
            <div className="lds-css-ng-scope" style={this.props.style}>
                <div
                    style={{ width: '100%', height: '100%' }}
                    className="lds-ripple"
                >
                    <div style={{ borderColor: outsideColor }}></div>
                    <div style={{ borderColor: insideColor }}></div>
                </div>
            </div>
        );
    }
}

export default icon;
