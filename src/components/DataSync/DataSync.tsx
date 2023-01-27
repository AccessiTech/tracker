import React, { FC, ReactElement } from "react";
import { Button, Col, Form, Modal, Nav, Row, Tab, Table } from "react-bootstrap";
import store from "../../store/store";
import {
  addGoogleDriveLogSheet,
  defaultSyncSettings,
  editSyncSettings,
  LogSheet,
  resetSync,
  resetSyncSettings,
  setEnableSync,
  setGoogleDriveFolderId,
  setGoogleDriveLogSheetId,
  setSyncId,
  // SyncFrequency,
  SyncSettings,
  useDataSync,
} from "../../store/DataSync";

import { OUTLINE_SECONDARY, PRIMARY, RESET, SUBMIT } from "../../strings";
import { listFiles, listFolders } from "../GoogleApi";

import "./DataSync.scss";
import { connectDataSync, getLogSheetIds, initDataSync, setLogsToSync } from "../../services/DataSync";
import { addLog, addLogEntry, addLogField, Log, updateLog, updateLogEntry, updateLogField, useGetLogsArray } from "../../store/Log";
import { initNewLogSheet, setLogSheetIds, syncLogSheet, SyncLogSheetResponse } from "../../services/DataSync/DataSync";

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
  const { googleDrive, syncId, syncEnabled, syncSettings } = useDataSync();
  const { folderId, logSheetId, logSheets } = googleDrive;
  const _activeTab = syncEnabled
    ? Object.keys(logSheets).length ? DataSyncTabs.CONFIG : DataSyncTabs.SELECT_LOGS
    : DataSyncTabs.SPLASH;
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
  const [selectedLogs, setSelectedLogs] = React.useState(logSheets ? Object.keys(logSheets) : [] as string[]);

  const [syncOnLogIn, setSyncOnLogIn] = React.useState(syncSettings?.onLogin || false);
  const [syncOnLogOut, setSyncOnLogOut] = React.useState(syncSettings?.onLogout || false);
  // const [syncOnLogView, setSyncOnLogView] = React.useState(syncSettings?.onLogView || false);
  // const [syncOnLogEditView, setSyncOnLogEditView] = React.useState(syncSettings?.onLogEditView || false);
  const [syncOnAddNewLog, setSyncOnAddNewLog] = React.useState(syncSettings?.onAddNewLog || false);
  const [syncOnEditLog, setSyncOnEditLog] = React.useState(syncSettings?.onEditLog || false);
  const [syncOnAddEntry, setSyncOnAddEntry] = React.useState(syncSettings?.onAddEntry || false);
  const [syncOnEditEntry, setSyncOnEditEntry] = React.useState(syncSettings?.onEditEntry || false);
  const [syncOnAddField, setSyncOnAddField] = React.useState(syncSettings?.onAddField || false);
  const [syncOnEditField, setSyncOnEditField] = React.useState(syncSettings?.onEditField || false);
  // const [syncFrequency, setSyncFrequency] = React.useState(syncSettings?.syncFrequency || false);
  // const [customSyncFrequency, setCustomSyncFrequency] = React.useState(syncSettings?.customSyncFrequency || 1);

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
      }).then((sheetIds: { [logId: string]: LogSheet }) => {
        setRemoteLogs(Object.keys(sheetIds).map((logId) => ({
          // id: sheetIds[logId]?.id,
          id: logId,
          name: sheetIds[logId]?.name || "Untitled Log",
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
          }).then((files: any[]) => {
            setFilesToSelect(files);
          }).catch((err: any) => {
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

  const onInitSuccess = ({ syncId, folderId, logSheetId }: any) => {
    store.dispatch(setEnableSync(true));
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

                      const logSheetIds: any = await getLogSheetIds({
                        onError,
                        logSheetId: mainSheetId,
                      });
                      setRemoteLogs(Object.keys(logSheetIds).map((logId) => ({
                        id: logId,
                        name: logSheetIds[logId]?.name || "Unknown Log",
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
                onClick={async () => {
                  setActiveTab(DataSyncTabs.IN_PROGRESS);
                  await setLogsToSync({
                    onError,
                    folderId: selectedFolder,
                    logSheetId: mainSheetId,
                    syncId,
                    logs: selectedLogs,
                  }).catch((err: any) => {
                    setActiveTab(DataSyncTabs.ERROR);
                    throw onError(err);
                  });

                  // 1. get existing log sheets
                  const existingLogSheetIds = await getLogSheetIds({
                    onError,
                    logSheetId: mainSheetId,
                  });

                  // 2. get logs to sync
                  const sheetsToCreate = [];
                  for (const logId of selectedLogs) {
                    if (existingLogSheetIds[logId]) {
                      store.dispatch(addGoogleDriveLogSheet({
                        [logId]: {
                          id: existingLogSheetIds[logId].id,
                          name: existingLogSheetIds[logId].name,
                        }
                      }));
                    } else {
                      sheetsToCreate.push(logId);
                    }
                  }

                  // 3. create new log sheets for logs when needed
                  let sheetMap: any = {};
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
                        }).then((sheetId: any) => {
                          if (!sheetMap[logId]) {
                            sheetMap[logId] = {};
                          }
                          sheetMap[logId].id = sheetId.id;
                          sheetMap[logId].name = thisLog.name || "Unknown Log";
                          store.dispatch(addGoogleDriveLogSheet({ [logId]: sheetMap[logId] }));
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

                  // 4. sync log fields and entries
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
                    const updates = await syncLogSheet({
                      onError,
                      logSheetId: sheetMap[logId].id,
                      log: thisLog,
                    });

                    // 5. update local log
                    updateLocalLog({
                      log: thisLog,
                      updates,
                      store,
                    });
                  }
                  setActiveTab(DataSyncTabs.CONFIG);
                }}
              >{"Connect Logs to Data Sync"}</Button>

            </Tab.Pane>

            {/* ***** SUCCESS TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.SUCCESS}>
              <h4>{"Success!"}</h4>
              <p>{"Your logs have been synced with Google Sheets, and sync settings can be configured here in the future."}</p>
            </Tab.Pane>

            {/* ***** ERROR TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.ERROR}>
              <p>{"Error"}</p>
            </Tab.Pane>

            {/* ***** CONFIG TAB ***** */}
            <Tab.Pane eventKey={DataSyncTabs.CONFIG}>
              <h4>{"Sync Settings"}</h4>
              <p>{"Configure how often you want to sync your data."}</p>
              {/* todo: move form into sub component */}
              <Form><Row><Col>
                {/* Form group for sync event settings: on log in, before sign out, on log view, on log edit view */}
                <Form.Group>
                  <Form.Label>{"Sync automatically on:"}</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Log In"
                    checked={syncOnLogIn}
                    onChange={(e: any) => {
                      setSyncOnLogIn(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Log Out"
                    checked={syncOnLogOut}
                    onChange={(e: any) => {
                      setSyncOnLogOut(e.target.checked);
                    }}
                  />
                  {/* <Form.Check
                    type="checkbox"
                    label="Log View"
                    checked={syncOnLogView}
                    onChange={(e: any) => {
                      setSyncOnLogView(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Log Edit View"
                    checked={syncOnLogEditView}
                    onChange={(e: any) => {
                      setSyncOnLogEditView(e.target.checked);
                    }}
                  /> */}
                </Form.Group>
                </Col><Col>
                {/* Form Group for user initiated sync events: on add new log, on edit log, on add entry, on edit entry, on add field, on edit field */}
                <Form.Group>
                  <Form.Label>{"Sync on user interactions:"}</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Edit Log"
                    checked={syncOnEditLog}
                    onChange={(e: any) => {
                      setSyncOnEditLog(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Add Entry"
                    checked={syncOnAddEntry}
                    onChange={(e: any) => {
                      setSyncOnAddEntry(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Edit Entry"
                    checked={syncOnEditEntry}
                    onChange={(e: any) => {
                      setSyncOnEditEntry(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Add Field"
                    checked={syncOnAddField}
                    onChange={(e: any) => {
                      setSyncOnAddField(e.target.checked);
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Edit Field"
                    checked={syncOnEditField}
                    onChange={(e: any) => {
                      setSyncOnEditField(e.target.checked);
                    }}
                  />
                </Form.Group>
                </Col><Col>
                {/* Form Group for sync frequency: hourly, every x hours, daily, weekly, custom */}
                {/* <Form.Group>
                  <Form.Label>{"Sync Frequency:"}</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Hourly"
                    checked={syncFrequency === SyncFrequency.HOURLY}
                    onChange={() => {
                      setSyncFrequency(SyncFrequency.HOURLY);
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Every 6 Hours"
                    checked={syncFrequency === SyncFrequency.EVERY_6_HOURS}
                    onChange={() => {
                      setSyncFrequency(SyncFrequency.EVERY_6_HOURS);
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Daily"
                    checked={syncFrequency === SyncFrequency.DAILY}
                    onChange={() => {
                      setSyncFrequency(SyncFrequency.DAILY);
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Weekly"
                    checked={syncFrequency === SyncFrequency.WEEKLY}
                    onChange={() => {
                      setSyncFrequency(SyncFrequency.WEEKLY);
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Custom"
                    checked={syncFrequency === SyncFrequency.CUSTOM}
                    onChange={() => {
                      setSyncFrequency(SyncFrequency.CUSTOM);
                    }}
                  />
                  {syncFrequency === SyncFrequency.CUSTOM && (
                    <Form.Control
                      type="number"
                      placeholder="Enter number of hours"
                      value={customSyncFrequency}
                      onChange={(e: any) => {
                        setCustomSyncFrequency(e.target.value);
                      }}
                    />
                  )}
                </Form.Group> */}
                </Col></Row>
                
                <Button
                  variant={OUTLINE_SECONDARY}
                  type={RESET}
                  onClick={() => {
                    const {
                      onLogin,
                      onLogout,
                      onAddEntry,
                      onAddField,
                      onAddNewLog,
                      onEditEntry,
                      onEditField,
                      onEditLog,
                      // onLogEditView,
                      // onLogView,
                      // syncFrequency,
                      // customSyncFrequency,
                    } = defaultSyncSettings;
                    setSyncOnLogIn(onLogin);
                    setSyncOnLogOut(onLogout);
                    // setSyncOnLogView(onLogView);
                    // setSyncOnLogEditView(onLogEditView);
                    setSyncOnAddNewLog(onAddNewLog);
                    setSyncOnEditLog(onEditLog);
                    setSyncOnAddEntry(onAddEntry);
                    setSyncOnEditEntry(onEditEntry);
                    setSyncOnAddField(onAddField);
                    setSyncOnEditField(onEditField);
                    // setSyncFrequency(syncFrequency);
                    // setCustomSyncFrequency(customSyncFrequency);
                    store.dispatch(resetSyncSettings(""))
                  }}
                >{"Reset to Default"}</Button>
                &nbsp;
                <Button
                  variant={PRIMARY}
                  type={SUBMIT}
                  onClick={(e: any) => {
                    e.preventDefault();
                    const syncSettings: SyncSettings = {
                      onLogin: syncOnLogIn,
                      onLogout: syncOnLogOut,
                      // onLogView: syncOnLogView,
                      // onLogEditView: syncOnLogEditView,
                      onAddNewLog: syncOnAddNewLog,
                      onEditLog: syncOnEditLog,
                      onAddEntry: syncOnAddEntry,
                      onEditEntry: syncOnEditEntry,
                      onAddField: syncOnAddField,
                      onEditField: syncOnEditField,
                      // syncFrequency,
                      // customSyncFrequency,
                    };
                    store.dispatch(editSyncSettings(syncSettings));
                    setActiveTab(DataSyncTabs.SUCCESS)
                  }}
                >{"Save"}</Button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
        <Modal.Footer>
          <Nav variant="pills" className="flex-row">
            <Nav.Item>
              <Nav.Link
                eventKey={DataSyncTabs.SPLASH}
                disabled={activeTab === DataSyncTabs.IN_PROGRESS}
                onClick={() => {
                  setActiveTab(DataSyncTabs.SPLASH)
                }}>
                {"Get Started"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={DataSyncTabs.SELECT_LOGS}
                disabled={!syncEnabled || activeTab === DataSyncTabs.IN_PROGRESS}
                onClick={() => {
                  setActiveTab(DataSyncTabs.SELECT_LOGS)
                }}
              >{"Select Logs"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey={DataSyncTabs.CONFIG}
                disabled={!syncEnabled || activeTab === DataSyncTabs.IN_PROGRESS}
                onClick={() => {
                  setActiveTab(DataSyncTabs.CONFIG)
                }}
              >{"Configure"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey={DataSyncTabs.SUCCESS}
                disabled={activeTab !== DataSyncTabs.SUCCESS}
                onClick={() => {
                  setShowModal(false);
                }}
              >{"Complete"}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Footer>
      </Tab.Container>
    </Modal>
  );
};

export interface UpdateLocalLogParams {
  log?: Log;
  updates: SyncLogSheetResponse;
  store: any;
}

export const updateLocalLog = ({
  log,
  updates,
  store,
}: UpdateLocalLogParams):void => {
  const {
    metadata,
    entries: updatedEntries,
    fields: updatedFields
  } = updates;

  const newLog = {
    ...metadata,
    fields: {},
    entries: {},
  } as Log;
  for (const updatedEntry of updatedEntries) {
    if (log &&
      JSON.stringify(log.entries[updatedEntry.id]?.values) !== JSON.stringify(updatedEntry.values)
    ) {
      store.dispatch(updateLogEntry({ logId: log.id, entryId: updatedEntry.id, entry: updatedEntry }));
    } else if (log) {
      store.dispatch(addLogEntry({ logId: log.id, entry: updatedEntry }));
    } else {
      newLog.entries[updatedEntry.id] = updatedEntry;
    }
  }
  for (const updatedField of updatedFields) {
    if (log &&
      JSON.stringify(log.fields[updatedField.id]) !== JSON.stringify(updatedField)
    ) {
      store.dispatch(updateLogField({ logId: log.id, fieldId: updatedField.id, field: updatedField }));
    } else if (log) {
      store.dispatch(addLogField({
        logId: log.id, field: updatedField
      }));
    } else {
      newLog.fields[updatedField.id] = updatedField;
    }
  }
  if (!log) {
    store.dispatch(addLog({ log: newLog }));
  } else {
    store.dispatch(updateLog({ logId: log.id, log: metadata }));
  }
}