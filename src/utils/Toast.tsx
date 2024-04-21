import { ToastPosition, toast } from "react-toastify";

export default function Toast(type: string, msg: string, autoClose: number) {
  const config = {
    position: "top-right" as ToastPosition,
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  switch (type) {
    case "success":
      toast.success(msg, config);
      break;

    case "error":
      toast.error(msg, config);
      break;

    case "warning":
      toast.warn(msg, config);
      break;

    case "info":
      toast.info(msg, config);
      break;

    default:
      toast(msg);
      break;
  }
}
