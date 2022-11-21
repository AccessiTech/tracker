import { Formik } from "formik";
import React, { FC, ReactElement } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { addLogEntry, Log, LogEntry, useGetLog } from "../../store/Log";
import store from "../../store/store";
import {
  CHECKBOX,
  CREATED_AT,
  ID,
  PRIMARY,
  SECONDARY,
  SUBMIT,
  TEXT_DANGER,
  TEXT_MUTED,
  TEXT_SUCCESS,
  UPDATED_AT,
} from "../../strings";
import {
  downloadCVS,
  logEntriesToCSV,
  logToMetaCSV,
  parseCSV,
} from "../../utils";
import { SetToast } from "../Toaster";

export interface CsvModalProps {
  logID: string;
  onHide: () => void;
  setToast: SetToast;
  show: boolean;
}

export const EXPORT_DATA = "Export Log to CSV";
export const IMPORT_DATA = "Import Data";
export const DOWNLOAD_CSV = "Download Entries";
export const DOWNLOAD_META = "Download Fields";
export const GENERATING_CSV = "Generating CSV...";
export const INCLUDE_ENTRY_IDS = "Include Entry IDs (Recommended)";
export const INCLUDE_CREATED_AT = "Include Created At";
export const INCLUDE_UPDATED_AT = "Include Updated At";
export const USE_IDS_AS_HEADERS = "Use IDs as Headers";
export const IMPORT = "Import";
export const EXPORT = "Export";
export const CSV_REQUIRED = "CSV is Required";
export const CSV_EMPTY = "CSV is Empty";
export const CSV_VALID = "CSV is valid and compatible!";
export const NO_MATCHING_FIELDS = "No matching fields found";
export const NO_NEW_ENTRIES = "No new entries found";
export const UPLOAD_ENTRIES = "Upload Entries to Log";
export const ACCEPTS_CSV = "Accepts CSV files only";
export const OVERWRITE_EXISTING = "Overwrite existing entries";
export const FORCE_IMPORT = "Force import (ignore errors)";

export const CsvModal: FC<CsvModalProps> = ({
  show,
  logID,
  onHide,
  setToast,
}): ReactElement => {
  const [includeID, setIncludeID] = React.useState(true);
  const [includeCreatedAt, setIncludeCreatedAt] = React.useState(true);
  const [includeUpdatedAt, setIncludeUpdatedAt] = React.useState(false);
  const [useIdsAsHeaders, setUseIdsAsHeaders] = React.useState(false);
  const [newEntries, setNewEntries] = React.useState(
    [] as { [key: string]: any }[]
  );
  const log: Log = useGetLog(logID);

  return (
    <Modal id="port-data-modal" show={show} onHide={onHide}>
      <Tabs fill defaultActiveKey="export" id="port-data-tabs">
        <Tab eventKey="export" title={EXPORT}>
          <Modal.Header closeButton>
            <Modal.Title>{EXPORT_DATA}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="includeIDCheckbox">
                <Form.Check
                  type={CHECKBOX}
                  label={INCLUDE_ENTRY_IDS}
                  checked={includeID}
                  onChange={(e) => {
                    setIncludeID(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="includeCreatedAtCheckbox">
                <Form.Check
                  type={CHECKBOX}
                  label={INCLUDE_CREATED_AT}
                  checked={includeCreatedAt}
                  onChange={(e) => {
                    setIncludeCreatedAt(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="includeUpdatedAtCheckbox">
                <Form.Check
                  type={CHECKBOX}
                  label={INCLUDE_UPDATED_AT}
                  checked={includeUpdatedAt}
                  onChange={(e) => {
                    setIncludeUpdatedAt(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="useIdsAsHeadersCheckbox">
                <Form.Check
                  type={CHECKBOX}
                  label={USE_IDS_AS_HEADERS}
                  checked={useIdsAsHeaders}
                  onChange={(e) => {
                    setUseIdsAsHeaders(e.target.checked);
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={SECONDARY}
              onClick={(e) => {
                e.preventDefault();
                const meta = logToMetaCSV(log);
                downloadCVS(meta, log.name + "-fields");
              }}
            >
              {DOWNLOAD_META}
            </Button>
            <Button
              variant={PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                const csv = logEntriesToCSV(log, {
                  includeID,
                  includeCreatedAt,
                  includeUpdatedAt,
                  useIdsAsHeaders,
                });
                downloadCVS(csv, log.name + "-entries");
              }}
            >
              {DOWNLOAD_CSV}
            </Button>
          </Modal.Footer>
        </Tab>

        <Tab eventKey="import" title={IMPORT}>
          <Modal.Header closeButton>
            <Modal.Title>{IMPORT_DATA}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ file: "", overwrite: false, force: false }}
              onSubmit={() => {
                newEntries.forEach((entry: any) => {
                  const newEntry = {
                    id: entry.ID,
                    createdAt: entry.createdAt,
                    updatedAt: entry.updatedAt,
                    values: {
                      label: entry.label,
                    },
                  } as LogEntry;
                  Object.keys(entry).forEach((key) => {
                    if (
                      key !== ID &&
                      key !== CREATED_AT &&
                      key !== UPDATED_AT
                    ) {
                      newEntry.values[key] = entry[key];
                    }
                  });
                  store.dispatch(
                    addLogEntry({
                      logId: log.id,
                      entry: newEntry,
                    })
                  );
                });
                setToast({
                  context: `Imported ${newEntries.length} entries`,
                  show: true,
                });
                onHide();
              }}
              validate={(values) => {
                const errors: any = {};
                if (!values.file) {
                  errors.file = CSV_REQUIRED;
                  return errors;
                }
                if (values.file && !values.file.length) {
                  errors.file = CSV_EMPTY;
                } else {
                  const fieldIds = Object.keys(log.fields);
                  const potentialEntries = parseCSV(values.file);
                  const matchingIds = [];

                  for (const key of Object.keys(potentialEntries[0])) {
                    if (fieldIds.includes(key)) {
                      matchingIds.push(key);
                    }
                  }

                  if (!values.force && !matchingIds.length) {
                    errors.file = NO_MATCHING_FIELDS;
                    return errors;
                  }

                  const entryIds = Object.keys(log.entries);
                  const newEntries =
                    values.overwrite || values.force
                      ? potentialEntries.filter((entry: any) => {
                          return entry.ID;
                        })
                      : potentialEntries.filter((entry: any) => {
                          return entry.ID && !entryIds.includes(entry.ID);
                        });

                  if (!newEntries.length) {
                    errors.file = NO_NEW_ENTRIES;
                    return errors;
                  } else {
                    setNewEntries(newEntries);
                  }
                }
                return errors;
              }}
            >
              {({
                errors,
                touched,
                values,
                setFieldValue,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile">
                    <Form.Label>{UPLOAD_ENTRIES}</Form.Label>

                    <Form.Control
                      type="file"
                      name="file"
                      accept=".csv"
                      onChange={(e: any) => {
                        setNewEntries([]);
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result;
                            setFieldValue("file", result);
                          };
                          reader.readAsText(file);
                        } else {
                          setFieldValue("file", "");
                        }
                      }}
                      onBlur={handleBlur}
                    />

                    {errors.file && touched.file ? (
                      <Form.Text className={TEXT_DANGER}>
                        {errors.file}
                      </Form.Text>
                    ) : touched.file && !errors.file ? (
                      <Form.Text className={TEXT_SUCCESS}>
                        {CSV_VALID}
                      </Form.Text>
                    ) : (
                      <Form.Text className={TEXT_MUTED}>
                        {ACCEPTS_CSV}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group controlId="overwriteCheckbox">
                    <Form.Check
                      type={CHECKBOX}
                      label={OVERWRITE_EXISTING}
                      name="overwrite"
                      checked={values.overwrite}
                      onChange={() => {
                        setNewEntries([]);
                        if (values.overwrite && values.force) {
                          setFieldValue("force", !values.overwrite);
                        }
                        setFieldValue("overwrite", !values.overwrite);
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="forceCheckbox">
                    <Form.Check
                      type={CHECKBOX}
                      label={FORCE_IMPORT}
                      name="force"
                      checked={values.force}
                      onChange={() => {
                        setNewEntries([]);
                        if (!values.overwrite) {
                          setFieldValue("overwrite", !values.force);
                        }
                        setFieldValue("force", !values.force);
                      }}
                    />
                  </Form.Group>
                  <br />

                  <Button
                    variant={PRIMARY}
                    type={SUBMIT}
                    disabled={Object.keys(errors).length > 0 && touched.file}
                  >
                    {`Import Entries (${newEntries.length})`}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Tab>
      </Tabs>
    </Modal>
  );
};

export default CsvModal;
