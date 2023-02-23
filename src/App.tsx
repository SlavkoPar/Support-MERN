import { Types } from 'mongoose';
import { useEffect } from 'react';
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { SideBar } from './SideBar'
import { useGlobalState } from './global/GlobalProvider'

import './App.css';

import { IUser } from './users/types';

import Categories from "./categories/Categories"

import RegisterForm from './global/RegisterForm';
import LoginForm from './global/LoginForm';
import Landing from './Landing';

function App() {
  const { isAuthenticated } = useGlobalState();

  useEffect(() => {
  }, [])

  return (
    <Container fluid className="App">

      <Router>
        <Container fluid className="App">
          <header className="App-header">
            <SideBar />
          </header>

          <Container>
            <Row>
              <Col md={12}>
                <div className="wrapper">
                  <Routes>
                    {/* <Landing /> */}
                    <Route path="/" element={<Landing />} />

                    {!isAuthenticated &&
                      <Route path="/register" element={
                        <RegisterForm />
                      }
                      />
                    }
                    {!isAuthenticated &&
                      <Route path="/sign-in" element={
                        <LoginForm />
                      }
                      />
                    }
                    <Route path="/categories" element={<Categories />} />
                    {/* <Route path="/users" element={<Users />} /> */}
                  </Routes>
                </div>
              </Col>
            </Row>
          </Container>

        </Container>
      </Router>
    </Container>
  );
}

export default App;
