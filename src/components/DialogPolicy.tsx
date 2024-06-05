import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { APIGetAllPolicy } from "@/services/Policy";
function DialogPolicy(props: {
  type: string;
  openDialogPolicy: boolean;
  setOpenDialogPolicy: () => void;
}) {
  const { type, openDialogPolicy, setOpenDialogPolicy } = props;
  const [open, setOpen] = React.useState(0);
  const handleOpen = () => setOpenDialogPolicy();
  const [listData, setListData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await APIGetAllPolicy(type);
      setListData(res);
    };
    fetchData();
  }, []);
  return (
    <>
      <Dialog open={openDialogPolicy} handler={handleOpen}>
        <DialogBody className="h-[30rem] overflow-y-scroll">
          {listData.map((item: any, index) => (
            <Accordion key={index} open={open === index}>
              <AccordionHeader onClick={() => setOpen(index)}>
                {item.name}
              </AccordionHeader>
              <AccordionBody>{item.content}</AccordionBody>
            </Accordion>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DialogPolicy;
