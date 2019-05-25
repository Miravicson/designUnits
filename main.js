let state = {
  mainInputUnit: 'px',
  mainInputValue: '',
  results: {
    pt: '',
    in: '',
    px: '',
    cm: '',
    pc: '',
    mm: ''
  },
  transformation: {
    pt: [1, 1 / 72, 96 / 72, 2.54 / 72, 1 / 12, 25.4 / 72], // 1 pt is [1 pt, 1/72 in, 96/72 px, 2.54/ 72 cm, 1/12 pc, 25.4/72 mm]
    in: [72, 1, 96, 2.54, 6, 25.4],
    px: [72 / 96, 1 / 96, 1, 2.54 / 96, 6 / 96, 25.4 / 96],
    cm: [72 / 2.54, 1 / 2.54, 96 / 2.54, 1, 6 / 2.54, 10],
    pc: [12, 1 / 6, 96 / 6, 2.54 / 6, 1, 25.4 / 6],
    mm: [72 / 25.4, 1 / 25.4, 96 / 25.4, 1 / 10, 6 / 25.4, 1]
  },

}

const mainInputObject = document.querySelector('#main-input');
const selector = document.querySelector('#units');
selector.onchange = handleSelectChange;
const backSpace = document.querySelector('#clr');
backSpace.onclick = handleBackSpace;
const enterKey = document.querySelector('#enter');
enterKey.onclick = compute;
const clearButton = document.querySelector('#allClear');
clearButton.onclick = clearAll;
const upArrow = document.querySelector('#up');
upArrow.onclick = increaseByOne;
const downArrow = document.querySelector('#down');
downArrow.onclick = decreaseByOne;
setupButtons();

function handleSelectChange() {
  const optionsArray = Array.from(this.options);
  const selectedValue = optionsArray[this.selectedIndex].value
  updateState({
    mainInputUnit: selectedValue
  });
  if (state.mainInputValue) {
    compute();
  }
}

function handleBackSpace() {
  let text = state.mainInputValue;
  let temp = text.split('');
  temp.pop();
  text = temp.join('');
  updateState({
    mainInputValue: text
  })
  compute();
}

function updateState(update) {
  state = {
    ...state,
    ...update
  }
  updateMainInput(state.mainInputValue);
}

function updateMainInput(text) {
  mainInputObject.value = text;
}

function buttonHandler(event) {
  text = state.mainInputValue + event.target.innerText;
  updateState({
    mainInputValue: text
  });
  compute();
}

function setupButtons() {
  let buttons = document.querySelectorAll('.circle');
  buttons = Array.from(buttons)
  for (button of buttons) {
    button.onclick = buttonHandler;
  }
}




function aToAll(unit, value) {
  const transformationArray = state.transformation[unit];
  const result = transformationArray.map(ratio => ratio * value);
  const [pt, inch, px, cm, pc, mm] = result.map(number => number.toFixed(2));
  const results = {
    pt,
    "in": inch,
    px,
    cm,
    pc,
    mm
  }

  updateState({
    results
  });
}

function updateDisplayOutputs() {
  for (unit of Object.keys(state.results)) {
    document.querySelector(`#${unit}`).innerText = state.results[unit];
  }
}


function compute() {
  let {
    mainInputUnit: unit,
    mainInputValue: value
  } = state;
  value = Number(value);
  aToAll(unit, value);
  updateDisplayOutputs();
}

function clearAll() {
  updateState({
    mainInputUnit: 'px',
    mainInputValue: '',
    results: {
      pt: 0,
      "in": 0,
      px: 0,
      cm: 0,
      pc: 0,
      mm: 0
    }
  });
  updateDisplayOutputs();
}

function increaseByOne() {
  let value = state.mainInputValue;
  value = Number(value);
  value++;
  updateState({
    mainInputValue: String(value)
  })
  compute()
}

function decreaseByOne() {
  let value = state.mainInputValue;
  value = Number(value);
  if (value == 0) return;
  value--;
  updateState({
    mainInputValue: String(value)
  });
  compute();
}