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

import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";

import store from "../../store/store";
import {
  useGetLog,
  removeLogEntry,
  Log as LogType,
  LogEntry,
  REMOVE_LOG_ENTRY_ACTION,
} from "../../store/Log";
import "./log.scss";
import {
  ACTIONS,
  ADD_ENTRY,
  BOOLEAN,
  DARK,
  DATE,
  DELETE_ENTRY,
  EDIT_ENTRY,
  EDIT_LOG,
  FALSE,
  HOME,
  HYPHEN,
  LOG_NOT_FOUND,
  OOPS,
  PRIMARY,
  SECONDARY,
  SELECT,
  TEXT,
  WARNING,
} from "../../strings";
import { SetToast } from "../../components/Toaster";

export const ENTRIES_HEADER = "Entries ";
export const NO_ENTRIES = "No entries";

export const onDeleteEntry = (log: LogType, entryId: string) => {
  store.dispatch(removeLogEntry({ logId: log.id, entryId }));
};

export interface LogProps {
  setToast: SetToast;
}

export const Log: FC<LogProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const [showSidebar, setShowSidebar] = React.useState(false);
  const log: LogType = useGetLog(id);
  const { name, fields, labelOption } = log || {};
  const entries: LogEntry[] = log ? Object.values(log.entries || {}) : [];
  const hasEntries = entries.length > 0;

  React.useEffect(() => {
    if (!log) {
      navigate("/");
      setToast({
        show: true,
        name: OOPS,
        context: LOG_NOT_FOUND,
        status: WARNING,
      });
    }
  }, [log, navigate]);

  const isLabelDate = labelOption === DATE;
  const isLabelText = labelOption === TEXT;
  return (
    <Container className="log__container">
      <Row>
        <Col>
          <Header title={name} toggleSidebar={setShowSidebar} />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="log__entries">
          <h4>
            {ENTRIES_HEADER}
            {`(${entries.length})`}
          </h4>
          {hasEntries ? (
            entries
              .filter((entry: LogEntry) => entry && entry.values)
              .sort((a: LogEntry, b: LogEntry) => {
                // Sort by date created
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((entry: LogEntry) => {
                const labelText = isLabelDate
                  ? new Date(entry.createdAt as string).toLocaleString()
                  : isLabelText
                  ? entry.values.label
                  : entry.values[labelOption as string];

                return (
                  <Card key={id + HYPHEN + entry.id} className="log__entry">
                    <Card.Body>
                      <Card.Title>{labelText}</Card.Title>

                      {Object.keys(entry.values)
                        .filter((fieldId: string) => fields[fieldId])
                        .map((fieldId: string) => {
                          let value;
                          switch (fields[fieldId].type) {
                            case DATE:
                              value = new Date(
                                entry.values[fieldId] as string
                              ).toLocaleString();
                              break;
                            case BOOLEAN:
                              value = entry.values[fieldId] || FALSE;
                              break;
                            case SELECT:
                              value = Array.isArray(entry.values[fieldId])
                                ? ((entry.values[fieldId] as []) || []).join(
                                    ", "
                                  )
                                : entry.values[fieldId];
                              break;
                            default:
                              value = entry.values[fieldId];
                          }

                          return (
                            <div
                              key={entry.id + HYPHEN + fieldId}
                              className="log__entry__field"
                            >
                              <strong>{fields[fieldId].name}</strong>:
                              {` ${value}`}
                            </div>
                          );
                        })}
                      <DropdownButton
                        id={`dropdown-basic-button-${id}-${entry.id}`}
                        title={ACTIONS}
                        variant={SECONDARY}
                        className="log__entry__actions"
                      >
                        <Dropdown.Item
                          onClick={() =>
                            navigate(`/log/${id}/entry/${entry.id}`)
                          }
                        >
                          {EDIT_ENTRY}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            onDeleteEntry(log, entry.id);
                            setToast({
                              show: true,
                              context: REMOVE_LOG_ENTRY_ACTION,
                              name: log.name,
                            });
                          }}
                        >
                          {DELETE_ENTRY}
                        </Dropdown.Item>
                      </DropdownButton>
                    </Card.Body>
                  </Card>
                );
              })
          ) : (
            <p>{NO_ENTRIES}</p>
          )}
        </Col>
      </Row>
      <hr />
      <Row className="form__button_row">
        <Col>
          <Button
            variant={DARK}
            onClick={() => {
              navigate(`/`);
            }}
          >
            {HOME}
          </Button>
        </Col>
        <Col>
          <Button
            variant={SECONDARY}
            onClick={() => {
              navigate(`/log/${id}/edit`);
            }}
          >
            {EDIT_LOG}
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

      <Sidebar showSidebar={showSidebar} toggleSidebar={setShowSidebar} />
    </Container>
  );
};

export default Log;
