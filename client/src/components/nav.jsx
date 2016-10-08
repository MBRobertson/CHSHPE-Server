import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

let links = [
    {
        id: 1,
        name: "Dashboard",
        url: "/"
    },
    {
        id: 2,
        name: "Schedule",
        url: "/schedule"
    },
    {
        id: 3,
        name: "Manage",
        url: "/manage"
    }
]

class Nav extends React.Component {
    render() {
        var linkNodes = links.map((link) => {
            return (
                <NavButton key={link.id} link={link} loc={this.props.loc.pathname} />
            );
        });
        return (
            <nav>
                <h1>CHS PE</h1>
                {linkNodes}
            </nav>
        );
    }
}

class NavButton extends React.Component {
    render() {
        return (<Link className={this.props.loc == this.props.link.url ? 'active' : ''} to={this.props.link.url}>{this.props.link.name}</Link>);
    }
}

export default Nav
export { Nav }
