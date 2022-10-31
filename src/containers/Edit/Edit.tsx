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
} from "../../store/Log";
import "./Edit.scss";
import { LogNameForm } from "../../components/LogNameForm";
import { EditFieldsTable } from "../../components/EditFieldsTable/EditFieldsTable";
import { EditFieldForm } from "../../components/EditFieldForm";
import { EditLabelForm } from "../../components/EditLabelForm";

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

export const Edit: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { id, field: fid } = useParams() as { id: string; field: string };

  const log: Log = useGetLog(id as string);

  if (!log || id !== log.id || !log.fields) {
    navigate("/");
  }

  const [showModal, setShowModal] = React.useState(fid ? true : false);
  const [modalMode, setModalMode] = React.useState(
    fid && fid !== "new" ? "edit" : "add"
  ); // "add" or "edit"
  const [fieldId, setFieldId] = React.useState(fid && fid !== "new" ? fid : "");

  const resetModal = () => {
    setShowModal(false);
    navigate(`/log/${id}/edit`);
    setModalMode("add");
    setFieldId("");
  };

  const onEditField = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    field: LogFields
  ) => {
    navigate(`/log/${log.id}/edit/field/${field.id}`);
    setShowModal(true);
    setModalMode("edit");
    setFieldId(field.id);
  };

  const onAddField = () => {
    navigate(`/log/${log.id}/edit/field/new`);
    setShowModal(true);
    setModalMode("add");
    setFieldId("");
  };

  const fields: LogFields[] = Object.values(log.fields);

  return (
    <>
      <Container>
        <h1>{`Edit: ${log.name}`}</h1>

        <Accordion
          alwaysOpen
          flush
          className="accordion__log_settings"
          defaultActiveKey={["0"]}
        >
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h2>Log Fields</h2>
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
                />
              ) : (
                <p>No fields yet.</p>
              )}
              <Button
                variant="primary"
                onClick={onAddField}
                data-toggle="modal"
                data-target="#addFieldModal"
                style={{ marginBottom: "1rem" }}
              >
                Add a new field...
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h2>Log Settings</h2>
            </Accordion.Header>
            <Accordion.Body>
              <LogNameForm onSubmit={onUpdateLog} log={log} />
              <br />
              <EditLabelForm log={log} onSubmit={onUpdateLog} />
              <br />
              <Button
                variant="danger"
                type="submit"
                onClick={(e) => (onDeleteLog(e, log), navigate("/"))}
              >
                Delete Log
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Row className="edit__button_row">
          <Col>
            <Button variant="dark" onClick={() => navigate(`/`)}>
              Home
            </Button>
          </Col>
          <Col>
            <Button
              variant="secondary"
              onClick={() => navigate(`/log/${log.id}`)}
            >
              View Log
            </Button>
          </Col>
          <Col>
            <Button
              variant="primary"
              onClick={() => navigate(`/log/${id}/entry`)}
            >
              Add Entry
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal id="addFieldModal" show={showModal} onHide={resetModal}>
        <Modal.Header closeButton>
          <Modal.Title>Field Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditFieldForm
            fieldId={fieldId}
            log={log}
            modalMode={modalMode}
            resetModal={resetModal}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Edit;
