import React, { FC, ReactElement } from "react";
import { Button, Col, Form, Modal, Nav, Row, Tab } from "react-bootstrap";
import store from "../../store/store";
import {
  resetSync,
  setGoogleDriveFolderId,
  setGoogleDriveLogSheetId,
  setSyncId,
  useDataSync,
} from "../../store/DataSync";

import { PRIMARY } from "../../strings";
import { listFiles, listFolders } from "../GoogleApi";

import "./DataSync.scss";
import { connectDataSync, initDataSync } from "../../services/DataSync";

export interface DataSyncProps {
  authenticated: boolean;
  onError?: (error: any) => void;
}

export const handleError = (error: any): void => {
  console.error(JSON.parse(error.body));
  store.dispatch(resetSync(""));
};

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
        <DataSyncModal
          showModal={showModal}
          setShowModal={setShowModal}
          onError={onError}
        />
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
  const { googleDrive, syncId } = useDataSync();
  const { folderId, logSheetId } = googleDrive;
  const [selectFolder, setSelectFolder] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(DataSyncTabs.SPLASH);
  const [folders, setFolders] = React.useState([] as DriveFolder[]);
  const [selectedFolder, setSelectedFolder] = React.useState(folderId as string);
  const [mainSheetId, setMainSheetId] = React.useState(logSheetId as string);
  const [showFileSelect, setShowFileSelect] = React.useState(false);
  const [filesToSelect, setFilesToSelect] = React.useState([] as any[]);
  const [sid, setSid] = React.useState(syncId as string);

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
        setActiveTab(DataSyncTabs.ERROR);
      });
  }, []);

  React.useEffect(() => {
    if (syncId !== sid) {
      setSid(syncId);
    }
    if (folderId !== selectedFolder) {
      setSelectedFolder(folderId);
    }
    if (logSheetId !== mainSheetId) {
      setMainSheetId(logSheetId);
    }
  }, [syncId, folderId, logSheetId]);

  const SelectFolder = () => (
    <Form.Select
      id="modal__select_folder"
      className="modal__select_folder"
      defaultValue={selectedFolder}
      onChange={async (e) => {
        setSelectedFolder(e.target.value);
        setShowFileSelect(true);
        if (e.target.parentElement?.classList.contains('existing_sync')) {
          listFiles({
            parents: [e.target.value],
          }).then((files:any[]) => {
            setFilesToSelect(files);
          });
        }
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

  const onInitSuccess = ({ syncId, folderId, logSheetId }: any) => {
    store.dispatch(setGoogleDriveFolderId({ folderId }));
    store.dispatch(setGoogleDriveLogSheetId({ logSheetId }));
    store.dispatch(setSyncId({ syncId }));
    setActiveTab(DataSyncTabs.SELECT_LOGS);
  };

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
                <Col className="new_sync">
                  <h4>{"Start New Data Sync"}</h4>
                  <Button
                    variant={PRIMARY}
                    onClick={() => {
                      setActiveTab(DataSyncTabs.IN_PROGRESS);

                      initDataSync({
                        onError,
                        selectedFolder,
                        selectedLogSheet: mainSheetId,
                      })
                        .then(onInitSuccess)
                        .catch((err: any) => {
                          onError(err);
                          setActiveTab(DataSyncTabs.ERROR);
                        });
                    }}
                  >
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
                <Col className="existing_sync">
                  <h4>{"Connect to Existing Data Sync"}</h4>
                  <SelectFolder />
                  {showFileSelect && (
                    <Form.Select
                      id="modal__select_file"
                      className="modal__select_file"
                      defaultValue={mainSheetId}
                      onChange={(e) => {
                        setMainSheetId(e.target.value);
                      }}
                    >
                      <option>{"Select File"}</option>
                      {filesToSelect.length ? (
                        filesToSelect.map((file) => (
                          <option key={file.id} value={file.id}>
                            {file.name}
                          </option>
                        ))
                      ) : (
                        <option>{"Loading Files..."}</option>
                      )}
                    </Form.Select>
                  )}
                  <Button
                    variant={PRIMARY}
                    onClick={ () => {
                      setActiveTab(DataSyncTabs.IN_PROGRESS);

                      connectDataSync({
                        onError,
                        selectedFolder,
                        selectedLogSheet: mainSheetId,
                      }).then(onInitSuccess)
                        .catch((err: any) => {
                          onError(err);
                          setActiveTab(DataSyncTabs.ERROR);
                        });

                    }}
                  >
                    {"Connect"}
                  </Button>
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
