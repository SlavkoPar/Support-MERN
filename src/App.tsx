import { Types } from 'mongoose';
import { useEffect } from 'react';
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import { SideBar } from './SideBar'
import { useGlobalContext } from './global/GlobalProvider'

import './App.css';

import { IUser } from './users/types';

import Categories from "./categories/Categories"
import Users from "./users/Users"

import RegisterForm from './global/RegisterForm';
import LoginForm from './global/LoginForm';
import Landing from './Landing';

function App() {
  
  const { globalState, loadStateFromLocalStorage } = useGlobalContext();
  const { isAuthenticated } = globalState;

  useEffect(() => {
    loadStateFromLocalStorage();
  }, [loadStateFromLocalStorage])

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
                    <Route path="/register" element={
                      // !isAuthenticated ? (
                        <RegisterForm />
                      // ) : (
                      //   <Navigate replace to={"/"} />
                      // )
                    }
                    />
                    <Route path="/sign-in" element={
                      // !isAuthenticated ? (
                        <LoginForm />
                      // ) : (
                      //   <Navigate replace to={"/"} />
                      // )
                    }
                    />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/users" element={<Users />} />
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
