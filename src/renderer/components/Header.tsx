import React from "react";

import {Navbar, Container, Nav} from 'react-bootstrap';

type Props = {
    openConfigureModal: () => void;
}

const Header = (props: Props) => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand>{'86BoxManager-js'}</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link
                        onClick={props.openConfigureModal}
                    >
                        {'Configure'}
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;