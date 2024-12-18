// src/utils/keyboard.ts

export function setupKeyboardController(sendCommand: (command: string) => void) {
    const keyMap: Record<string, string> = {
      'ArrowUp': 'F',
      'ArrowDown': 'B',
      'ArrowLeft': 'L',
      'ArrowRight': 'R',
      'w': 'F', 'W': 'F', // forward move
      'a': 'L', 'A': 'L', // left move
      'd': 'R', 'D': 'R', // right move
      'S': 'V', 's': 'B' // backward move
    };
  
    const keyState: Record<string, boolean> = {};
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyMap[e.key] && !keyState[e.key]) {
        sendCommand(keyMap[e.key]); // Send command on key press
        keyState[e.key] = true;
      }
    };
  
    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyMap[e.key] && keyState[e.key]) {
        sendCommand("S"); // Send stop command on key release
        keyState[e.key] = false;
      }
    };
  
    const startListening = () => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    };
  
    const stopListening = () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  
    return { startListening, stopListening };
  }
  