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
  getLog,
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
  getAddLogEntryURL,
  getEditLogEntryURL,
  getEditLogURL,
  HOME,
  HOME_URL,
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
import { entryFilter, LogEntryFilter } from "../../components/LogEntryFilter";
import { syncLogSheet, SyncLogSheetResponse } from "../../services/DataSync";
import { DataSyncState, getDataSync } from "../../store/DataSync";
import { handleError, updateLocalLog } from "../../components/DataSync";
import { getAuthenticated } from "../../store/Session";

// Display strings
export const ENTRIES_HEADER = "Entries ";
export const NO_ENTRIES = "No entries";
export const SORT_BY = "Sort by";
export const DATE_CREATED = "Date Created";
export const REVERSED = "Reversed";

export interface onDeleteEntryParams {
  log: LogType;
  entryId: string;
  authenticated?: boolean;
  dataSyncState?: DataSyncState;
}

export const onDeleteEntry = async ({
  log, 
  entryId,
  authenticated,
  dataSyncState,
}: onDeleteEntryParams) => {
  await store.dispatch(removeLogEntry({ logId: log.id, entryId }));

  if (authenticated && dataSyncState?.syncSettings) {
    const sync = dataSyncState[dataSyncState.syncMethod];
    if (sync?.logSheets && sync.logSheets[log.id] && dataSyncState.syncSettings.onEditEntry) {
      const state = store.getState();
      const newLog = getLog(state, log.id);
      syncLogSheet({
        log: newLog,
        logSheetId: sync.logSheets[log.id].id,
        onError: handleError,
      }).then((updates: SyncLogSheetResponse) => {
        updateLocalLog({ log: newLog, updates, store });
      }).catch((error) => {
        console.error(`Error syncing onEntryDelete: ${error}`)
      });
    }
  }
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
  const authenticated = getAuthenticated(store.getState());
  const dataSyncState = getDataSync(store.getState());

  // Get log from store
  const { id } = useParams() as { id: string };
  const log: LogType = useGetLog(id);
  const { name, fields, labelOption, sort, order } = log || {};

  // Set and sidebar states
  const [sortBy, setSortBy] = React.useState(sort || CREATED_AT);
  const [sortOrder, setSortOrder] = React.useState(order || SORT_DESC);
  const [filter, setFilter] = React.useState([] as any);
  const [showSidebar, setShowSidebar] = React.useState(false);

  // Define entries
  const entries: LogEntry[] = log
    ? Object.values(log.entries || {}).filter((entry: LogEntry) =>
      entryFilter(entry, filter)
    )
    : [];
  const hasEntries = entries.length > 0;

  // React.useEffect(() => {
  //   // todo: sync log metadata; sync log entries
  // }, []);

  // Navigate to home if log not found
  React.useEffect(() => {
    if (!log) {
      navigate(HOME_URL);
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

          <div className="log__entries_header__actions">
            {/* Sort by dropdown */}
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
                className={`text-${CREATED_AT === sortBy ? PRIMARY : SECONDARY
                  }`}
              >
                {DATE_CREATED}
              </Dropdown.Item>
              {Object.values(fields).map((field) => (
                <Dropdown.Item
                  key={`sort-by-${field.id}`}
                  onClick={() => {
                    setSortBy(field.id);
                  }}
                  className={`text-${field.id === sortBy ? PRIMARY : SECONDARY
                    }`}
                >
                  {field.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => {
                  setSortOrder(sortOrder === SORT_ASC ? SORT_DESC : SORT_ASC);
                }}
                className={`text-${sortOrder === SORT_ASC ? PRIMARY : SECONDARY
                  }`}
              >
                {REVERSED}
              </Dropdown.Item>
            </DropdownButton>

            <LogEntryFilter log={log} setFilter={setFilter} />
          </div>
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
                          const thisValue = (entry.values || {})[fieldId];
                          const thisField = fields[fieldId] || {};
                          switch (thisField.type) {
                            case BOOLEAN:
                              value = thisValue ? thisField.trueLabel : thisField.falseLabel;
                              break;
                            case SELECT:
                              value = Array.isArray(thisValue)
                                ? ((thisValue as []) || []).join(
                                  ", " // todo: make this dynamic
                                )
                                : thisValue;
                              break;
                            case DATE:
                            default:
                              value = thisValue;
                          }

                          return (
                            <div
                              key={id + HYPHEN + entry.id + HYPHEN + fieldId}
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
                            navigate(getEditLogEntryURL(id, entry.id))
                          }
                        >
                          {EDIT_ENTRY}
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            onDeleteEntry({
                              log,
                              entryId: entry.id,
                              authenticated,
                              dataSyncState,
                            });
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
              navigate(HOME_URL);
            }}
          >
            {HOME}
          </Button>
        </Col>
        <Col>
          <Button
            variant={SECONDARY}
            onClick={() => {
              navigate(getEditLogURL(id));
            }}
          >
            {EDIT_LOG}
          </Button>
        </Col>
        <Col>
          <Button
            variant={PRIMARY}
            onClick={() => navigate(getAddLogEntryURL(id))}
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
