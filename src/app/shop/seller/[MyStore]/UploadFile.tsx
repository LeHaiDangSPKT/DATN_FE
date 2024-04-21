import React from "react";
interface UploadFileProps {
  index: number;
  setProduct: any;
}

function UploadFile(props: UploadFileProps) {
  const { index, setProduct } = props;
  return (
    <div>
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
        >
          <span className="text-[#d9d9d9]">+</span>
        </div>
        <img
          src=""
          id={`img-preview-${index}`}
          alt=""
          className="h-full fit-cover w-full"
          hidden
        />
      </div>
      {/* Ẩn */}
      <input
        id={`upload-img-${index}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setProduct(file as any);
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
          }
        }}
      />
    </div>
  );
}

export default UploadFile;
