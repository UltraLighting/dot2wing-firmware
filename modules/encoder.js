import rpio from 'rpio';

import config from '../config.json';

const pins = config.controller.gpio.encoder.pins;

let lastValue = false;

export function readEncoderSwitch() { return !rpio.read(pins.switch); }

export function readEncoder() {
  const nowValue = rpio.read(pins.A);
  const valuePinB = rpio.read(pins.B);
  if (lastValue !== nowValue) {
    lastValue = nowValue;
    if (nowValue) {
      if (!valuePinB) return -1;
      return 1;
    }
    if (!valuePinB) return 1;
    return -1;
  }
  return 0;
}

export function initEncoder() {
  rpio.init({ gpiomem: false });
  // define gpio pins
  Object.values(pins).forEach((pin) => rpio.open(pin, rpio.INPUT, rpio.PULL_UP));
}
