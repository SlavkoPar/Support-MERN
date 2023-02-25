import { Types } from 'mongoose';
import { useEffect } from 'react';
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SideBar } from './SideBar'
import { useGlobalContext } from './global/GlobalProvider'

import './App.css';

import { IUser } from './users/types';

import Categories from "./categories/Categories"
import Users from "./users/Users"

import RegisterForm from './global/RegisterForm';
import LoginForm from './global/LoginForm';
import Landing from './Landing';
import About from './About';

function App() {

  const { globalState, loadStateFromLocalStorage } = useGlobalContext();
  const { isAuthenticated } = globalState;

  useEffect(() => {
    loadStateFromLocalStorage();
    console.log('zovem loadStateFromLocalStorage')
  }, [loadStateFromLocalStorage])

  return (

    <Router>
      <Container fluid className="App">
        <header className="App-header">
          <SideBar />
        </header>
        <Row>
          <Col md={12}>
            <div className="wrapper">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/users" element={<Users />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/sign-in" element={<LoginForm />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
