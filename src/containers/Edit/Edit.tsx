import React, { FC, ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Button, Col, Modal, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import store from "../../store/store";
import {
  useGetLog,
  updateLog,
  removeLog,
  removeLogField,
  Log,
  LogFields,
  REMOVE_LOG_ACTION,
  getLog,
} from "../../store/Log";
import { DataSyncState, useDataSync } from "../../store/DataSync";

import { syncLogSheet } from "../../services/DataSync";
import { SyncLogSheetResponse } from "../../services/DataSync";

import { LogNameForm } from "../../components/LogNameForm";
import { EditFieldsTable } from "../../components/EditFieldsTable";
import { EditFieldForm } from "../../components/EditFieldForm";
import { EditLabelForm } from "../../components/EditLabelForm";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";

import { SetToast } from "../../components/Toaster";
import { EditSortForm } from "../../components/EditSortForm";
import { handleError, updateLocalLog } from "../../components/DataSync";
// import { EditRecurrenceForm } from "../../components/EditRecurrenceForm";

import "./Edit.scss";

import {
  ADD,
  ADD_ENTRY,
  DANGER,
  DARK,
  EDIT,
  EMPTY,
  getAddLogEntryURL,
  getAddLogFieldURL,
  getEditLogFieldURL,
  getEditLogURL,
  getLogUrl,
  HOME,
  HOME_URL,
  MODAL,
  NEW,
  PRIMARY,
  SECONDARY,
  SUBMIT,
  VIEW_LOG,
} from "../../strings";
import { useAuthenticated } from "../../store/Session";

export const EDIT_HEADER = "Edit: ";
export const LOG_FIELDS = "Log Fields";
export const NO_FIELDS_YET = "No fields yet.";
export const ADD_NEW_FIELD = "Add a new field...";
export const LOG_SETTINGS = "Log Settings";
export const DELETE_LOG = "Delete Log";
export const FIELD_SETTINGS = "Field Settings";

export interface OnUpdateLogParams {
  log: Log;
  values: any;
  authenticated?: boolean;
  dataSyncState?: DataSyncState;
}

/**
 * Edit log callback
 * @param {Log} log - log to edit
 * @param {any} values - values to update
 * @param {boolean} authenticated - optional authenticated state
 * @param {DataSyncState} dataSyncState - optional data sync state
 */
export const onUpdateLog = async ({
  log,
  values,
  authenticated,
  dataSyncState,
}: OnUpdateLogParams): Promise<void> => {
  const updatedLog: Log = {
    ...log,
    ...values,
  };
  await store.dispatch(updateLog({ logId: log.id, log: updatedLog }));
  if (authenticated && dataSyncState?.syncEnabled) {
    const { syncSettings } = dataSyncState;
    if (syncSettings?.onEditLog) {
      const sync = dataSyncState[dataSyncState.syncMethod];
      if (sync?.logSheets && sync?.logSheets[log.id]) {
        const newLog = getLog(store.getState(), log.id)
        // todo: only sync log metadata on update log
        syncLogSheet({
          log: newLog,
          logSheetId: sync.logSheets[log.id].id,
          onError: handleError,
        })
          .then((updates: SyncLogSheetResponse) =>
            updateLocalLog({ log, updates, store })
          )
          .catch((error) => {
            console.error("Error syncing onUpdateLog: ", error);
          });
      }
    }
  }
};

/**
 * Delete log callback

 * @param {Log} log - log to delete
 */
export const onDeleteLog = (log: Log) => {
  // todo: remove log from data sync state
  store.dispatch(removeLog({ logId: log.id }));
};

export interface onDeleteFieldParams {
  log: Log;
  fieldId: string;
  authenticated?: boolean;
  dataSyncState?: DataSyncState;
}
export const onDeleteField = async ({
  log,
  fieldId,
  authenticated,
  dataSyncState,
}:onDeleteFieldParams) => {
  await store.dispatch(removeLogField({ logId: log.id, fieldId }));
  if (authenticated && dataSyncState?.syncEnabled) {
    const { syncSettings } = dataSyncState;
    if (syncSettings?.onEditLog) {
      const sync = dataSyncState[dataSyncState.syncMethod];
      if (sync?.logSheets && sync?.logSheets[log.id]) {
        const newLog = getLog(store.getState(), log.id)
        syncLogSheet({
          log: newLog,
          logSheetId: sync.logSheets[log.id].id,
          onError: handleError,
        }).then((updates: SyncLogSheetResponse) => {
          updateLocalLog({ log, updates, store });
        }).catch((error) => {
          console.error("Error syncing onDeleteField: ", error);
        });
      }
    }
  }
};

/**
 * Edit log page
 * @param {EditProps} editProps - props
 * @returns {ReactElement} - edit page
 */

export interface EditProps {
  setToast: SetToast;
}

export const Edit: FC<EditProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();
  const authenticated = useAuthenticated();
  const dataSyncState = useDataSync();

  // Get Log and Field ids from URL
  const { id, field: fid } = useParams() as { id: string; field: string };

  // Get log from store
  const log: Log = useGetLog(id as string);

  // If log is not found, redirect to home
  if (!log || id !== log.id || !log.fields) {
    navigate(HOME_URL);
  }

  // React.useEffect(() => {
  //   // todo: sync log metadata; sync log fields
  // }, []);

  // Modal and Sidebar states
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showModal, setShowModal] = React.useState(fid ? true : false);
  const [modalMode, setModalMode] = React.useState(
    fid && fid !== NEW ? EDIT : ADD
  ); // "add" or "edit"

  // Current field state
  const [fieldId, setFieldId] = React.useState(
    fid && fid !== NEW ? fid : EMPTY
  );

  // Reset modal to initial state
  const resetModal = () => {
    setShowModal(false);
    navigate(getEditLogURL(id));
    setModalMode(ADD);
    setFieldId(EMPTY);
  };

  const onEditField = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    field: LogFields
  ) => {
    navigate(getEditLogFieldURL(id, field.id));
    setShowModal(true);
    setModalMode(EDIT);
    setFieldId(field.id);
  };

  const onAddField = () => {
    navigate(getAddLogFieldURL(id));
    setShowModal(true);
    setModalMode(ADD);
    setFieldId(EMPTY);
    // todo: sync log fields
  };

  const fields: LogFields[] = Object.values(log.fields);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Header
              title={EDIT_HEADER + log.name}
              toggleSidebar={setShowSidebar}
            />
          </Col>
        </Row>

        <Accordion
          alwaysOpen
          flush
          className="accordion__log_settings"
          defaultActiveKey={["0"]}
        >
          {/* LOG FIELDS TABLE */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h2>{LOG_FIELDS}</h2>
            </Accordion.Header>
            <Accordion.Body>
              {fields && fields.length ? (
                <EditFieldsTable
                  fields={fields}
                  onDeleteClick={(
                    e: React.MouseEvent<HTMLElement, MouseEvent>,
                    fieldId: string
                  ) => onDeleteField({ log, fieldId, authenticated, dataSyncState })}
                  onEditClick={onEditField}
                  setToast={setToast}
                />
              ) : (
                <p>{NO_FIELDS_YET}</p>
              )}
              <Button
                variant={PRIMARY}
                onClick={onAddField}
                data-toggle={MODAL}
                data-target="#addFieldModal"
                style={{ marginBottom: "1rem" }} // todo: move to scss
              >
                {ADD_NEW_FIELD}
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          {/* LOG SETTINGS */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>{LOG_SETTINGS}</h2>
            </Accordion.Header>
            <Accordion.Body>
              <LogNameForm onSubmit={onUpdateLog} log={log} />
              <EditSortForm log={log} onSubmit={onUpdateLog} />
              {/* todo: Introduce Entry Settings subsection when there are multiple settings
              <hr className="edit__settings_hr" />
              <h3>Entry Settings</h3>
              <hr /> */}
              <br />
              <EditLabelForm log={log} onSubmit={onUpdateLog} />
              {/* todo: Implement recurrence and reminders when there is a backend
              <br />
              <EditRecurrenceForm log={log} onSubmit={onUpdateLog} /> */}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <h2>Danger Zone</h2>
            </Accordion.Header>
            <Accordion.Body>
              <Button
                variant={DANGER}
                type={SUBMIT}
                onClick={(e) => {
                  e.preventDefault();
                  setToast({
                    show: true,
                    context: REMOVE_LOG_ACTION,
                    name: log.name,
                  });
                  onDeleteLog(log);
                  navigate(HOME_URL);
                }}
              >
                {DELETE_LOG}
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="form__button_row">
          <Col>
            <Button variant={DARK} onClick={() => navigate(EMPTY)}>
              {HOME}
            </Button>
          </Col>
          <Col>
            <Button
              variant={SECONDARY}
              onClick={() => navigate(getLogUrl(log.id))}
            >
              {VIEW_LOG}
            </Button>
          </Col>
          <Col>
            <Button
              variant={PRIMARY}
              onClick={() => navigate(getAddLogEntryURL(log.id))}
            >
              {ADD_ENTRY}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Add Field Modal */}
      <Modal id="addFieldModal" show={showModal} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>{FIELD_SETTINGS}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditFieldForm
            fieldId={fieldId}
            log={log}
            modalMode={modalMode}
            resetModal={resetModal}
            setToast={setToast}
          />
        </Modal.Body>
      </Modal>

      <Sidebar showSidebar={showSidebar} toggleSidebar={setShowSidebar} />
    </>
  );
};
