import React, { FC, ReactElement, useEffect } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { Log, useGetLog } from "../../store/Log";
import { PRIMARY } from "../../strings";
import { logEntriesToCSV } from "../../utils";

export interface PortDataModalProps {
  logID: string;
  onHide: () => void;
  show: boolean;
}

export const EXPORT_DATA = "Export Data";
export const IMPORT_DATA = "Import Data";
export const DOWNLOAD_CSV = "Download CSV";
export const GENERATING_CSV = "Generating CSV...";
export const INCLUDE_ENTRY_IDS = "Include Entry IDs (Recommended)";
export const INCLUDE_CREATED_AT = "Include Created At";
export const INCLUDE_UPDATED_AT = "Include Updated At";

export const PortDataModal: FC<PortDataModalProps> = ({
  show,
  logID,
  onHide,
}): ReactElement => {
  const [exportCSV, setExportCSV] = React.useState("");
  const [includeID, setIncludeID] = React.useState(true);
  const [includeCreatedAt, setIncludeCreatedAt] = React.useState(true);
  const [includeUpdatedAt, setIncludeUpdatedAt] = React.useState(false);
  const log: Log = useGetLog(logID);

  useEffect(() => {
    if (log) {
      const csv = logEntriesToCSV(log, {
        includeID,
        includeCreatedAt,
        includeUpdatedAt,
      });
      setExportCSV(csv);
    } else {
      setExportCSV("");
      onHide();
    }
  }, [log, includeID, includeCreatedAt, includeUpdatedAt]);

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
              </Form>
            )) || <p>{GENERATING_CSV}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant={PRIMARY}
              onClick={(e) => {
                e.preventDefault();
                const blob = new Blob([exportCSV], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `${log.name}.csv`);
                link.click();
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
