import React, { FC, ReactElement } from "react";
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import store from "../../store/store";
import {
  useGetLog,
  removeLogEntry,
  Log as LogType,
  LogEntry,
} from "../../store/Log";
import "./log.scss";

export const onDeleteEntry = (log: LogType, entryId: string) => {
  store.dispatch(removeLogEntry({ logId: log.id, entryId }));
};

export const Log: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const log: LogType = useGetLog(id);
  const { name, fields, labelOption } = log;
  const entries: LogEntry[] = Object.values(log.entries || {});
  const hasEntries = entries.length > 0;
  const isLabelDate = labelOption === "date";
  const isLabelText = labelOption === "text";
  return (
    <Container className="log__container">
      <Row>
        <Col>
          <h1>{name}</h1>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="log__entries">
          <h4>{`Entries (${entries.length})`}</h4>
          {hasEntries ? (
            entries
              .filter((entry: LogEntry) => entry && entry.values)
              .map((entry: LogEntry) => {
                const labelText = isLabelDate
                  ? new Date(entry.createdAt as string).toLocaleString()
                  : isLabelText
                  ? entry.values.label
                  : entry.values[labelOption as string];

                return (
                  <Card key={id + "-" + entry.id} className="log__entry">
                    <Card.Body>
                      <Card.Title>{labelText}</Card.Title>

                      {Object.keys(entry.values)
                        .filter((fieldId: string) => fields[fieldId])
                        .map((fieldId: string) => {
                          let value;
                          switch (fields[fieldId].type) {
                            case "date":
                              value = new Date(entry.values[fieldId] as string).toLocaleString();
                              break;
                            case "boolean":
                              value = entry.values[fieldId] || "false";
                              break;
                            default:
                              value = entry.values[fieldId];
                          }

                            return (
                            <div
                              key={entry.id + "-" + fieldId}
                              className="log__entry__field"
                            >
                              <strong>{fields[fieldId].name}</strong>:{` ${value}`}
                            </div>
                          );
                        })}
                      <DropdownButton
                        id={`dropdown-basic-button-${id}-${entry.id}`}
                        title="Actions"
                        variant="secondary"
                        className="log__entry__actions"
                      >
                        <Dropdown.Item
                          onClick={() =>
                            navigate(`/log/${id}/entry/${entry.id}`)
                          }
                        >
                          Edit Entry
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => onDeleteEntry(log, entry.id)}
                        >
                          Delete Entry
                        </Dropdown.Item>
                      </DropdownButton>
                    </Card.Body>
                  </Card>
                );
              })
          ) : (
            <p>No entries</p>
          )}
        </Col>
      </Row>
      <hr />
      <Row className="form__log__button_row">
        <Col>
          <Button
            variant="dark"
            onClick={() => {
              navigate(`/`);
            }}
          >
            Back
          </Button>
        </Col>
        <Col>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/log/${id}/edit`);
            }}
          >
            Edit Log
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
  );
};

export default Log;
