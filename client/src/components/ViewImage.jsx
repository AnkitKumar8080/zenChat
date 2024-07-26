import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoClose } from "../assets/";
import { useEffect, useState } from "react";

export default function MyModal({ openView, setOpenView, imageUrl }) {
  function close() {
    setOpenView(false);
  }

  useEffect(() => {}, [imageUrl]);

  return (
    <>
      <Dialog
        open={openView}
        as="div"
        className="z-40 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 flex items-center justify-center  z-10 w-screen h-full overflow-y-auto bg-black bg-opacity-30">
          <div className="relative w-[900px]">
            <img src={imageUrl} alt={imageUrl} />
            <div
              className="absolute bg-white bg-opacity-30 rounded-md z-50 top-0 right-0 text-2xl text-red-500 cursor-pointer"
              onClick={close}
            >
              <IoClose />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
