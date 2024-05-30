import React from "react";
interface FrameFormInitProps {
  children: React.ReactNode;
  label: string;
  required?: boolean;
}
function Input({ children, label, required }: FrameFormInitProps) {
  return (
    <div className="w-full mt-4">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-[14px] text-[#59595b]">{label}</div>
            {required && <div className="text-[12px] text-red-500 ml-1">*</div>}
          </div>
        </div>
      </div>
      {/* <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label> */}
      {children}
    </div>
  );
}

export default Input;
