import React, { FC, ReactElement } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.scss";
import { Button, ButtonGroup, Dropdown, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ADD_LOG_ACTION, removeLog, REMOVE_LOG_ACTION, useGetLogsArray } from "../../store/Log";
import { v4 as uuidv4 } from "uuid";

import { Sidebar} from "../../components/Sidebar";
import { Header } from "../../components/Header";

import store from "../../store/store";
import { addLog } from "../../store/Log";
import {
  ADD_ENTRY,
  CANCEL,
  EMPTY,
  PRIMARY,
  SAVE,
  SECONDARY,
  TEXT,
  TEXT_DANGER,
} from "../../strings";
import { SetToast } from "../../components/Toaster";

export const TRACKER_KEEPER = "Tracker Keeper";
export const YOUR_LOGS = "Your Logs";
export const LOG = "Log";
export const LOG_NAME = "Log Name";
export const LOG_NAME_PLACEHOLDER = "Enter log name";
export const ACTIONS = "Actions";
export const EDIT = "Edit";
export const DELETE = "Delete";
export const NO_LOGS_YET = "No logs yet.";
export const CREATE_NEW_LOG = "Create a new log...";

export const onAddLog = (id: string, name: string) => {
  const log = {
    id,
    name,
    fields: {},
    entries: {},
  };
  store.dispatch(addLog({ log }));
};

export interface HomeProps {
  setToast: SetToast;
}

export const Home: FC<HomeProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();
  const isNewLogModalOpen = window.location.hash === "#/new";
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showModal, setShowModal] = React.useState(isNewLogModalOpen);
  const [newLogId, setNewLogId] = React.useState(EMPTY);
  const [newLogName, setNewLogName] = React.useState(EMPTY);
  const logs = useGetLogsArray();

  if (
    newLogId !== EMPTY &&
    newLogName !== EMPTY &&
    newLogName.trim() !== EMPTY
  ) {
    navigate("/log/" + newLogId + "/edit");
  }

  return (
    <Container>
      <Row className="header__row">
        <Col>
         
            <Header title={TRACKER_KEEPER} toggleSidebar={setShowSidebar} />

        </Col>
      </Row>
      <Row>
        <Col>
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
                            className={TEXT_DANGER}
                            onClick={(e) => {
                              e.preventDefault();
                              store.dispatch(removeLog({ logId: log.id }));
                              setToast({
                                show: true,
                                context: REMOVE_LOG_ACTION,
                                name: log.name,
                              });
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
              navigate("/new");
              setShowModal(true);
            }}
          >
            {CREATE_NEW_LOG}
          </Button>
        </Col>
      </Row>

      <Modal
        id="addLogModal"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewLogName(EMPTY);
          navigate("/");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{CREATE_NEW_LOG}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formLogName">
              <Form.Label>{LOG_NAME}</Form.Label>
              <Form.Control
                type={TEXT}
                placeholder={LOG_NAME_PLACEHOLDER}
                onChange={(e) => setNewLogName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <Button
                  variant={SECONDARY}
                  onClick={() => {
                    setShowModal(false);
                    setNewLogName(EMPTY);
                    navigate("/");
                  }}
                >
                  {CANCEL}
                </Button>
              </Col>
              <Col>
                <Button
                  variant={PRIMARY}
                  disabled={newLogName.trim() === EMPTY}
                  onClick={() => {
                    const newId = uuidv4();
                    onAddLog(newId, newLogName);
                    setNewLogId(newId);
                    setToast({
                      show: true,
                      context: ADD_LOG_ACTION,
                      name: newLogName,
                    });
                  }}
                >
                  {SAVE}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>

      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={setShowSidebar}
      />
    </Container>
  );
};

export default Home;
