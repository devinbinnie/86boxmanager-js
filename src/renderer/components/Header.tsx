import React from 'react';

import {Navbar, Container, Nav} from 'react-bootstrap';

type Props = {
    openAddModal: () => void;
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
                    <Nav.Link
                        onClick={props.openAddModal}
                    >
                        {'Add'}
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
