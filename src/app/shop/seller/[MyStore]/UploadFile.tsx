import React from "react";
import { CheckValidImage } from "@/services/Picpurify";
import Toast from "@/utils/Toast";
import { Spinner } from "@nextui-org/react";
import { addIndex } from "@/redux/features/UploadFiles/upload-file-slices";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
interface UploadFileProps {
  index: number;
  setProduct: any;
  dataOrigin?: string;
}

function UploadFile(props: UploadFileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [scanning, setScanning] = React.useState(false);
  const { index, setProduct, dataOrigin } = props;
  return (
    <div className="relative">
      <div
        className="w-[200px] h-[250px] border border-[#d9d9d9] flex justify-center items-center cursor-pointer"
        onClick={(e) => {
          const input = document.getElementById(`upload-img-${index}`);
          if (input) {
            input.click();
          }
        }}
      >
        <div
          className="text-[50px] text-[#d9d9d9]"
          id={`symbol-upload-${index}`}
          hidden={dataOrigin ? true : false}
        >
          <span className="text-[#d9d9d9]">+</span>
        </div>
        <img
          src={dataOrigin || ""}
          id={`img-preview-${index}`}
          alt=""
          className="h-full fit-cover w-full"
          hidden={dataOrigin ? false : true}
        />
      </div>
      {scanning && (
        <div className="absolute top-0 w-[200px] h-[250px] border border-[#d9d9d9] flex justify-center items-center bg-white opacity-50">
          <Spinner />
        </div>
      )}
      {/* Ẩn */}
      <input
        id={`upload-img-${index}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const CheckImgValid = async (fileParam: any) => {
            let body = new FormData();
            body.append("files", fileParam);
            setScanning(true);
            dispatch(addIndex(index));
            const res = await CheckValidImage(body);
            setScanning(false);
            dispatch(addIndex(index));
            if (res.status != 200 && res.status != 201) {
              Toast("error", res.data.message, 3000);
              const img = document.getElementById(`img-preview-${index}`);
              const symbol = document.getElementById(`symbol-upload-${index}`);
              if (img) {
                img.setAttribute("src", Math.random().toString());
                img.hidden = true;
              }
              if (symbol) {
                symbol.hidden = false;
              }
              return;
            }
          };
          if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
              const img = document.getElementById(`img-preview-${index}`);
              const symbol = document.getElementById(`symbol-upload-${index}`);
              if (img) {
                img.setAttribute("src", reader.result as string);
                img.hidden = false;
              }
              if (symbol) {
                symbol.hidden = true;
              }
            };
            reader.readAsDataURL(file);
            CheckImgValid(file);
            setProduct(file as any);
          }
        }}
      />
    </div>
  );
}

export default UploadFile;
