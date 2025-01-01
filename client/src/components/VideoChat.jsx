import React, { useState } from "react";
import {
  FaVideoSlash,
  BsMicMuteFill,
  FaMicrophone,
  FaVideo,
  MdCallEnd,
  MdFlipCameraAndroid,
  RiArrowDropDownLine,
  RiArrowDropUpLine,
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
    flipCamera,
    inputVideoDevices,
    selectedInputVideoDevice,
    changeVideoInputDevice,
    inputAudioDevices,
    selectedInputAudioDevice,
    changeAudioInputDevice,
  } = useConnectWebRtc();

  const handleChangeVideoInput = (deviceId) => {
    changeVideoInputDevice(deviceId);
  };

  const handleChangeAudioInput = (deviceId) => {
    changeAudioInputDevice(deviceId);
  };

  const [showVideoOptionTray, setShowVideoOptionTray] = useState(false);
  const [showAudioOptionTray, setShowAudioOptionTray] = useState(false);
  const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;

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
          ref={localVideoRef}
          autoPlay
          className="absolute bottom-4 left-4 md:left-3 md:bottom-4 w-48 h-36 md:w-16 md:h-24 object-cover border-2 md:border-[1px] border-white rounded-md"
        ></video>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4 p-2">
          <div className="relative flex items-center bg-gray-700 rounded-full">
            <div
              className={`${
                showAudioOptionTray && !isMobileDevice ? "" : "hidden"
              } videoDevices absolute bottom-10`}
            >
              {inputAudioDevices?.length !== 0 && (
                <ul className="bg-white px-2 py-1">
                  {inputAudioDevices?.map((device) => (
                    <li
                      onClick={() => handleChangeAudioInput(device.deviceId)}
                      className={`text-xs w-[250px] text-left cursor-pointer my-2 ${
                        device.deviceId === selectedInputAudioDevice
                          ? "text-blue-700"
                          : ""
                      }`}
                    >
                      {device.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              onClick={() => setShowAudioOptionTray(!showAudioOptionTray)}
              className={`${
                isMobileDevice && "hidden"
              } px-1 text-2xl text-white cursor-pointer`}
            >
              {showAudioOptionTray ? (
                <RiArrowDropUpLine />
              ) : (
                <RiArrowDropDownLine />
              )}
            </div>
            <button
              onClick={handleToggleMicrophone}
              className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50"
            >
              {isMicrophoneActive ? <FaMicrophone /> : <BsMicMuteFill />}
            </button>
          </div>
          <div className="relative flex items-center bg-gray-700 rounded-full">
            <div
              className={`${
                showVideoOptionTray && !isMobileDevice ? "" : "hidden"
              } videoDevices absolute bottom-10`}
            >
              {inputVideoDevices?.length !== 0 && (
                <ul className="bg-white px-2 py-1">
                  {inputVideoDevices?.map((device) => (
                    <li
                      onClick={() => handleChangeVideoInput(device.deviceId)}
                      className={`text-xs w-[250px] text-left cursor-pointer my-2 ${
                        device.deviceId === selectedInputVideoDevice
                          ? "text-blue-700"
                          : ""
                      }`}
                    >
                      {device.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              onClick={() => setShowVideoOptionTray(!showVideoOptionTray)}
              className={`${
                isMobileDevice && "hidden"
              } px-1 text-2xl text-white cursor-pointer`}
            >
              {showVideoOptionTray ? (
                <RiArrowDropUpLine />
              ) : (
                <RiArrowDropDownLine />
              )}
            </div>
            <button
              onClick={handleToggleCamera}
              className="p-2 bg-white bg-opacity-40 rounded-full text-white hover:bg-opacity-50"
            >
              {isCameraActive ? <FaVideo /> : <FaVideoSlash />}
            </button>
          </div>
          <button
            onClick={flipCamera}
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
