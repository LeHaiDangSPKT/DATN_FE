import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Textarea,
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
}

function DialogReasonCancel(props: props) {
  const { isShow, setIsShow, title, alert, content, setContent, submit } =
    props;
  return (
    <Dialog open={isShow} handler={setIsShow}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody className="text-center">
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
