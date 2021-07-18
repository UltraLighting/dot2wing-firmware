import rpio from 'rpio';

import Oled from 'sh1106-js';

import font from 'oled-font-5x7';

import config from '../config.json';

const outputData = config.controller.gpio.displays.outputData;

const outputMultiplexer = config.controller.gpio.displays.outputMultiplexer;

let oled;

export function initOLED() {
  oled = new Oled({ rpio, address: 0x3c });
  // rotate display
  [0xA1, 0xC8].forEach((cmd) => rpio.i2cWrite(Buffer.from([0x00, cmd])));
  // set lower baudrate
  // rpio.i2cSetBaudRate(100000);
  rpio.i2cSetBaudRate(400000);
  // enable display
  oled.turnOnDisplay();
  // invert color
  oled.invertDisplay(false);
  // clear
  oled.clearDisplay();
  oled.dimDisplay(0xff);
  // set interval
  setInterval(() => oled.update(), 50);
}

export function setOLED(data) {
  rpio.i2cSetSlaveAddress(0x3c);
  // oled.drawRect(0, 0, 128, 64, 'WHITE');
  oled.writeString(64, 30, font, `${Math.ceil(data[0][0].fader.value * 100)}%  `, 'WHITE', false);
}
