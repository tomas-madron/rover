type SendCommandType = (command: string) => void;

export function setupGamepadController(sendCommand: SendCommandType) {
  const POLL_INTERVAL = 100;

  const buttonMap: Record<number, string> = {
    0: "B", // A - Backward
    1: "R", // B - Right
    3: "F", // Y - Forward
    2: "L", // X - Left
  };

  const buttonState: Record<number, boolean> = {};
  let intervalId: NodeJS.Timeout | null = null;

  const pollGamepad = () => {
    const gamepads = navigator.getGamepads?.() || [];
    const gp = gamepads[0]; // Assume the first gamepad is active
    if (!gp) return;

    gp.buttons.forEach((btn, index) => {
      if (buttonMap.hasOwnProperty(index)) {
        if (btn.pressed && !buttonState[index]) {
          sendCommand(`${buttonMap[index]}`); // Send press command
          buttonState[index] = true;
        } else if (!btn.pressed && buttonState[index]) {
          sendCommand("S"); // Send stop command on release
          buttonState[index] = false;
        }
      }
    });
  };

  const startPolling = () => {
    if (!intervalId) intervalId = setInterval(pollGamepad, POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (intervalId) clearInterval(intervalId);
  };

  return { startPolling, stopPolling };
}
