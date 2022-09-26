import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.scss';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col>
          <h1>Tracker</h1>
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              navigate('/new');
            }}
          >Create a new log...</Button>

        </Col>
      </Row>
    </Container>
  );
}

export default App;
