import React, { FC, ReactElement, useEffect } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { Log, useGetLog } from "../../store/Log";
import { PRIMARY, SECONDARY } from "../../strings";
import { logEntriesToCSV, logToMetaCSV } from "../../utils";

export interface PortDataModalProps {
  logID: string;
  onHide: () => void;
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


export const PortDataModal: FC<PortDataModalProps> = ({
  show,
  logID,
  onHide,
}): ReactElement => {
  const [exportCSV, setExportCSV] = React.useState("");
  const [exportMetaCSV, setExportMetaCSV] = React.useState("");
  const [includeID, setIncludeID] = React.useState(true);
  const [includeCreatedAt, setIncludeCreatedAt] = React.useState(true);
  const [includeUpdatedAt, setIncludeUpdatedAt] = React.useState(false);
  const [useIdsAsHeaders, setUseIdsAsHeaders] = React.useState(false);
  const log: Log = useGetLog(logID);

  useEffect(() => {
    if (log) {
      const csv = logEntriesToCSV(log, {
        includeID,
        includeCreatedAt,
        includeUpdatedAt,
        useIdsAsHeaders,
      });
      const meta = logToMetaCSV(log);
      setExportCSV(csv);
      setExportMetaCSV(meta);
    } else {
      onHide();
    }
  }, [log, includeID, includeCreatedAt, includeUpdatedAt, useIdsAsHeaders]);

  return (
    <Modal id="port-data-modal" show={show} onHide={onHide}>
      <Tabs fill defaultActiveKey="export" id="port-data-tabs">
        <Tab eventKey="export" title="Export">
          <Modal.Header closeButton>
            <Modal.Title>{EXPORT_DATA}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(exportCSV.length > 0 && (
              <Form>
                <Form.Group controlId="includeIDCheckbox">
                  <Form.Check
                    type="checkbox"
                    label={INCLUDE_ENTRY_IDS}
                    checked={includeID}
                    onChange={(e) => {
                      setExportCSV("");
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
                      setExportCSV("");
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
                      setExportCSV("");
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
                      setExportCSV("");
                      setUseIdsAsHeaders(e.target.checked);
                    }}
                  />
                </Form.Group>
              </Form>
            )) || <p>{GENERATING_CSV}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={SECONDARY}
              onClick={(e) => {
                e.preventDefault();
                downloadCVS(exportMetaCSV, log.name + "-fields");
              }}
            >{DOWNLOAD_META}</Button>
            <Button
              variant={PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                downloadCVS(exportCSV, log.name + "-entries");
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
            <p>Coming soon!</p>
          </Modal.Body>
        </Tab>
      </Tabs>
    </Modal>
  );
};

export default PortDataModal;
