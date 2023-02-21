import { useContext, useState } from "react";


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

import { useGlobalStore, useGlobalStoreDispatch } from './GlobalStoreProvider'
import { ROLES } from "./globalTypes";

interface ISideBarProps {
}

export function SideBar(props: ISideBarProps) {
  // const {
  //   signOut,
  // } = props;

  const { authUser, isAuthenticated, isDarkMode: darkMode, variant, bg } = useGlobalStore();
  const { userName, roleId } = authUser;

  const dispatch = useGlobalStoreDispatch();

  let navigate = useNavigate();

  const otkaciMe = () => {
    // signOut();
    navigate('/landing');
  }

  const [show, setShow] = useState(false);

  return (
    <Navbar expand={"md"} variant={variant} bg={bg} collapseOnSelect className="sticky-top">
      <Container fluid>
        <Navbar.Brand href="#" className="ps-3">Support Knowledge</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand`}
          aria-labelledby={`offcanvasNavbarLabel-expand`}
          placement="end"
          className={`text-bg-${bg}`}
        >
          {darkMode ? (
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
              {isAuthenticated &&
                <Nav.Link href="#/supporter/promo" onClick={() => {
                  //closeQuestionForm();
                }}>
                  <FontAwesomeIcon icon={faSurprise} color='lightblue' />{' '}Supporter
                </Nav.Link>
              }
              {isAuthenticated &&
                <Nav.Link href="#/questions">
                  <FontAwesomeIcon icon={faQuestion} color='lightblue' />{' '}Questions
                </Nav.Link>
              }
              {isAuthenticated &&
                <Nav.Link href="#/answers/pera">
                  <FontAwesomeIcon icon={faAnchor} color='lightblue' />{' '}Answers
                </Nav.Link>
              }
              {isAuthenticated && roleId === ROLES.OWNER &&
                <Nav.Link href="#/users/2">
                  <FontAwesomeIcon icon={faUserFriends} color='lightblue' />{' '}Users
                </Nav.Link>
              }

              {!isAuthenticated &&
                <Nav.Link href="#/landing">
                  Landing
                </Nav.Link>
              }
              {!isAuthenticated &&
                <Nav.Link href="#/About">
                  About
                </Nav.Link>
              }

              {/* <NavDropdown
                title={<><FontAwesomeIcon icon={faCog} color='lightblue' />{' '}Settings</>}
                id={`offcanvasNavbarDropdown-expand`}
                menuVariant={variant}
              >
              </NavDropdown> */}

              {!isAuthenticated &&
                <Nav.Link href="#/Register">
                  Register
                </Nav.Link>
              }
              {!isAuthenticated &&
                <Nav.Link href="#/sign-in ">
                  Sign In
                </Nav.Link>
              }

              {isAuthenticated &&
                // <Nav.Link href="#" disabled>
                //   <FontAwesomeIcon icon={faUser} />{' '}{auth!.who.userName}
                // </Nav.Link>

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
              }
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
