import React from "react";
import { BsMicMuteFill, FaVideo, MdCallEnd } from "../assets";
import { useConnectWebRtc } from "../context/WebRtcContext";

export default function VideoChat({ show }) {
  const { localVideoRef, remoteVideoRef, handleHangup, callConnectionState } =
    useConnectWebRtc();

  return (
    <div
      className={`absolute ${
        show ? "" : "hidden"
      } z-50 bg-slate-800 w-full h-full bg-opacity-80 p-20`}
    >
      <div className="relative bg-slate-900 w-full h-full rounded-md">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
        ></video>
        <video
          // autoPlay
          ref={localVideoRef}
          autoPlay
          className="absolute bottom-4 left-4 w-48 h-36 object-cover border-2 border-white rounded-md"
        ></video>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50">
            <BsMicMuteFill />
          </button>
          <button className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50">
            <FaVideo />
          </button>
          <button
            onClick={handleHangup}
            className="p-2 bg-white bg-opacity-40 rounded-full text-red-900 hover:bg-opacity-50"
          >
            <MdCallEnd />
          </button>
        </div>

        <div className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2">
          {callConnectionState !== "connected" && (
            <div className="text-white text-lg">{callConnectionState}...</div>
          )}
        </div>
      </div>
    </div>
  );
}
