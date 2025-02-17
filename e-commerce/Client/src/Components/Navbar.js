import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarComponent() {
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Proto-Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/Sculptures">Sculptures</Nav.Link>
            <NavDropdown title="Clothing" id="basic-nav-dropdown">
              <NavDropdown.Item href="/Outerwear">Outerwear</NavDropdown.Item>
              <NavDropdown.Item href="/Undergarments">Undergarments</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/MiningEssentials">Mining Essentials</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
}

export default NavbarComponent;