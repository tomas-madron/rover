import type { NextApiRequest, NextApiResponse } from "next";

import { SerialPort } from "serialport";

// Initialize serial port
const serialPort = new SerialPort({
  path: "/dev/ttyACM0", // Replace with your Arduino's port
  baudRate: 9600,
});

const handleControlCommand = async (command: string) => {
  console.log(`Sending command to hardware: ${command}`);
  // Add serial port or hardware communication logic here.
  try {
    // Example: sending through serial/HTTP/WebSocket
    await serialPort.write(command);
  } catch (error) {
    console.error("Error sending command:", error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    let { command } = req.body;

    if (["B", "R", "F", "L", "S", "Q", "W", "E", "T"].includes(command)) {
      try {
        // command = command === "B" ? "F" : command === "F" ? "B" : command;
        await handleControlCommand(command);
        res.status(200).json({ message: `Command '${command}' processed` });
      } catch (error) {
        res.status(500).json({ error: `Failed to process command - ${error}` });
      }
    } else {
      res.status(400).json({ error: "Invalid command" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
