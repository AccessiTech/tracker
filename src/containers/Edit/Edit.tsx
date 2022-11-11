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
} from "../../store/Log";
import "./Edit.scss";
import { LogNameForm } from "../../components/LogNameForm";
import { EditFieldsTable } from "../../components/EditFieldsTable/EditFieldsTable";
import { EditFieldForm } from "../../components/EditFieldForm";
import { EditLabelForm } from "../../components/EditLabelForm";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import {
  ADD,
  ADD_ENTRY,
  DANGER,
  DARK,
  HOME,
  MODAL,
  PRIMARY,
  SECONDARY,
  SUBMIT,
  VIEW_LOG,
} from "../../strings";
import { SetToast } from "../../components/Toaster";
import { EditSortForm } from "../../components/EditSortForm";

export const NEW = "new";
export const EDIT = "edit";

export const EDIT_HEADER = "Edit: ";
export const LOG_FIELDS = "Log Fields";
export const NO_FIELDS_YET = "No fields yet.";
export const ADD_NEW_FIELD = "Add a new field...";
export const LOG_SETTINGS = "Log Settings";
export const DELETE_LOG = "Delete Log";
export const FIELD_SETTINGS = "Field Settings";

export const onUpdateLog = (log: Log, values: any): void => {
  const updatedLog: Log = {
    ...log,
    ...values,
  };
  store.dispatch(updateLog({ logId: log.id, log: updatedLog }));
};

export const onDeleteLog = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  log: Log
) => {
  e.preventDefault();
  store.dispatch(removeLog({ logId: log.id }));
};

export const onDeleteField = (log: Log, fieldId: string) => {
  store.dispatch(removeLogField({ logId: log.id, fieldId }));
};

export interface EditProps {
  setToast: SetToast;
}

export const Edit: FC<EditProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();
  const { id, field: fid } = useParams() as { id: string; field: string };

  const log: Log = useGetLog(id as string);

  if (!log || id !== log.id || !log.fields) {
    navigate("/");
  }
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showModal, setShowModal] = React.useState(fid ? true : false);
  const [modalMode, setModalMode] = React.useState(
    fid && fid !== NEW ? EDIT : ADD
  ); // "add" or "edit"
  const [fieldId, setFieldId] = React.useState(fid && fid !== "new" ? fid : "");

  const resetModal = () => {
    setShowModal(false);
    navigate(`/log/${id}/edit`);
    setModalMode(ADD);
    setFieldId("");
  };

  const onEditField = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    field: LogFields
  ) => {
    navigate(`/log/${log.id}/edit/field/${field.id}`);
    setShowModal(true);
    setModalMode(EDIT);
    setFieldId(field.id);
  };

  const onAddField = () => {
    navigate(`/log/${log.id}/edit/field/new`);
    setShowModal(true);
    setModalMode(ADD);
    setFieldId("");
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
                  ) => onDeleteField(log, fieldId)}
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
                style={{ marginBottom: "1rem" }}
              >
                {ADD_NEW_FIELD}
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>{LOG_SETTINGS}</h2>
            </Accordion.Header>
            <Accordion.Body>
              <LogNameForm onSubmit={onUpdateLog} log={log} />
              <br />
              <EditLabelForm log={log} onSubmit={onUpdateLog} />
              <br />
              <EditSortForm log={log} onSubmit={onUpdateLog} />
              <br />
              <Button
                variant={DANGER}
                type={SUBMIT}
                onClick={(e) => {
                  setToast({
                    show: true,
                    context: REMOVE_LOG_ACTION,
                    name: log.name,
                  });
                  onDeleteLog(e, log);
                  navigate("/");
                }}
              >
                {DELETE_LOG}
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="edit__button_row">
          <Col>
            <Button variant={DARK} onClick={() => navigate(`/`)}>
              {HOME}
            </Button>
          </Col>
          <Col>
            <Button
              variant={SECONDARY}
              onClick={() => navigate(`/log/${log.id}`)}
            >
              {VIEW_LOG}
            </Button>
          </Col>
          <Col>
            <Button
              variant={PRIMARY}
              onClick={() => navigate(`/log/${id}/entry`)}
            >
              {ADD_ENTRY}
            </Button>
          </Col>
        </Row>
      </Container>

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

export default Edit;
