import config from '../../config.json';

function parseButton(rawButton) {
  const button = {};
  button.name = rawButton.tt.t;
  button.isRun = !!rawButton.isRun;
  button.empty = rawButton.i.c === '#000000';
  button.color = rawButton.bdC;
  return button;
}

function buttonRow(row) {
  const buttons = [];
  row.items.forEach((buttonRaw) => {
    buttonRaw.forEach((buttonRaw2) => {
      buttons.push(parseButton(buttonRaw2));
    });
  });
  return buttons;
}

function parseFader(rawFader) {
  const output = {};
  output.fader = {};
  const execBlocks = rawFader.executorBlocks[0];
  output.fader.name = rawFader.tt.t;
  output.fader.isRun = !!rawFader.isRun;
  output.fader.empty = rawFader.i.c === '#000000';
  output.fader.color = rawFader.bdC;
  output.fader.value = execBlocks.fader.v;
  // output.upperButton = { isPressed: parseFaderButton(execBlocks.button1) };
  // output.lowerButton = { isPressed: parseFaderButton(execBlocks.button2) };
  return output;
}

function faderRow(row) {
  const faders = [];
  row.items.forEach((faderRaw) => {
    faderRaw.forEach((faderRaw2) => {
      faders.push(parseFader(faderRaw2));
    });
  });
  return faders;
}

export function parseValues_gma2(rawData) {
  const output = [];
  rawData.itemGroups.forEach((row) => {
    let parsedFaders;
    let parsedButtons;
    switch (row.itemsType) {
      case 2:
        parsedFaders = faderRow(row);
        break;
      case 3:
        parsedButtons = buttonRow(row);
        break;
      default: break;
    }
    if (parsedFaders) output.push(parsedFaders);
    if (parsedButtons) output.push(parsedButtons);
  });
  return output;
}

export { parseValues_gma2 as default };
