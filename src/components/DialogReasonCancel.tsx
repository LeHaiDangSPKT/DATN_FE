import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import React from "react";
interface props {
  isShow: boolean;
  setIsShow: (value: boolean) => void;
  title: string;
  alert: {
    open: boolean;
    message: string;
  };
  content: string;
  setContent: (value: string) => void;
  submit: () => void;
  isChangeStateBill?: boolean;
  contentChangeStateBill?: string;
  currentCustomer?: string;
}

function DialogReasonCancel(props: props) {
  const {
    isShow,
    setIsShow,
    title,
    alert,
    content,
    setContent,
    submit,
    isChangeStateBill,
    contentChangeStateBill,
    currentCustomer,
  } = props;
  return (
    <Dialog open={isShow} handler={setIsShow}>
      <DialogHeader className="text-center">{title}</DialogHeader>
      <DialogBody className="text-center">
        {isChangeStateBill ? (
          <>
            <Typography variant="h5" color="black">
              {contentChangeStateBill}
            </Typography>
            <Typography
              variant="h6"
              color="black"
              className="italic font-light"
            >
              {currentCustomer && `(Đơn của: ${currentCustomer})`}
            </Typography>
          </>
        ) : (
          <>
            {alert.open && (
              <Alert color="red" className="mb-4">
                {alert.message}
              </Alert>
            )}
            <Textarea
              label="Nội dung"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={(e: any) => setIsShow(false)}
          className="mr-1"
        >
          <span>Đóng</span>
        </Button>
        <Button variant="gradient" color="green" onClick={submit}>
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default DialogReasonCancel;
