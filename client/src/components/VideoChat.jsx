import React from "react";
import {
  FaVideoSlash,
  BsMicMuteFill,
  FaMicrophone,
  FaVideo,
  MdCallEnd,
  MdFlipCameraAndroid,
} from "../assets";
import { useConnectWebRtc } from "../context/WebRtcContext";

export default function VideoChat({ show }) {
  const {
    localVideoRef,
    remoteVideoRef,
    handleHangup,
    callConnectionState,
    handleToggleCamera,
    handleToggleMicrophone,
    isCameraActive,
    isMicrophoneActive,
    cameraFace,
  } = useConnectWebRtc();

  const handleCameraFace = () => {
    cameraFace.current = cameraFace.current === "user" ? "environment" : "user";
  };

  return (
    <div
      className={`absolute ${
        show ? "" : "hidden"
      } z-50 bg-slate-800 w-full h-full bg-opacity-80 p-20 md:p-0`}
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
          className="absolute bottom-4 left-4 md:left-3 md:bottom-3 w-48 h-36 md:w-24 md:h-36 object-cover border-2 md:border-[1px] border-white rounded-md"
        ></video>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={handleToggleMicrophone}
            className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50"
          >
            {isMicrophoneActive ? <FaMicrophone /> : <BsMicMuteFill />}
          </button>
          <button
            onClick={handleToggleCamera}
            className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50"
          >
            {isCameraActive ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button
            onClick={handleCameraFace}
            className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50"
          >
            <MdFlipCameraAndroid />
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
