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
  CREATED_AT,
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
  SORT_ASC,
  SORT_DESC,
  TEXT,
  WARNING,
} from "../../strings";
import { SetToast } from "../../components/Toaster";

// Display strings
export const ENTRIES_HEADER = "Entries ";
export const NO_ENTRIES = "No entries";
export const SORT_BY = "Sort by";
export const DATE_CREATED = "Date Created";
export const REVERSED = "Reversed";

/**
 * Delete Entry Callback
 * @param {LogType} entry - entry to delete
 * @param {string} logId - id of log to delete entry from
 */
export const onDeleteEntry = (log: LogType, entryId: string) => {
  store.dispatch(removeLogEntry({ logId: log.id, entryId }));
};

/**
 * Log Page
 * @param {LogProps} logProps - props
 */

export interface LogProps {
  setToast: SetToast;
}

export const Log: FC<LogProps> = ({ setToast }): ReactElement => {
  const navigate = useNavigate();

  // Get log from store
  const { id } = useParams() as { id: string };
  const log: LogType = useGetLog(id);
  const { name, fields, labelOption, sort, order } = log || {};

  // Set and sidebar states
  const [sortBy, setSortBy] = React.useState(sort || CREATED_AT);
  const [sortOrder, setSortOrder] = React.useState(order || SORT_DESC);
  const [showSidebar, setShowSidebar] = React.useState(false);

  // Define entries
  const entries: LogEntry[] = log
    ? Object.values(log.entries || {}).filter(
        (entry: LogEntry) => entry && entry.values
      )
    : [];
  const hasEntries = entries.length > 0;

  // Navigate to home if log not found
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
        <Col className="log__entries_header">
          <h4>
            {ENTRIES_HEADER}
            {`(${entries.length})`}
          </h4>
          <DropdownButton
            id="dropdown-basic-button"
            title={SORT_BY}
            variant={SECONDARY}
            className="log__actions"
          >
            <Dropdown.Item
              onClick={() => {
                setSortBy(CREATED_AT);
              }}
              className={`text-${CREATED_AT === sortBy ? PRIMARY : SECONDARY}`}
            >
              {DATE_CREATED}
            </Dropdown.Item>
            {Object.values(fields).map((field) => (
              <Dropdown.Item
                key={`sort-by-${field.id}`}
                onClick={() => {
                  setSortBy(field.id);
                }}
                className={`text-${field.id === sortBy ? PRIMARY : SECONDARY}`}
              >
                {field.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => {
                setSortOrder(sortOrder === SORT_ASC ? SORT_DESC : SORT_ASC);
              }}
              className={`text-${sortOrder === SORT_ASC ? PRIMARY : SECONDARY}`}
            >
              {REVERSED}
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      <Row>
        <Col className="log__entries">
          {hasEntries ? (
            entries
              // todo: extract sort logic to helpers
              .sort((a: LogEntry, b: LogEntry) => {
                const valueA =
                  sortBy === CREATED_AT ? a[sortBy] : a.values[sortBy];
                const valueB =
                  sortBy === CREATED_AT ? b[sortBy] : b.values[sortBy];
                if (sortBy === CREATED_AT) {
                  const createdAtOrder =
                    sortOrder === SORT_ASC
                      ? new Date(valueB as string).getTime() -
                        new Date(valueA as string).getTime()
                      : new Date(valueA as string).getTime() -
                        new Date(valueB as string).getTime();
                  return createdAtOrder;
                }
                if (typeof valueA === "string" && typeof valueB === "string") {
                  const stringOrder =
                    sortOrder === SORT_ASC
                      ? valueA.localeCompare(valueB)
                      : valueB.localeCompare(valueA);
                  return stringOrder;
                }
                if ((valueA as any) < (valueB as any)) {
                  const genericOrder = sortOrder === SORT_ASC ? -1 : 1;
                  return genericOrder;
                } else if ((valueA as any) > (valueB as any)) {
                  const genericOrder = sortOrder === SORT_ASC ? 1 : -1;
                  return genericOrder;
                }
                return 0;
              })
              // todo: extract card to component
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
                                    ", " // todo: make this dynamic
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
      {/* todo: extract to component */}
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
