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
  data.forEach((row, rowMultipier) => {
    row.forEach((button, i) => {
      let color = {};
      if (allConfig.maweb.appType === 'dot2') {
        color.r = config.dot2Color.red;
        color.g = config.dot2Color.green;
        color.b = config.dot2Color.blue;
      } else color = hexToRgb(button.color || button.fader.color);
      const multipier = config.isRunMultipier;
      // eslint-disable-next-line no-bitwise
      let setColor = (color.r * multipier << 16) | (color.g * multipier << 8) | color.b * multipier;
      if (!button.fader) { // button LEDs
        // eslint-disable-next-line no-bitwise
        if (button.isRun) setColor = (color.r << 16) | (color.g << 8) | color.b;
        // TODO: Better bitwise handler
        if (button.empty) setColor = 0;
      } else { // fader LEDs
        // eslint-disable-next-line no-bitwise
        if (button.fader.isRun) setColor = (color.r << 16) | (color.g << 8) | color.b;
        // if (button.fader.isRun) setColor = (color.r * button.fader.value << 16) | (color.g * button.fader.value << 8) | color.b * button.fader.value;
        // TODO: Better bitwise handler
        if (button.fader.empty) setColor = 0;
      }
      pixels[i + (rowMultipier * 8)] = setColor;
    });
  });
}

export function initPixel() {
  // initalize config
  ledHandler.configure(config.options);
  // reset pixels
  pixels.forEach((plx, i) => pixels[i] = 0);
  // set interval
  setInterval(() => ledHandler.render(pixels), config.options.refreshTime);
}
