import React from "react";
interface FrameFormInitProps {
  children: React.ReactNode;
}
function FrameMainContent({ children }: FrameFormInitProps) {
  return <div className="min-h-screen py-4 px-10">{children}</div>;
}

export default FrameMainContent;
