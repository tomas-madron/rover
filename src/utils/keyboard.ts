// src/utils/keyboard.ts

export function setupKeyboardController(sendCommand: (command: string) => void) {
    const keyMap: Record<string, string> = {
      'ArrowUp': 'F',
      'ArrowDown': 'B',
      'ArrowLeft': 'L',
      'ArrowRight': 'R',
      'w': 'Q', 'W': 'Q', // Servo UP 
      'S': 'W', 's': 'W', // Servo RIGHT
      'a': 'E', 'A': 'E', // Servo LEFT
      'd': 'T', 'D': 'T', // Servo DOWN
    };
  
    const keyState: Record<string, boolean> = {};
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyMap[e.key] && !keyState[e.key]) {
        sendCommand(`${keyMap[e.key]}`); // Send command on key press
        keyState[e.key] = true;
      }
    };
  
    const handleKeyUp = (e: KeyboardEvent) => {
      
      if (keyMap?.[e.key] && keyState[e.key]) {
        ["B", "R", "F", "L", "S"].includes(keyMap[e.key]) &&  sendCommand("S"); // Send stop command on key release
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
  