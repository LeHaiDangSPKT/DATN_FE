import React from "react";
interface FrameFormInitProps {
  children: React.ReactNode;
}
function FrameMainContent({ children }: FrameFormInitProps) {
  return (
    <div className="min-h-screen py-1 sm:py-4 px-2 sm:px-10">{children}</div>
  );
}

export default FrameMainContent;
