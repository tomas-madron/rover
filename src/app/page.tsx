"use client";
import { useEffect, useState } from "react";
import { setupGamepadController } from "../utils/gamepad";
import { setupKeyboardController } from "../utils/keyboard";

export default function Home() {
  const [videoStream, setVideoStream] = useState<string | null>(null);
  const [currentCommand, setCurrentCommand] = useState<string>("");

  useEffect(() => {
    // Set video stream URL
    setVideoStream("http://172.16.1.171:8080/?action=stream"); // Replace with camera stream URL

    const sendCommandToBackend = async (command: string) => {
      setCurrentCommand(command);
      try {
        await fetch("/api/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });
      } catch (error) {
        console.error("Error sending command to backend:", error);
      }
    };

    // Initialize gamepad controller
    const { startPolling, stopPolling } = setupGamepadController(sendCommandToBackend);
    startPolling();

    // Initialize keyboard controller
    const { startListening, stopListening } = setupKeyboardController(sendCommandToBackend);
    startListening();

    return () => {
      stopPolling();
      stopListening();
    };
  }, []);

  return (
    <div>
      <h1>Camera Stream with Gamepad & Keyboard Control</h1>
      {videoStream ? (
        <img src={videoStream} width={640} height={480} alt="Live Video Stream" />
      ) : (
        <p>Loading video stream...</p>
      )}
      <p>Current Command: {currentCommand}</p>
    </div>
  );
}
