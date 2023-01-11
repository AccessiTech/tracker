import React, { FC, ReactElement } from "react";
import { Button, Col, Form, Modal, Nav, Row, Tab, Table } from "react-bootstrap";
import store from "../../store/store";
import {
  addGoogleDriveLogSheet,
  resetSync,
  setEnableSync,
  setGoogleDriveFolderId,
  setGoogleDriveLogSheetId,
  setGoogleDriveLogSheets,
  setSyncId,
  useDataSync,
} from "../../store/DataSync";

import { OUTLINE_SECONDARY, PRIMARY } from "../../strings";
import { listFiles, listFolders } from "../GoogleApi";

import "./DataSync.scss";
import { connectDataSync, getLogSheetIds, initDataSync, setLogsToSync } from "../../services/DataSync";
import { addLog,  Log, updateLog, useGetLogsArray } from "../../store/Log";
import { initNewLogSheet, setLogSheetIds, syncLogSheet } from "../../services/DataSync/DataSync";

export interface DataSyncProps {
  authenticated: boolean;
  onError?: (error: any) => void;
}

export const handleError = (error: any): void => {
  store.dispatch(resetSync(""));
  // console.error(error);
  throw new Error(error?.message || error);
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
  const { googleDrive, syncId, syncEnabled } = useDataSync();
  const { folderId, logSheetId } = googleDrive;
  const _activeTab = syncEnabled ? DataSyncTabs.SELECT_LOGS : DataSyncTabs.SPLASH;
  const [selectFolder, setSelectFolder] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(_activeTab);
  const [folders, setFolders] = React.useState([] as DriveFolder[]);
  const [selectedFolder, setSelectedFolder] = React.useState(folderId as string);
  const [mainSheetId, setMainSheetId] = React.useState(logSheetId as string);
  const [showFileSelect, setShowFileSelect] = React.useState(false);
  const [filesToSelect, setFilesToSelect] = React.useState([] as any[]);
  const [sid, setSid] = React.useState(syncId as string);

  const [localLogs] = React.useState(useGetLogsArray());
  const [allLogs, setAllLogs] = React.useState([] as any[]);
  const [remoteLogs, setRemoteLogs] = React.useState([] as any[]);
  const [selectedLogs, setSelectedLogs] = React.useState([] as string[]);

  // On Mount
  React.useEffect(() => {
    if (!syncEnabled) {
      listFolders({})
        .then((files: any[]) => {
          const folders = files.length ? files : [noFolderFound];
          setFolders(folders);
        })
        .catch((err: any) => {
          onError(err);
          setActiveTab(DataSyncTabs.ERROR);
        });
    } else {
      setActiveTab(DataSyncTabs.SELECT_LOGS);
      // todo: get remote logs
      const newRemoteLogs = [] as any[];
      setRemoteLogs(newRemoteLogs);
    }
  }, []);

  // On Sync data Change
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

  // On Sync Setup
  React.useEffect(() => {
    if (mainSheetId) {
      getLogSheetIds({
        onError,
        logSheetId: mainSheetId,
      }).then((sheetIds: {[key:string]: string}) => {
        setRemoteLogs(Object.keys(sheetIds).map((key) => ({
          id: key,
          name: sheetIds[key],
        })));
      });
    }
  }, [mainSheetId]);

  // on local and remote logs change
  React.useEffect(() => {
    const allLogsSet = new Set([...(localLogs.map((l) => l.id)), ...(remoteLogs.map((l) => l.id))]);
    const allLogs = Array.from(allLogsSet).map((id) => 
      localLogs.find((l) => l.id === id) || remoteLogs.find((l) => l.id === id)
    ).filter((l) => l);
    setAllLogs(allLogs);
  }, [localLogs, remoteLogs]);

  const SelectFolder = () => (
    <Form.Select
      id="modal__select_folder"
      className="modal__select_folder"
      defaultValue={selectedFolder}
      onChange={async (e) => {
        if (!e.target.value) {
          setSelectedFolder(e.target.value);
          setShowFileSelect(false);
          return;
        }
        setSelectedFolder(e.target.value);
        setShowFileSelect(true);
        if (e.target.parentElement?.classList.contains('existing_sync')) {
          listFiles({
            parents: [e.target.value],
          }).then((files:any[]) => {
            setFilesToSelect(files);
          }).catch((err:any) => {
            onError(err?.result?.error);
            setActiveTab(DataSyncTabs.ERROR);
          });
        }
      }}
    >
      <option value={""}>{"Select Folder"}</option>
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

  const onInitSuccess = ({ syncId, folderId, logSheetId, sheets }: any) => {
    store.dispatch(setEnableSync(true));
    store.dispatch(setGoogleDriveFolderId({ folderId }));
    store.dispatch(setGoogleDriveLogSheetId({ logSheetId }));
    store.dispatch(setGoogleDriveLogSheets({ logSheets: sheets }));
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

            {/* ***** SPLASH TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.SPLASH}>
              <p>
                {"Tracker Keeper can sync your data using your Google Drive."}
              </p>
              <Row>
                <Col className="new_sync">
                  <h4>{"Start New Data Sync"}</h4>
                  <Button
                    variant={PRIMARY}
                    onClick={async () => {
                      setActiveTab(DataSyncTabs.IN_PROGRESS);

                      await initDataSync({
                        onError,
                        selectedFolder,
                        selectedLogSheet: mainSheetId,
                      })
                        .then(onInitSuccess)
                        .catch((err: any) => {
                          onError(err?.result?.error);
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
                    onClick={async () => {
                      setActiveTab(DataSyncTabs.IN_PROGRESS);

                      await connectDataSync({
                        onError,
                        selectedFolder,
                        selectedLogSheet: mainSheetId,
                      }).then(onInitSuccess)
                        .catch((err: any) => {
                          onError(err);
                          setActiveTab(DataSyncTabs.ERROR);
                        });
                      
                      const logSheetIds:any = await getLogSheetIds({
                        onError,
                        logSheetId: mainSheetId,
                      });
                      setRemoteLogs(Object.keys(logSheetIds).map((key) => ({
                        id: key,
                        name: logSheetIds[key],
                      })));
                    }}
                  >
                    {"Connect"}
                  </Button>
                </Col>
              </Row>
            </Tab.Pane>

            {/* ***** IN PROGRESS TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.IN_PROGRESS}>
              <p>{"In Progress"}</p>
            </Tab.Pane>

            {/* ***** SELECT LOGS TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.SELECT_LOGS}>
              <h4>{"Select Logs to Sync"}</h4>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{"Log Name"}</th>
                    <th>{"Sync"}</th>
                  </tr>
                </thead>
                <tbody>
                  {allLogs.map((log: Log) => (
                    <tr key={log.id}>
                      <td>{log.name}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newSelectedLogs = checked
                              ? [...selectedLogs, log.id]
                              : selectedLogs.filter((id) => id !== log.id);
                            setSelectedLogs(newSelectedLogs);
                          }}
                          defaultChecked={selectedLogs.includes(log.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button
                variant={OUTLINE_SECONDARY}
                onClick={() => {
                  setActiveTab(DataSyncTabs.SPLASH);
                  store.dispatch(resetSync(""));
                }}
              >{"Disconnect"}</Button>
              &nbsp;

              <Button
                variant={PRIMARY}
                onClick={() => {
                  setActiveTab(DataSyncTabs.IN_PROGRESS);
                  setLogsToSync({
                    onError,
                    folderId: selectedFolder,
                    logSheetId: mainSheetId,
                    syncId,
                    logs: selectedLogs,
                  })
                    .then(async () => {
                      // 1. get existing log sheets
                      const existingLogSheetIds = await getLogSheetIds({
                        onError,
                        logSheetId: mainSheetId,
                      });
                      console.log('existingLogSheetIds', existingLogSheetIds)
                      // setRemoteLogs(Object.keys(existingLogSheetIds).map((id:string) => id));

                      // 2. get logs to sync
                      const sheetsToCreate = selectedLogs.filter(
                        (logId) => !existingLogSheetIds[logId]
                      );
                      
                      // 3. create new log sheets for logs when needed
                      let sheetMap:any = {};
                      if (sheetsToCreate.length) {
                        for (const logId of sheetsToCreate) {
                          const thisLog = localLogs.find(
                            (log) => log.id === logId
                          );
                          if (thisLog) {
                            await initNewLogSheet({
                              onError,
                              syncId,
                              log: thisLog,
                              folderId: selectedFolder,
                            }).then((sheetId:{id:string}) => {
                              sheetMap[logId] = sheetId.id;
                              store.dispatch(addGoogleDriveLogSheet({ [logId]: sheetId.id }));
                            });
                          }
                        }

                        // 4. update log sheet ids in main sheet
                        await setLogSheetIds({
                          onError,
                          logSheetId: mainSheetId,
                          logSheetIds: {
                            ...existingLogSheetIds,
                            ...sheetMap,
                          },
                        });
                      }

                      // 5. sync log fields and entries
                      sheetMap = {
                        ...existingLogSheetIds,
                        ...sheetMap,
                      }
                      for (const logId of Object.keys(sheetMap)) {
                        // define local log
                        const thisLog = localLogs.find(
                          (log) => log.id === logId
                        );
                        // sync local log with google sheet
                        const thisNewLog = await syncLogSheet({
                          onError,
                          logSheetId: sheetMap[logId],
                          log: thisLog,
                        });
                        console.log("thisNewLog", thisNewLog)
                        if (!thisLog) {
                          store.dispatch(addLog({ log: thisNewLog }));
                        } else {
                          store.dispatch(updateLog({ logId: thisNewLog.id, log: thisNewLog }));
                        }
                      }
                    })
                    .then(() => {
                      setActiveTab(DataSyncTabs.CONFIG);
                    })
                    .catch((err: any) => {
                      throw onError(err);
                    });
                }}
              >{"Connect Logs to Data Sync"}</Button>

            </Tab.Pane>

            {/* ***** SUCCESS TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.SUCCESS}>
              <p>{"Success"}</p>
            </Tab.Pane>

            {/* ***** ERROR TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.ERROR}>
              <p>{"Error"}</p>
            </Tab.Pane>

            {/* ***** CONFIG TAB ***** */}
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
