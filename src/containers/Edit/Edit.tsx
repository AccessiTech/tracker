import React, { FC, ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

export const onUpdateLog = (log: Log) => {
  const updatedLog:Log = {
    ...log,
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

export const onDeleteField = (
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  log: Log,
  fieldId: string
) => {
  e.preventDefault();
  store.dispatch(removeLogField({ logId: log.id, fieldId }));
};

export const Edit: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { id, field: fid } = useParams() as {id: string, field: string};
  
  const log:Log = useGetLog(id as string);

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
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    field: LogFields
  ) => {
    e.preventDefault();
    navigate(`/log/${log.id}/edit/field/${field.id}`);
    setShowModal(true);
    setModalMode("edit");
    setFieldId(field.id);
  };

  const onAddField = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    navigate(`/log/${log.id}/edit/field/new`);
    setShowModal(true);
    setModalMode("add");
    setFieldId("");
  };

  const fields: LogFields[] = Object.values(log.fields);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Edit Log</h1>
            <hr />
            <LogNameForm
              onSubmit={() =>
                onUpdateLog(log)
              }
              logName={log.name}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <h2>Fields</h2>
            {fields && fields.length ? (
              <EditFieldsTable
                fields={fields}
                onDeleteClick={(
                  e: React.MouseEvent<HTMLElement, MouseEvent>,
                  fieldId: string
                ) => onDeleteField(e, log, fieldId)}
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
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Button
              variant="danger"
              type="submit"
              onClick={(e) => (onDeleteLog(e, log), navigate("/"))}
            >
              Delete Log
            </Button>
            &nbsp;
            <Button
              variant="secondary"
              type="submit"
              onClick={(e) => (e.preventDefault(), navigate("/"))}
            >
              Back
            </Button>
          </Col>
        </Row>
        <hr />
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
