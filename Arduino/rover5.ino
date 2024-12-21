#include <Servo.h>

#define RPWM_LEFT 3
#define LPWM_LEFT 5
#define RPWM_RIGHT 9
#define LPWM_RIGHT 6

// Servo pins and angles
#define SERVO1_PIN 10  // Updated pin for Servo 1
#define SERVO2_PIN 11  // Updated pin for Servo 2
Servo servo1;
Servo servo2;

// Default PWM speed and step
int MAX_PWM_SPEED = 80;
const int MAX_PWM_SPEED_LIMIT = 255;
const int MIN_PWM_SPEED_LIMIT = 0;
const int PWM_STEP = 5;

// Servo angle limits for each servo
int servo1Angle = 90; // Default angle for Servo 1
int servo2Angle = 90; // Default angle for Servo 2

// Angle limits for Servo 2
const int MIN_SERVO2_ANGLE = 0;
const int MAX_SERVO2_ANGLE = 180;

void setup() {
  servo1.attach(SERVO1_PIN); // Attach Servo 1 to pin 10
  servo2.attach(SERVO2_PIN); // Attach Servo 2 to pin 11
  
  servo1.write(servo1Angle); // Set initial angle for Servo 1
  servo2.write(servo2Angle); // Set initial angle for Servo 2

  pinMode(RPWM_LEFT, OUTPUT);
  pinMode(LPWM_LEFT, OUTPUT);
  pinMode(RPWM_RIGHT, OUTPUT);
  pinMode(LPWM_RIGHT, OUTPUT);
  
  Serial.begin(9600); // Initialize serial communication
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    // Process incoming commands
    if (command == 'F') {
      driveForwardExponential();
    } else if (command == 'B') {
      driveBackwardExponential();
    } else if (command == 'L') {
      turnLeft();
    } else if (command == 'R') {
      turnRight();
    } else if (command == 'S') {
      stop();
    } else if (command == 'Q') { // Increase servo 1 angle by 5 degrees
      increaseServo1();
    } else if (command == 'W') { // Decrease servo 1 angle by 5 degrees
      decreaseServo1();
    } else if (command == 'E') { // Increase servo 2 angle by 5 degrees
      increaseServo2();
    } else if (command == 'T') { // Decrease servo 2 angle by 5 degrees
      decreaseServo2();
    } else if (command == 'Z') { // Reset Servo 1
      resetServo1();
    } else if (command == 'U') { // Reset Servo 2
      resetServo2();
    } else if (command == 'I') { // Increase MAX_PWM_SPEED
      increaseMaxPwmSpeed();
    } else if (command == 'O') { // Decrease MAX_PWM_SPEED
      decreaseMaxPwmSpeed();
    } else if (command == 'P') { // Reset MAX_PWM_SPEED to default (80)
      resetMaxPwmSpeed();
    }
}
}

void driveForwardExponential() {
  for (int i = 0; i <= MAX_PWM_SPEED; i++) {
//    int pwm_value = calculateExponentialPWM(i);
    int pwm_value = MAX_PWM_SPEED;
    analogWrite(RPWM_LEFT, 0);
    analogWrite(LPWM_LEFT, pwm_value);
    analogWrite(RPWM_RIGHT, 0);
    analogWrite(LPWM_RIGHT, pwm_value);
//    delay(5);
  }
}

void driveBackwardExponential() {
  for (int i = 0; i <= MAX_PWM_SPEED; i++) {
  int pwm_value = calculateExponentialPWM(i);
//    int pwm_value = MAX_PWM_SPEED;
    analogWrite(RPWM_LEFT, pwm_value);
    analogWrite(LPWM_LEFT, 0);
    analogWrite(RPWM_RIGHT, pwm_value);
    analogWrite(LPWM_RIGHT, 0);
//    delay(5);
  }
}

void turnLeft() {
  analogWrite(RPWM_LEFT, MAX_PWM_SPEED);
  analogWrite(LPWM_LEFT, 0);
  analogWrite(RPWM_RIGHT, 0);
  analogWrite(LPWM_RIGHT, MAX_PWM_SPEED);
}

void turnRight() {
  analogWrite(RPWM_LEFT, 0);
  analogWrite(LPWM_LEFT, MAX_PWM_SPEED);
  analogWrite(RPWM_RIGHT, MAX_PWM_SPEED);
  analogWrite(LPWM_RIGHT, 0);
}

void stop() {
  analogWrite(RPWM_LEFT, 0);
  analogWrite(LPWM_LEFT, 0);
  analogWrite(RPWM_RIGHT, 0);
  analogWrite(LPWM_RIGHT, 0);
}

int calculateExponentialPWM(int index) {
  float exponent = 2.0;
  float fraction = pow((float)index / MAX_PWM_SPEED, exponent);
  return (int)(MAX_PWM_SPEED * fraction);
}

// Servo control functions
void increaseServo1() {
  if (servo1Angle < 180) {
    servo1Angle += 5;
    servo1.write(servo1Angle);
  }
}

void decreaseServo1() {
  if (servo1Angle > 0) {
    servo1Angle -= 5;
    servo1.write(servo1Angle);
  }
}

void increaseServo2() {
  if (servo2Angle < MAX_SERVO2_ANGLE) {
    servo2Angle += 5;
    servo2.write(servo2Angle);
  }
}

void decreaseServo2() {
  if (servo2Angle > MIN_SERVO2_ANGLE) {
    servo2Angle -= 5;
    servo2.write(servo2Angle);
  }
}

void resetServo1() {
  servo1Angle = 90;  // Reset to default position
  servo1.write(servo1Angle);
}

void resetServo2() {
  servo2Angle = 90;  // Reset to default position
  servo2.write(servo2Angle);
}

// MAX_PWM_SPEED control functions
void increaseMaxPwmSpeed() {
  if (MAX_PWM_SPEED < MAX_PWM_SPEED_LIMIT) {
    MAX_PWM_SPEED += PWM_STEP;
  }
}

void decreaseMaxPwmSpeed() {
  if (MAX_PWM_SPEED > MIN_PWM_SPEED_LIMIT) {
    MAX_PWM_SPEED -= PWM_STEP;
  }
}

void resetMaxPwmSpeed() {
  MAX_PWM_SPEED = 80;  // Reset to default value
}