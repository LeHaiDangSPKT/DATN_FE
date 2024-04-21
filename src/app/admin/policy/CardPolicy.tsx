import React from "react";
import {
  Collapse,
  Button,
  Card,
  Typography,
  CardBody,
  DialogHeader,
  DialogBody,
  Dialog,
  DialogFooter,
  Tooltip,
  Textarea,
  Alert,
} from "@material-tailwind/react";
import { APIRemovePolicy, APIUpdatePolicy } from "@/services/Policy";
import Toast from "@/utils/Toast";

interface CardPolicyProps {
  data: {
    _id: string;
    name: string;
    content: string;
  };
  handleEdit: (policy: any) => void;
  handleDel: (id: string) => void;
}

function CardPolicy(props: CardPolicyProps) {
  const { data, handleEdit, handleDel } = props;
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogDel, setOpenDialogDel] = React.useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);
  const handleOpen = () => setOpenDialog((cur) => !cur);
  const handleOpenDel = () => setOpenDialogDel((cur) => !cur);
  const [content, setContent] = React.useState<string[]>([]);
  const [valueChange, setValueChange] = React.useState<any>();
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
  });
  React.useEffect(() => {
    setContent(data.content.split("\n"));
    setValueChange(data);
  }, [data]);
  const Edit = async () => {
    if (valueChange.content.trim() == "") {
      setAlert({
        open: true,
        message: "Nội dung không được để trống",
      });
      setTimeout(() => {
        setAlert({
          open: false,
          message: "",
        });
      }, 2000);
      return;
    }
    const res = await APIUpdatePolicy(valueChange._id, valueChange.content);
    handleOpen();
    if (res?.status == 200 || res.status == 201) {
      Toast("success", res.data.message, 2000);
      setValueChange({
        ...valueChange,
        content: res.data.metadata.data.content,
      });
      setContent(res?.data.metadata.data.content.split("\n"));
      handleEdit({
        _id: res.data.metadata.data._id,
        name: res.data.metadata.data.name,
        content: res.data.metadata.data.content,
      });
    } else {
      Toast("error", res.data.message, 2000);
    }
  };

  const Del = async () => {
    const res = await APIRemovePolicy(data._id);
    if (res?.status == 200 || res.status == 201) {
      Toast("success", res.data.message, 2000);
      handleOpenDel();
      setOpen(false);
      handleDel(data._id);
    } else {
      Toast("error", res.data.message, 2000);
    }
  };

  return (
    <div className="w-1/3 py-2 pr-3">
      <Tooltip
        placement="top"
        content={data.name}
        className="bg-white text-black"
      >
        <Button className={`w-full truncate ...`} onClick={toggleOpen}>
          {data.name}
        </Button>
      </Tooltip>
      <Collapse open={open}>
        <Card className="my-4">
          <CardBody className="">
            {content.map((item, index) =>
              item ? (
                <Typography key={index}>{item}</Typography>
              ) : (
                <br key={index} />
              )
            )}
            <div className="flex">
              <Button
                color="yellow"
                className="w-2/3 mt-2 mr-2"
                onClick={handleOpen}
              >
                Chỉnh sửa
              </Button>
              <Button
                color="red"
                className="w-2/3 mt-2 ml-2"
                onClick={handleOpenDel}
              >
                Xoá
              </Button>
            </div>
          </CardBody>
        </Card>
      </Collapse>
      <Dialog open={openDialog} handler={handleOpen} size="lg">
        <DialogHeader>{valueChange?.name}</DialogHeader>
        <DialogBody>
          {alert.open && (
            <Alert color="red" className="mb-4">
              {alert.message}
            </Alert>
          )}
          <Textarea
            variant="standard"
            label=""
            className="w-full min-h-[20rem]"
            value={valueChange?.content}
            onChange={(e) => {
              setValueChange({
                ...valueChange,
                content: e.target.value,
              });
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={(e) => {
              setValueChange(data);
              handleOpen();
            }}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button variant="gradient" color="yellow" onClick={(e) => Edit()}>
            <span>Chỉnh sửa</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openDialogDel} handler={handleOpenDel} size="md">
        <DialogHeader>Xoá chính sách</DialogHeader>
        <DialogBody>
          <Typography>
            Bạn có chắc chắn muốn xoá chính sách{" "}
            <span className="font-bold italic">&quot;{data.name}&quot;</span>{" "}
            không?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpenDel}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
          <Button variant="gradient" color="red" onClick={(e) => Del()}>
            <span>Xoá</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default CardPolicy;
