import * as XLSX from "xlsx";
import Toast from "./Toast";
import { APIExport } from "@/services/ExportExcel";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function exportExcel(path: string) {
  const run = async () => {
    Toast("success", "File sẽ được tải về sau 2 giây nữa...", 2000);
    const res = await APIExport(path);
    setTimeout(async () => {
      if (res?.status == 200 || res?.status == 201) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          res.headers["content-disposition"].split("filename=")[1]
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        Toast("error", "Tải file thất bại", 2000);
      }
    }, 2000);
  };
  run();
}

export { getBase64, exportExcel };
