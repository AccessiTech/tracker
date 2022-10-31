import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.scss";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { removeLog, useGetLogsArray } from "../../store/Log";
import store from "../../store/store";
import { ADD_ENTRY, PRIMARY } from "../../strings";

export const TRACKER_KEEPER = "Tracker Keeper";
export const YOUR_LOGS = "Your Logs";
export const LOG = "Log";
export const ACTIONS = "Actions";
export const EDIT = "Edit";
export const DELETE = "Delete";
export const NO_LOGS_YET = "No logs yet.";
export const CREATE_NEW_LOG = "Create a new log...";

export const Home: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logs = useGetLogsArray();

  return (
    <Container>
      <Row>
        <Col>
          <h1>{TRACKER_KEEPER}</h1>
          <hr />
          <h2>{YOUR_LOGS}</h2>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>{LOG}</th>
                <th>{ACTIONS}</th>
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
                          variant={PRIMARY}
                          onClick={() => navigate(`/log/${log.id}/entry`)}
                        >
                          {ADD_ENTRY}
                        </Button>
                        <Dropdown.Toggle
                          split
                          variant={PRIMARY}
                          id={`table__dropdown_toggle__${log.id}`}
                          className="table__dropdown_toggle"
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => navigate(`/log/${log.id}/edit`)}
                          >
                            {EDIT}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              store.dispatch(removeLog({ logId: log.id }));
                            }}
                          >
                            {DELETE}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {logs && logs.length === 0 && <p>{NO_LOGS_YET}</p>}

          <Button
            variant={PRIMARY}
            onClick={(e) => {
              e.preventDefault();
              navigate("/log/new");
            }}
          >
            {CREATE_NEW_LOG}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
