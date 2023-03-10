import { useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import { Navigation } from 'Navigation'
import { useGlobalContext } from 'global/GlobalProvider'

import './App.css';

import Categories from "categories/Categories"
import Users from "users/Users"

import RegisterForm from 'global/RegisterForm';
import LoginForm from 'global/LoginForm';
import Landing from 'Landing';
import About from 'About';
import Test from 'Test';

function App() {

  const { loadStateFromLocalStorage } = useGlobalContext();

  useEffect(() => {
    loadStateFromLocalStorage();
  }, [loadStateFromLocalStorage])

  return (
    <Router>
      <Container fluid className="App">
        <header className="App-header">
          <Navigation />
        </header>
        <Row>
          <Col md={12}>
            <div className="wrapper">
              <Routes>
                <Route path="/" element={<About />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/users" element={<Users />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/sign-in" element={<LoginForm />} />
                <Route path="/about" element={<About />} />
                <Route path="/test" element={<Test />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
