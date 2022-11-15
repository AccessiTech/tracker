import React, {FC, ReactElement, useEffect} from "react";
import {  Modal } from "react-bootstrap";
import { Log, useGetLog } from "../../store/Log";
import { logEntriesToCSV } from "../../utils";

export interface PortDataModalProps {
  logID: string;
  onHide: () => void;
  show: boolean;
}

export const LOG_DATA = "Log Data";
export const DOWNLOAD_CSV = "Download CSV";
export const GENERATING_CSV = "Generating CSV...";

export const PortDataModal : FC<PortDataModalProps> = ({ show, logID, onHide }): ReactElement => {
  const [exportCSV, setExportCSV] = React.useState("");
  const log:Log = useGetLog(logID);

  useEffect(() => {
    if (log) {
      const csv = logEntriesToCSV(log);
      setExportCSV(csv);
    } else {
      setExportCSV("");
      onHide();
    }
  }, [log]);

  return (
    <Modal
      id="port-data-modal"
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>{LOG_DATA}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {exportCSV.length > 0 && (
          <a
            href={"data:text/csv;charset=utf-8," + exportCSV}
            download={log.name + ".csv"}
          >
            {DOWNLOAD_CSV}
          </a>
        ) || (
          <p>{GENERATING_CSV}</p>
        )}
      </Modal.Body>

    </Modal>
  );
};

export default PortDataModal;
