import ledHandler from 'rpi-ws281x';

import allConfig from '../config.json';

const config = allConfig.controller.neopixel;

const pixels = new Uint32Array(config.options.leds);

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function setPixels(data) {
  data[0].forEach((button, i) => {
    const color = hexToRgb(button.color);
    const multipier = config.isRunMultipier;
    // eslint-disable-next-line no-bitwise
    let setColor = (color.r * multipier << 16) | (color.g * multipier << 8) | color.b * multipier;
    // eslint-disable-next-line no-bitwise
    if (button.isRun) setColor = (color.r << 16) | (color.g << 8) | color.b;
    // TODO: Better bitwise handler
    if (button.empty) setColor = 0;
    pixels[i] = setColor;
  });
  ledHandler.render(pixels);
}

export function initPixel() {
  // initalize config
  ledHandler.configure(config.options);
  // reset pixels
  pixels.forEach((plx, i) => pixels[i] = 0);
  ledHandler.render(pixels);
}
