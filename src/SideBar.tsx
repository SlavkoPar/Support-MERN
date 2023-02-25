import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import logo from './logo.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faSurprise, faUser, faUserFriends, faAnchor, faDatabase } from '@fortawesome/free-solid-svg-icons'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { Modal } from "react-bootstrap";

import { useGlobalContext, useGlobalDispatch } from './global/GlobalProvider'
import { GlobalActionTypes, ROLES } from "./global/types";

interface ISideBarProps {
}

export function SideBar(props: ISideBarProps) {

  const { globalState } = useGlobalContext();
  const { authUser, isAuthenticated, isDarkMode, variant, bg } = globalState;
  const { userName, role } = authUser;

  const dispatch = useGlobalDispatch();

  let navigate = useNavigate();

  const otkaciMe = () => {
    dispatch({ type: GlobalActionTypes.UN_AUTHENTICATE, payload: {} })
    navigate('/');
  }

  useEffect(() => {
    if (isAuthenticated){
       return navigate("/");
    }
 }, [isAuthenticated, navigate]);


  const [show, setShow] = useState(false);

  return (
    <Container fluid>
      {isAuthenticated ? (
        <Navbar expand={"md"} variant={variant} bg={bg} collapseOnSelect className="sticky-top">
          <Navbar.Brand href="#" className="ps-3">Support Knowledge</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="end"
            className={`text-bg-${bg}`}
          >
            {isDarkMode ? (
              <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>Support</Offcanvas.Title>
              </Offcanvas.Header>
            ) : (
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>Support</Offcanvas.Title>
              </Offcanvas.Header>
            )}

            <Offcanvas.Body>
              <Nav
                className="justify-content-end flex-grow-1 pe-3 d-flex flex-nowrap"
              >
                <Nav.Link href="/supporter/promo" onClick={() => {
                  //closeQuestionForm();
                }}>
                  <FontAwesomeIcon icon={faSurprise} color='lightblue' />{' '}Supporter
                </Nav.Link>
                <Nav.Link href="/categories">
                  <FontAwesomeIcon icon={faQuestion} color='lightblue' />{' '}Questions
                </Nav.Link>
                <Nav.Link href="/answers/pera">
                  <FontAwesomeIcon icon={faAnchor} color='lightblue' />{' '}Answers
                </Nav.Link>
                {role === ROLES.OWNER &&
                  <Nav.Link href="/users">
                    <FontAwesomeIcon icon={faUserFriends} color='lightblue' />{' '}Users
                  </Nav.Link>
                }

                <Nav.Link href="/about">
                  About
                </Nav.Link>

                {/* <NavDropdown
                title={<><FontAwesomeIcon icon={faCog} color='lightblue' />{' '}Settings</>}
                id={`offcanvasNavbarDropdown-expand`}
                menuVariant={variant}
              >
              </NavDropdown> */}

                <NavDropdown
                  title={<><FontAwesomeIcon icon={faUser} />{' '}{userName}</>}
                  id={`offcanvasNavbarDropdown-expand`}
                  menuVariant={variant}
                  align="end"
                >
                  <NavDropdown.Item eventKey="DARK_MODE">
                    Dark mode
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey="LIGHT_MODE">
                    Light mode
                  </NavDropdown.Item>
                  {/* <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form> */}

                  <NavDropdown.Divider />
                  {/* <NavDropdown
                    title={<span style={{ padding: "0px 5px", fontSize: '0.9rem' }}><FontAwesomeIcon icon={faDatabase} />{' '}Local Storage</span>}
                    id={`offcanvasNavbarDropdown-expand2`}
                    menuVariant={variant}
                    align="end"
                  >
                    <NavDropdown.Item href="#" eventKey="STORAGE_DISPLAY">
                      Display
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" eventKey="STORAGE_CLEAR">
                      Clear
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" eventKey="STORAGE_EXPORT">
                      Export to zip file
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" eventKey="STORAGE_IMPORT">
                      Import from zip file
                    </NavDropdown.Item>
                  </NavDropdown> */}
                  <NavDropdown.Divider />

                  <NavDropdown.Item href="#/About">
                    About
                  </NavDropdown.Item>

                  <NavDropdown.Item href="#" onClick={otkaciMe}>
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Navbar>
      ) : (
        <Navbar expand={"md"} variant={variant} bg={bg} collapseOnSelect className="sticky-top">
          <Navbar.Brand href="#" className="ps-3">Support Knowledge</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand`}
            aria-labelledby={`offcanvasNavbarLabel-expand`}
            placement="end"
            className={`text-bg-${bg}`}
          >
            {isDarkMode ? (
              <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>Support</Offcanvas.Title>
              </Offcanvas.Header>
            ) : (
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>Support</Offcanvas.Title>
              </Offcanvas.Header>
            )}

            <Offcanvas.Body>
              <Nav
                className="justify-content-end flex-grow-1 pe-3 d-flex flex-nowrap"
                onSelect={eventKey => {

                  switch (eventKey) {
                    case "LIGHT_MODE":
                    case "DARK_MODE":
                      if (document.body.classList.contains('dark')) {
                        document.body.classList.remove('dark')
                        document.body.classList.add('light')
                      }
                      else {
                        document.body.classList.add('dark')
                      }
                      dispatch({ type: eventKey })
                      break;
                  }
                }}
              >

                <Nav.Link href="/about">
                  About
                </Nav.Link>

                {/* <NavDropdown
                title={<><FontAwesomeIcon icon={faCog} color='lightblue' />{' '}Settings</>}
                id={`offcanvasNavbarDropdown-expand`}
                menuVariant={variant}
              >
              </NavDropdown> */}

                <Nav.Link href="/register">
                  Register
                </Nav.Link>
                <Nav.Link href="/sign-in">
                  Sign In
                </Nav.Link>

              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Navbar>
      )
      }
    </Container>
  );
}
