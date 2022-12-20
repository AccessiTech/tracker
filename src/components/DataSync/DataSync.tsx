import React, { FC, ReactElement } from "react";
import { Button, Col, Form, Modal, Nav, Row, Tab } from "react-bootstrap";
import store from "../../store/store";
import { setGoogleDriveFolderId, setGoogleDriveLogSheetId, useDataSync } from "../../store/DataSync";

import { PRIMARY } from "../../strings";
import { createFolder, createSpreadsheet, listFiles, listFolders } from "../GoogleApi";

import "./DataSync.scss";

export interface DataSyncProps {
  authenticated: boolean;
  onError?: (error: any) => void;
}

export const handleError = (error: any): void => {
  console.error(JSON.parse(error.body));
}

export const DataSync: FC<DataSyncProps> = ({
  authenticated,
  onError = handleError,
}): ReactElement => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} disabled={!authenticated}>
        {"Sync Data..."}
      </Button>
      {showModal && (
        <DataSyncModal showModal={showModal} setShowModal={setShowModal} onError={onError} />
      )}
    </>
  );
};

export enum DataSyncTabs {
  SPLASH = "splash",
  IN_PROGRESS = "in_progress",
  SELECT_LOGS = "select_logs",
  SUCCESS = "success",
  ERROR = "error",
  CONFIG = "config",
}

export interface DriveFolder {
  id: string;
  name: string;
}

export const noFolderFound: DriveFolder = {
  id: "404",
  name: "No Folders Found!",
};

export interface DataSyncModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onError: (error: any) => void;
}

export const DataSyncModal: FC<DataSyncModalProps> = ({
  showModal,
  setShowModal,
  onError,
}): ReactElement => {
  const { googleDrive } = useDataSync();
  const { folderId, logSheetId } = googleDrive;
  const [selectFolder, setSelectFolder] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(DataSyncTabs.SPLASH);
  const [folders, setFolders] = React.useState([] as DriveFolder[]);
  const [selectedFolder, setSelectedFolder] = React.useState(folderId as string);
  const [, setMainSheetId] = React.useState(logSheetId as string);

  React.useEffect(() => {
    listFolders({})
      .then((result: any) => {
        if (!result.body) {
          throw new Error("Error listing folders");
        }
        const folders = JSON.parse(result.body).files;
        setFolders(folders.length ? folders : [noFolderFound]);
      })
      .catch((err: any) => {
        onError(err);
        setShowModal(false);
      });
  }, []);

  const SelectFolder = () => (
    <Form.Select
      id="modal__select_folder"
      className="modal__select_folder"
      defaultValue={selectedFolder}
      onChange={(e) => {
        console.log(e.target.value);
        setSelectedFolder(e.target.value);
      }}
    >
      <option>{"Select Folder"}</option>
      {folders.length ? (
        folders.map((folder) => {
          return (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          );
        })
      ) : (
        <option>{"Loading Folders..."}</option>
      )}
    </Form.Select>
  );

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      id="modal__data_sync"
    >
      <Tab.Container
        activeKey={activeTab}
        defaultActiveKey={DataSyncTabs.SPLASH}
      >
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
                  <Button variant={PRIMARY} onClick={async () => {
                    console.log("Create Files");
                    setActiveTab(DataSyncTabs.IN_PROGRESS);

                    const newFolderId = selectFolder ? selectedFolder :
                      await createFolder({
                        name: "Tracker Keeper Data"
                      }).then((result: any) => {
                        if (!result.body) {
                          throw new Error("Error creating folder");
                        }
                        return JSON.parse(result.body).id;
                      })
                        .catch((err: any) => {
                          console.log("Error creating folder: ");
                          onError(err);
                        });
                    setSelectFolder(newFolderId);
                    store.dispatch(setGoogleDriveFolderId({ folderId: newFolderId }));

                    const spreadsheetId = await createSpreadsheet({
                        name: "Tracker Keeper Data",
                        parents: [newFolderId],
                      }).then((result: any) => {
                        if (!result.body) {
                          throw new Error("Error creating spreadsheet");
                        }
                        return JSON.parse(result.body).id;
                      })
                      .catch((err: any) => {
                        console.log("Error creating primary spreadsheet: ");
                        onError(err);
                      });
                    setMainSheetId(spreadsheetId);
                    store.dispatch(setGoogleDriveLogSheetId({ logSheetId: spreadsheetId }));

                  }}>
                    {"Create Files"}
                  </Button>
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
                  {selectFolder && <SelectFolder />}
                </Col>
                <Col className="modal__vertical_divider">
                  <div className="modal__vertical_divider_line" />
                  <span>{"Or"}</span>
                  <div className="modal__vertical_divider_line" />
                </Col>
                <Col>
                  <h4>{"Connect to Existing Data Sync"}</h4>
                  <SelectFolder />
                  <Button variant={PRIMARY} onClick={async () => {
                    console.log("Connect to Existing Data Sync");
                    setActiveTab(DataSyncTabs.IN_PROGRESS);
                    const files = await listFiles({
                        parents: [selectedFolder],
                      }).then((result: any) => {
                        if (!result.body) {
                          throw new Error("Error listing files");
                        }
                        const files = JSON.parse(result.body).files;
                        console.log(files);
                        return files;
                      })
                      .catch((err: any) => {
                        console.log("Error listing files: ");
                        onError(err);
                      });

                    // todo: loop through files to find main spreadsheet
                    console.log(files);
                  }}>{"Connect"}</Button>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.IN_PROGRESS}>
              <p>{"In Progress"}</p>
            </Tab.Pane>
            <Tab.Pane eventKey={DataSyncTabs.SELECT_LOGS}>
              <p>{"Select Logs"}</p>
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
              <Nav.Link eventKey={DataSyncTabs.SPLASH}>
                {"Get Started"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={DataSyncTabs.CONFIG}>{"Complete"}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Footer>
      </Tab.Container>
    </Modal>
  );
};
