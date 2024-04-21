"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

export default function Page() {
  const handleOpen = () => window.location.replace("/");

  return (
    <>
      <Dialog open={true} handler={handleOpen}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Đã xảy ra lỗi
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            enable-background="new 0 0 48 48"
            viewBox="0 0 48 48"
            id="computer-dead"
          >
            <path
              d="M42,42H6c-2.757,0-5-2.243-5-5V5c0-2.757,2.243-5,5-5h36c2.757,0,5,2.243,5,5v32C47,39.757,44.757,42,42,42z M6,2
		C4.346,2,3,3.346,3,5v32c0,1.654,1.346,3,3,3h36c1.654,0,3-1.346,3-3V5c0-1.654-1.346-3-3-3H6z"
            ></path>
            <path
              d="M31.999,48h-16c-0.321,0-0.624-0.154-0.812-0.415c-0.188-0.261-0.239-0.597-0.137-0.901l2.001-6
		C17.188,40.275,17.57,40,18,40h12c0.431,0,0.813,0.275,0.949,0.684l1.998,6c0.103,0.306,0.051,0.641-0.137,0.901
		C32.622,47.846,32.32,48,31.999,48z M17.386,46h13.225l-1.332-4H18.721L17.386,46z"
            ></path>
            <path d="M34 48H14c-.552 0-1-.447-1-1s.448-1 1-1h20c.553 0 1 .447 1 1S34.553 48 34 48zM46 36H2c-.552 0-1-.447-1-1s.448-1 1-1h44c.553 0 1 .447 1 1S46.553 36 46 36zM19 14c-.256 0-.512-.098-.707-.293l-4-4c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l4 4c.391.391.391 1.023 0 1.414C19.512 13.902 19.256 14 19 14z"></path>
            <path d="M15 14c-.256 0-.512-.098-.707-.293-.391-.391-.391-1.023 0-1.414l4-4c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-4 4C15.512 13.902 15.256 14 15 14zM33 14c-.256 0-.512-.098-.707-.293l-4-4c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l4 4c.391.391.391 1.023 0 1.414C33.512 13.902 33.256 14 33 14z"></path>
            <path d="M29 14c-.256 0-.512-.098-.707-.293-.391-.391-.391-1.023 0-1.414l4-4c.391-.391 1.023-.391 1.414 0s.391 1.023 0 1.414l-4 4C29.512 13.902 29.256 14 29 14zM31.999 24H16c-.552 0-1-.447-1-1s.448-1 1-1h15.999c.553 0 1 .447 1 1S32.552 24 31.999 24z"></path>
            <path
              d="M30,28h-4c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4C31,27.553,30.553,28,30,28z M27,26h2v-2
		h-2V26z"
            ></path>
          </svg>

          <Typography color="gray" variant="h5">
            Thao tác vừa rồi của bạn đã xảy ra lỗi, vui lòng thử lại sau
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="gradient" onClick={handleOpen}>
            Trở về trang chủ
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
