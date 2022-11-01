import React, { FC, ReactElement } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { EMPTY, SUCCESS } from "../../strings";
import { toasts, ToastTypes } from "./helpers";
import "./toaster.scss";

export interface ToasterSetters {
  setShowToast: (show: boolean) => void;
  setToastContext: (context: string) => void;
}

export interface ToasterProps extends ToasterSetters {
  context: string;
  status?: ToastTypes;
  logName: string;
  showToast: boolean;
}

export const Toaster: FC<ToasterProps> = ({
  context,
  logName,
  showToast,
  status,
  setShowToast,
  setToastContext,
}): ReactElement => {
  const toast = toasts[context] || {};
  const toastStatus = status || toast.status || SUCCESS;
  const toastBody = toast.content || context;
  return (
    <ToastContainer>
      <Toast
        bg={toastStatus}
        show={showToast}
        onClose={() => {
          setShowToast(false);
          setToastContext(EMPTY);
        }}
        autohide
        delay={3000}
      >
        <Toast.Header>
          <strong className="mr-auto">{logName}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{toastBody}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
