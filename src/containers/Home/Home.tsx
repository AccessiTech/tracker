import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.scss";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { removeLog, useGetLogsArray } from "../../store/Log";
import store from "../../store/store";

export const Home: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logs = useGetLogsArray();

  return (
    <Container>
      <Row>
        <Col>
          <h1>Tracker</h1>
          <h3>Your logs</h3>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Log</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs &&
                logs.length > 0 &&
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <Link to={`/log/${log.id}`}>{log.name}</Link>
                    </td>
                    <td>
                      <Dropdown
                        as={ButtonGroup}
                        id={`table__dropdown_button__${log.id}`}
                        className="table__dropdown_button"
                      >
                        <Button
                          variant="primary"
                          onClick={() => navigate(`/log/${log.id}/entry`)}
                        >
                          Add Entry
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant="primary"
                          id={`table__dropdown_toggle__${log.id}`}
                          className="table__dropdown_toggle"
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => navigate(`/log/${log.id}/edit`)}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              store.dispatch(removeLog({ logId: log.id }));
                            }}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {logs && logs.length === 0 && <p>No logs yet.</p>}

          <Button
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              navigate("/log/new");
            }}
          >
            Create a new log...
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
