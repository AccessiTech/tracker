import React, { FC, ReactElement } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { EMPTY, SUCCESS } from "../../strings";
import { ToastType, toasts } from "./helpers";
import "./toaster.scss";

export type SetToast = React.Dispatch<React.SetStateAction<ToastType>>;

export interface ToasterProps extends ToastType {
  toast: ToastType;
  setToast: SetToast;
}

export const Toaster: FC<ToasterProps> = ({
  toast,
  setToast,
}): ReactElement => {
  const { show, context, name, status, content } = toast;
  const hasContext =
    typeof context !== "undefined" && typeof toasts[context] !== "undefined";
  const toastStatus: string =
    (hasContext && toasts[context].status) || status || SUCCESS;
  const toastBody = hasContext ? toasts[context].content : content || context;

  return !toastBody ? (<></>) : (
    <ToastContainer>
      <Toast
        bg={toastStatus}
        show={show}
        onClose={() => {
          setToast({ show: false, context: EMPTY, name: EMPTY });
        }}
        autohide
        delay={3000}
      >
        <Toast.Header>
          <strong className="mr-auto">{name}</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body>{toastBody}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
