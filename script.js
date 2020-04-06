let rowLength = 4;
let isMove = false;
let stepsCount = 0;
let timer = localStorage.getItem('timer') * 1;
let cells = [];

let timerString = '00:00:0';

// Генерация интерфейса;
const clock = document.createElement('div');
clock.classList.add('clock');
clock.innerText = timerString;
document.body.prepend(clock);

const menu = document.createElement('div');
menu.classList.add('menu');
document.body.append(menu);

const step = document.createElement('div');
step.classList.add('step');
step.innerText = `Ходов: ${stepsCount}`;
document.querySelector('.menu').append(step);

const reset = document.createElement('button');
reset.classList.add('reset');
reset.innerText = 'Начать заново';
document.querySelector('.menu').append(reset);

const switcher = document.createElement('button');
switcher.classList.add('switcher');
switcher.innerText = 'Старт';
document.querySelector('.menu').append(switcher);

const menuButton = document.createElement('button');
menuButton.classList.add('menuButton');
menuButton.innerText = 'Меню';
document.querySelector('.menu').append(menuButton);

const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
<div class='modal__wrapper'>
  <button class='save'>Сохранить</button>
  <button class='result'>Результаты</button>
  <button class='size three'>3x3</button>
  <button class='size four'>4x4</button>
  <button class='size five'>5x5</button>
  <button class='size six'>6x6</button>
  <button class='size seven'>7x7</button>
  <button class='size eight'>8x8</button>
  <button class='close'>Закрыть</button>
</div>
`;
modal.tabIndex = '0';
document.body.prepend(modal);

function shuffleArray(arr) {
  const copyArray = arr.slice(); let
    temporaryValue;
  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex -= 1;

    temporaryValue = copyArray[currentIndex];
    copyArray[currentIndex] = copyArray[randomIndex];
    copyArray[randomIndex] = temporaryValue;
  }

  return copyArray;
}

function startTimer() {
  timer += 100;
  let temporaryTimer = timer;
  let ms = temporaryTimer % 1000;
  ms = !ms ? '000' : ms;
  temporaryTimer = Math.floor(temporaryTimer / 1000);
  let sec = `${temporaryTimer % 60}`;
  sec = sec.length === 1 ? `0${sec}` : sec;
  temporaryTimer = Math.floor(temporaryTimer / 60);
  let min = `${temporaryTimer % 60}`;
  min = min.length === 1 ? `0${min}` : min;
  timerString = `${min}:${sec}:${ms}`;
  timerString = timerString.slice(0, timerString.length - 2);
  document.querySelector('.clock').innerText = timerString;
}
startTimer();

function checkWin() {
  let bool = true;
  const array = document.querySelectorAll('.cell');
  let index = 0;
  while (bool && index < (array.length - 1)) {
    if ((array[index].innerText) * 1 !== (index + 1)) {
      bool = false;
    }
    index += 1;
  }
  if (bool) {
    const result = {
      time: timerString,
      steps: stepsCount,
    };
    const win = document.createElement('div');
    win.classList.add('win');
    win.innerHTML = `
      <div>Ура! Вы решили головоломку за ${result.time} и ${result.steps} ходов</div>
    `;
    document.body.append(win);
    setTimeout(() => {
      win.remove();
    }, 7000);

    if (localStorage.getItem('results') === null) {
      const results = [];
      results.push(result);
      localStorage.setItem('results', JSON.stringify(results));
    } else {
      let results = JSON.parse(localStorage.getItem('results'));
      results.push(result);
      results.sort((a, b) => {
        if (a.steps > b.steps) {
          return 1;
        }
        if (a.steps < b.steps) {
          return -1;
        }

        return 0;
      });
      if (results.length > 10) {
        results = results.slice(0, 11);
      }
      localStorage.setItem('results', JSON.stringify(results));
    }
  }
}

function moveByClick(evt, item1, index) {
  const item = item1;
  if (item.style.animation !== '') {
    return;
  }
  if (isMove) {
    isMove = false;
    return;
  }
  if ((index + 1) % rowLength !== 1 && cells[index - 1].innerHTML === '&nbsp;') {
    item.style.animation = 'toLeft 0.5s';
    setTimeout(() => {
      cells[index - 1].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      item.style.animation = '';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    }, 440);
  } else if ((index + 1) % rowLength !== 0 && cells[index + 1].innerHTML === '&nbsp;') {
    item.style.animation = 'toRight 0.5s';
    setTimeout(() => {
      cells[index + 1].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      item.style.animation = '';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    }, 440);
  } else if ((index + 1) > rowLength && cells[index - rowLength].innerHTML === '&nbsp;') {
    item.style.animation = 'toTop 0.5s';
    setTimeout(() => {
      cells[index - rowLength].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      item.style.animation = '';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    }, 440);
  } else if ((index + 1) <= rowLength * (rowLength - 1) && cells[index + rowLength].innerHTML === '&nbsp;') {
    item.style.animation = 'toDown 0.5s';
    setTimeout(() => {
      cells[index + rowLength].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      item.style.animation = '';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    }, 440);
  }
}

function fillField(arr) {
  const container = document.querySelector('.container');
  for (let i = 0; i < arr.length; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = arr[i] !== 0 ? arr[i] : '&nbsp;';
    container.append(cell);
  }
  cells = document.querySelectorAll('.cell');
  cells.forEach((item) => {
    const item1 = item;
    const size = 100 / rowLength;
    item1.style.width = `${size}%`;
    item1.style.height = `${size}%`;
  });
}

function createField(array) {
  let arr = [];
  if (!array) {
    for (let i = 0; i < rowLength * rowLength - 1; i += 1) {
      arr.push(i + 1);
    }
    arr.push(0);
    let bool = true;
    while (bool) {
      arr = shuffleArray(arr);
      // проверка на проходимость возможно работает
      let inv = 0;
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i]) {
          for (let j = 0; j < i; j += 1) {
            if (arr[j] > arr[i]) { inv += 1; }
          }
        }
      }
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i] === 0) {
          inv += 1 + Math.floor(i / rowLength);
        }
      }
      if (rowLength % 2 !== 0) {
        inv += 1;
      }

      bool = inv % 2 !== 0;
    }
  }
  arr = array !== undefined ? array : arr;
  fillField(arr);
}

function drag(evt, item1, index, device) {
  const item = item1;
  const end = device === 'computer' ? 'mouseup' : 'touchend';
  const middle = device === 'computer' ? 'mousemove' : 'touchmove';
  let direction;
  if ((index + 1) % rowLength !== 1 && cells[index - 1].innerHTML === '&nbsp;') {
    direction = 'left';
  } else if ((index + 1) % rowLength !== 0 && cells[index + 1].innerHTML === '&nbsp;') {
    direction = 'right';
  } else if ((index + 1) > rowLength && cells[index - rowLength].innerHTML === '&nbsp;') {
    direction = 'top';
  } else if ((index + 1) <= rowLength * (rowLength - 1) && cells[index + rowLength].innerHTML === '&nbsp;') {
    direction = 'bottom';
  }
  item.style['z-index'] = 1;
  const top = device === 'computer' ? evt.pageY : evt.targetTouches[0].pageY;
  const left = device === 'computer' ? evt.pageX : evt.targetTouches[0].pageX;
  const { width } = item.getBoundingClientRect();
  const { height } = item.getBoundingClientRect();
  let isDeleteListener = false;

  function moveAt(pageX, pageY) {
    if (direction === 'left') {
      item.style.left = pageX - left <= 0 ? `${pageX - left}px` : '0px';
    } else if (direction === 'right') {
      item.style.left = pageX - left >= 0 ? `${pageX - left}px` : '0px';
    } else if (direction === 'bottom') {
      item.style.top = pageY - top >= 0 ? `${pageY - top}px` : '0px';
    } else if (direction === 'top') {
      item.style.top = pageY - top <= 0 ? `${pageY - top}px` : '0px';
    }
    const leftNow = item.style.left.slice(0, item.style.left.length - 2);
    const topNow = item.style.top.slice(0, item.style.top.length - 2);
    if (leftNow >= width || leftNow <= -width || topNow >= height || topNow <= -height) {
      isDeleteListener = true;
      item.onmouseup = null;
      item.style.left = 0;
      item.style.top = 0;
      item.style['z-index'] = 0;
      let directionNumber;
      if (direction === 'left') directionNumber = -1;
      else if (direction === 'right') directionNumber = 1;
      else if (direction === 'top') directionNumber = -rowLength;
      else if (direction === 'bottom') directionNumber = rowLength;
      cells[index + directionNumber].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    }
  }

  function onMouseMove(event) {
    const pageX = device === 'computer' ? event.pageX : event.targetTouches[0].pageX;
    const pageY = device === 'computer' ? event.pageY : event.targetTouches[0].pageY;
    moveAt(pageX, pageY);
    if (isDeleteListener) {
      document.removeEventListener(middle, onMouseMove);
    }
    isDeleteListener = false;
    isMove = true;
  }

  document.addEventListener(middle, onMouseMove);

  document.addEventListener(end, () => {
    const leftNow = item.style.left.slice(0, item.style.left.length - 2);
    const topNow = item.style.top.slice(0, item.style.top.length - 2);

    if (leftNow >= width / 2 || leftNow <= -width / 2
        || topNow >= height / 2 || topNow <= -height / 2) {
      isDeleteListener = true;
      item.onmouseup = null;
      item.style.left = 0;
      item.style.top = 0;
      item.style['z-index'] = 0;
      let directionNumber;
      if ((index + 1) % rowLength !== 1 && cells[index - 1].innerHTML === '&nbsp;') {
        direction = 'left';
      } else if ((index + 1) % rowLength !== 0 && cells[index + 1].innerHTML === '&nbsp;') {
        direction = 'right';
      } else if ((index + 1) > rowLength && cells[index - rowLength].innerHTML === '&nbsp;') {
        direction = 'top';
      } else if ((index + 1) <= rowLength * (rowLength - 1) && cells[index + rowLength].innerHTML === '&nbsp;') {
        direction = 'bottom';
      }
      if (direction === 'left') directionNumber = -1;
      else if (direction === 'right') directionNumber = 1;
      else if (direction === 'top') directionNumber = -rowLength;
      else if (direction === 'bottom') directionNumber = rowLength;
      cells[index + directionNumber].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
      stepsCount += 1;
      step.innerText = `Ходов: ${stepsCount}`;
      checkWin();
    } else {
      item.onmouseup = null;
      item.style.left = 0;
      item.style.top = 0;
      item.style['z-index'] = 0;
    }
    document.removeEventListener(middle, onMouseMove);
  });
}

let timerInterval;

function restart() {
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].remove();
  }
  createField();
  timer = 0;
  document.querySelector('.clock').innerText = '00:00:0';
  stepsCount = 0;
  step.innerHTML = `Ходов: ${stepsCount}`;
  if (document.querySelector('.switcher').innerText === 'Стоп') {
    document.querySelector('.switcher').innerText = 'Старт';
    document.querySelector('.container').classList.add('pause');
    clearInterval(timerInterval);
  }
  modal.classList.remove('active');
}

document.querySelectorAll('.size').forEach((item) => {
  item.addEventListener('click', () => {
    if (item.classList.contains('three')) {
      rowLength = 3;
      restart();
    } else if (item.classList.contains('four')) {
      rowLength = 4;
      restart();
    } else if (item.classList.contains('five')) {
      rowLength = 5;
      restart();
    } else if (item.classList.contains('six')) {
      rowLength = 6;
      restart();
    } else if (item.classList.contains('seven')) {
      rowLength = 7;
      restart();
    } else if (item.classList.contains('eight')) {
      rowLength = 8;
      restart();
    }
  });
});

document.querySelector('.save').addEventListener('click', () => {
  const array = [];
  document.querySelectorAll('.cell').forEach((item) => {
    array.push(item.innerHTML);
  });
  localStorage.setItem('field', array);
  localStorage.setItem('timer', timer);
  localStorage.setItem('stepCount', stepsCount);
});

window.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });

document.querySelector('.result').addEventListener('click', () => {
  if (localStorage.getItem('results') === null) {
    const result = document.createElement('div');
    result.classList.add('results');
    result.innerHTML = `
    <div>результатов нет</div>
    <button class='closeResults'>закрыть</button>
    `;
    document.body.append(result);
    document.querySelector('.closeResults').addEventListener('click', () => {
      result.remove();
    });
  } else {
    const results = JSON.parse(localStorage.getItem('results'));
    const resultWindow = document.createElement('div');
    resultWindow.classList.add('results');
    results.forEach((item, index) => {
      const div = document.createElement('div');
      div.innerHTML = `<div>${index + 1}. Время: ${item.time}, Ходы: ${item.steps}</div>`;
      resultWindow.append(div);
    });
    const closeResults = document.createElement('button');
    closeResults.classList.add('closeResults');
    closeResults.innerHTML = 'закрыть';
    resultWindow.append(closeResults);
    document.body.append(resultWindow);
    closeResults.addEventListener('click', () => {
      resultWindow.remove();
    });
  }
});

menuButton.addEventListener('click', () => {
  modal.classList.add('active');
  if (document.querySelector('.switcher').innerText === 'Стоп') {
    clearInterval(timerInterval);
  }
});

document.querySelector('.close').addEventListener('click', () => {
  modal.classList.remove('active');
  if (document.querySelector('.switcher').innerText === 'Стоп') {
    timerInterval = setInterval(startTimer, 100);
  }
});


if (localStorage.getItem('field')) {
  createField(localStorage.getItem('field').split(','));
  timer = localStorage.getItem('timer') * 1;
  stepsCount = localStorage.getItem('stepCount') * 1;
  step.innerText = `Ходов: ${stepsCount}`;
} else {
  createField();
}

document.querySelector('.reset').addEventListener('click', () => {
  cells.forEach((item) => {
    item.remove();
  });
  createField();
  stepsCount = 0;
  step.innerText = `Ходов: ${stepsCount}`;
  timer = 0;
  cells.forEach((item, index) => {
    item.addEventListener('mousedown', (evt) => {
      drag(evt, item, index, 'computer');
    });
    item.addEventListener('touchstart', (evt) => {
      drag(evt, item, index, 'phone');
    });
    item.addEventListener('click', (evt) => {
      moveByClick(evt, item, index);
    });
  });
  if (document.querySelector('.switcher').innerText === 'Старт') {
    timerInterval = setInterval(startTimer, 100);
    document.querySelector('.switcher').innerText = 'Стоп';
    document.querySelector('.container').classList.remove('pause');
  }
});

document.querySelector('.switcher').addEventListener('click', () => {
  if (document.querySelector('.switcher').innerText === 'Стоп') {
    document.querySelector('.switcher').innerText = 'Старт';
    document.querySelector('.container').classList.add('pause');
    clearInterval(timerInterval);
    const array = [];
    document.querySelectorAll('.cell').forEach((item) => {
      array.push(item.innerText);
      item.remove();
    });
    createField(array);
  } else if (document.querySelector('.switcher').innerText === 'Старт') {
    document.querySelector('.switcher').innerText = 'Стоп';
    document.querySelector('.container').classList.remove('pause');
    timerInterval = setInterval(() => {
      timer += 100;
      let temporaryTimer = timer;
      let ms = temporaryTimer % 1000;
      ms = !ms ? '000' : ms;
      temporaryTimer = Math.floor(temporaryTimer / 1000);
      let sec = `${temporaryTimer % 60}`;
      sec = sec.length === 1 ? `0${sec}` : sec;
      temporaryTimer = Math.floor(temporaryTimer / 60);
      let min = `${temporaryTimer % 60}`;
      min = min.length === 1 ? `0${min}` : min;
      timerString = `${min}:${sec}:${ms}`;
      timerString = timerString.slice(0, timerString.length - 2);
      document.querySelector('.clock').innerText = timerString;
    }, 100);
    cells.forEach((item, index) => {
      item.addEventListener('mousedown', (evt) => {
        drag(evt, item, index, 'computer');
      });
      item.addEventListener('touchstart', (evt) => {
        drag(evt, item, index, 'phone');
      });
      item.addEventListener('click', (evt) => {
        moveByClick(evt, item, index);
      });
    });
  }
});
