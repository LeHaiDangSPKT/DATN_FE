import React from "react";
import Slick from "./Slick";
import CardProduct from "./CardProduct";

function ListProductHomePage(props: any) {
  const { title, listHighLight, listProduct } = props;
  const [check, setCheck] = React.useState(0);
  return (
    <div className="flex flex-col bg-white p-4 rounded-xl mb-2">
      <div className="flex justify-between font-bold">
        <div>{title}</div>
      </div>
      <div className="flex my-2 ms-2">
        {listHighLight &&
          listHighLight.map((item: any, index: number) => {
            return (
              <div
                className={`px-4 py-2 border-2 rounded-2xl hover:bg-slate-100 hover:cursor-pointer hover:border-slate-100 mr-2 ${
                  check == index && "bg-slate-100 border-slate-100"
                }`}
                key={index}
                onClick={(e) => setCheck(index)}
              >
                {item.storeName}
              </div>
            );
          })}
      </div>
      <Slick
        config={{
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
        }}
        buttonRight={true}
        buttonLeft={true}
      >
        {listHighLight
          ? listHighLight[check]?.listProducts.map(
              (item: any, index: number) => {
                return <CardProduct key={index} data={item} />;
              }
            )
          : listProduct.map((item: any, index: number) => {
              return <CardProduct key={index} data={item} />;
            })}
      </Slick>
    </div>
  );
}

export default ListProductHomePage;
