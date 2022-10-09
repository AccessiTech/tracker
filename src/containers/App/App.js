import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.scss";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetLogsArray } from "../../store/Log";

function App() {
  const navigate = useNavigate();
  const logs = useGetLogsArray();

  return (
    <Container>
      <Row>
        <Col>
          <h1>Tracker</h1>
          <h3>Your logs</h3>

          {logs && logs.length ? (
            <ul>
              {logs.map((log) => (
                <li key={log.id}>
                  <Link to={"/edit/" + log.id}>{log.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No logs yet.</p>
          )}
          
          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              navigate("/new");
            }}
          >
            Create a new log...
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
