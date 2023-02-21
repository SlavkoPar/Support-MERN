import { Types } from 'mongoose';
import { useEffect } from 'react';
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import { SideBar } from './SideBar'

import './App.css';

import { IUser } from './users/types';

import Categories from "./categories/Categories"
//import Users from "./users/Users"

const configHost: string | undefined = process.env.REACT_APP_HOST;
const configPort: string | undefined = process.env.REACT_APP_PORT;
export const hostPort = `${configHost!}:${configPort!}`

const createUser = (user: IUser) => {
  axios
    .post(`${hostPort}/users/create-user`, user)
    .then(({ status, data }) => {
      if (status === 200) {
        console.log('User successfully created')
      }
      else {
        console.log('Status is not 200', status)
      }
    })
    .catch((error) => {
      console.log(error);
    });
}


function App() {

  useEffect(() => {
    // createUser( {
    //     userName: 'Slavko',
    //     role: 'OWNER',
    //     isExpanded: false,
    //     created: {
    //       date: new Date(),
    //       by: {
    //         userId: new Types.ObjectId()
    //       }
    //     }
    //   }
    // )
    // stavi posle kreiranja  created.by.userId = _id
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
                    <Route path="/" element={<Categories />} />
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
