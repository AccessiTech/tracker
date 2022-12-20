import React, { FC, ReactElement } from "react";
import { Button, Col, Form, Modal, Nav, Row, Tab } from "react-bootstrap";

import { PRIMARY } from "../../strings";

export interface DataSyncProps { }
export enum DataSyncTabs {
  SPLASH = "splash",
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
  ERROR = "error",
  CONFIG = "config",
}

export const DataSync: FC<DataSyncProps> = (): ReactElement => {

  const [showModal, setShowModal] = React.useState(false);
  const [selectFolder, setSelectFolder] = React.useState(false);

  return <>
    <Button onClick={() => setShowModal(true)}>Show Modal</Button>
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Tab.Container defaultActiveKey={DataSyncTabs.SPLASH}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3>{"Configure Data Syncing"}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Content>
            <Tab.Pane eventKey={DataSyncTabs.SPLASH}>
              <p>
                {"Tracker Keeper can sync your data using your Google Drive."}
              </p>
              <Row>
                <Col>
                  <h4>{"Start New Data Sync"}</h4>
                  <Button
                    variant={PRIMARY}
                    onClick={() => {
                    }}
                  >{"Create Files"}</Button>
                  <Form.Check
                    id="modal__select_folder"
                    type="checkbox"
                    label="Select folder for new files"
                    className="modal__select_folder"
                    onChange={(e) => {
                      setSelectFolder(e.target.checked);
                    }}
                    defaultChecked={selectFolder}
                  />
                </Col>
                <Col>
                  <h4>{"Connect to Existing Data Sync"}</h4>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.IN_PROGRESS}>
              <p>{"In Progress"}</p>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.SUCCESS}>
              <p>{"Success"}</p>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.ERROR}>
              <p>{"Error"}</p>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.CONFIG}>
              <p>{"Config"}</p>
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
        <Modal.Footer>
          <Nav variant="pills" className="flex-row">
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.SPLASH}>{"Splash"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.IN_PROGRESS}>{"In Progress"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.SUCCESS}>{"Success"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.ERROR}>{"Error"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.CONFIG}>{"Config"}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Footer>
      </Tab.Container>
    </Modal>
  </>;
};
