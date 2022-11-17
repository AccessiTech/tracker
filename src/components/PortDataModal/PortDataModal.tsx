import { Formik } from "formik";
import React, { FC, ReactElement } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { addLogEntry, Log, LogEntry, useGetLog } from "../../store/Log";
import store from "../../store/store";
import { PRIMARY, SECONDARY } from "../../strings";
import { logEntriesToCSV, logToMetaCSV } from "../../utils";
import { SetToast } from "../Toaster";

export interface PortDataModalProps {
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

export const downloadCVS = (csv: string, filename: string = "log") => {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.click();
};

export const uploadCSV = (csv: string): { [key: string]: any } => {
  const lines = csv.split("\r\n");
  const headers = lines[0].split(",");
  const entries = lines.slice(1).map((line) => {
    const values = line.split(",");
    const entry: any = {};
    headers.forEach((header, index) => {
      entry[header] = (values[index] || "").trim();
    });
    return entry;
  });
  return entries;
};

export const PortDataModal: FC<PortDataModalProps> = ({
  show,
  logID,
  onHide,
  setToast,
}): ReactElement => {
  const [includeID, setIncludeID] = React.useState(true);
  const [includeCreatedAt, setIncludeCreatedAt] = React.useState(true);
  const [includeUpdatedAt, setIncludeUpdatedAt] = React.useState(false);
  const [useIdsAsHeaders, setUseIdsAsHeaders] = React.useState(false);
  const [newEntries, setNewEntries] = React.useState([]);
  const log: Log = useGetLog(logID);

  return (
    <Modal id="port-data-modal" show={show} onHide={onHide}>
      <Tabs fill defaultActiveKey="export" id="port-data-tabs">
        <Tab eventKey="export" title="Export">
          <Modal.Header closeButton>
            <Modal.Title>{EXPORT_DATA}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="includeIDCheckbox">
                <Form.Check
                  type="checkbox"
                  label={INCLUDE_ENTRY_IDS}
                  checked={includeID}
                  onChange={(e) => {
                    setIncludeID(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="includeCreatedAtCheckbox">
                <Form.Check
                  type="checkbox"
                  label={INCLUDE_CREATED_AT}
                  checked={includeCreatedAt}
                  onChange={(e) => {
                    setIncludeCreatedAt(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="includeUpdatedAtCheckbox">
                <Form.Check
                  type="checkbox"
                  label={INCLUDE_UPDATED_AT}
                  checked={includeUpdatedAt}
                  onChange={(e) => {
                    setIncludeUpdatedAt(e.target.checked);
                  }}
                />
              </Form.Group>
              <Form.Group controlId="useIdsAsHeadersCheckbox">
                <Form.Check
                  type="checkbox"
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
        <Tab eventKey="import" title="Import">
          <Modal.Header closeButton>
            <Modal.Title>{IMPORT_DATA}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ file: "" }}
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
                      key !== "ID" &&
                      key !== "createdAt" &&
                      key !== "updatedAt"
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
                  errors.file = "Required";
                  return errors;
                }
                if (values.file && !values.file.length) {
                  errors.file = "CSV is empty";
                } else {
                  const fieldIds = Object.keys(log.fields);
                  const potentialEntries = uploadCSV(values.file);
                  const matchingIds = [];

                  for (const key of Object.keys(potentialEntries[0])) {
                    if (fieldIds.includes(key)) {
                      matchingIds.push(key);
                    }
                  }

                  if (!matchingIds.length) {
                    errors.file = "No matching fields found";
                    return errors;
                  }

                  const entryIds = Object.keys(log.entries);
                  const newEntries = potentialEntries.filter((entry: any) => {
                    return entry.ID && !entryIds.includes(entry.ID);
                  });

                  if (!newEntries.length) {
                    errors.file = "No new entries found";
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
                setFieldValue,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Entries to Log</Form.Label>

                    <Form.Control
                      type="file"
                      name="file"
                      accept=".csv"
                      onChange={(e: any) => {
                        if (newEntries.length) setNewEntries([]);
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
                      <Form.Text className="text-danger">
                        {errors.file}
                      </Form.Text>
                    ) : touched.file && !errors.file ? (
                      <Form.Text className="text-success">
                        CSV is valid and compatible!
                      </Form.Text>
                    ) : (
                      <Form.Text className="text-muted">
                        {"Accepts .csv files"}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button
                    variant={PRIMARY}
                    type="submit"
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

export default PortDataModal;
