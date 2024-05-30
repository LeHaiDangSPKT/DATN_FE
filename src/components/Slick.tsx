import React from "react";
import Slider from "react-slick";
interface FrameFormInitProps {
  children: React.ReactNode;
  config: any;
  buttonRight?: boolean;
  buttonLeft?: boolean;
}
function Slick({
  children,
  config,
  buttonLeft,
  buttonRight,
}: FrameFormInitProps) {
  function SampleNextArrow(props: any) {
    const { className, style, onClick, buttonRight, buttonLeft } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: buttonRight ? "block" : "none",
          right: 0,
          zIndex: 1,
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: buttonLeft ? "block" : "none",
          left: 0,
          zIndex: 1,
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }
  const settings = {
    speed: 1000,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow buttonRight={buttonRight} />,
    prevArrow: <SamplePrevArrow buttonLeft={buttonLeft} />,
    ...config,
  };
  return (
    <Slider {...settings} className="rounded-xl">
      {children}
    </Slider>
  );
}

export default Slick;
