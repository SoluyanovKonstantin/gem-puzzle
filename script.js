let rowLength = 4;
let isMove = false;
let stepsCount = 0;
let array = [];
let timer = 0;
let cell = [];

let timerString = '00:00:0';

setInterval(() => {
  timer += 100;
  let temporaryTimer = timer;
  let ms = temporaryTimer % 1000;
  ms = !ms ? '000' : ms; 
  temporaryTimer = Math.floor(temporaryTimer/1000);
  let sec = temporaryTimer % 60 + '';
  sec = sec.length === 1 ? '0' + sec : sec;
  temporaryTimer = Math.floor(temporaryTimer/60);
  let min = temporaryTimer % 60 + '';
  min = min.length === 1 ? '0' + min : min;
  timerString = min + ':' + sec + ':' + ms;
  timerString = timerString.slice(0, timerString.length - 2);
  document.querySelector('.clock').innerText = timerString;
}, 100);

function shuffleArray(arr) {
  let copyArray = arr.slice(), temporaryValue;
  let currentIndex = arr.length;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex -= 1;

    temporaryValue = copyArray[currentIndex];
    copyArray[currentIndex] = copyArray[randomIndex];
    copyArray[randomIndex] = temporaryValue;
  }

  return copyArray;
}

function fillField(arr) {
  let clock = document.createElement('div');
  clock.classList.add('clock');
  clock.innerText = timerString;
  document.body.prepend(clock);
  let container = document.querySelector('.container');
  for (let i = 0; i < arr.length; i += 1) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = arr[i] !== 0 ? arr[i] : '&nbsp;';
    container.append(cell);
  }
  cells = document.querySelectorAll('.cell');
}

function createField(rowLength) {
  let arr = [];
  for (let i=0; i<rowLength*rowLength - 1; i += 1) {
    arr.push(i+1);
  }
  arr.push(0);
  let bool = true;
  while(bool) {
    arr = shuffleArray(arr);
    //проверка на проходимость
    let inv = 0;
    for (let i=0; i<arr.length; i += 1)
      if (arr[i])
        for (let j=0; j<i; j += 1)
          if (arr[j] > arr[i])
            inv += 1;
    for (let i=0; i<arr.length; i += 1)
      if (arr[i] === 0)
        inv += 1 + Math.floor(i / rowLength);
    
    bool = inv % 2 === 0 ? false : true;
  }
  fillField(arr);
}

createField(rowLength);
 
function drag(evt, item, index, device){
  const end = device === 'computer' ? 'mouseup' : 'touchend';
  const middle = device === 'computer' ? 'mousemove' : 'touchmove';
  let direction;
  if ((index+1) % rowLength !== 1 && cells[index - 1].innerHTML === '&nbsp;') {
    direction = 'left';
  } else if ((index+1) % rowLength !== 0 && cells[index + 1].innerHTML === '&nbsp;') {
    direction = 'right';      
  } else if ((index+1) > rowLength && cells[index - rowLength].innerHTML === '&nbsp;') {
    direction = 'top';      
  } else if ((index+1) <= rowLength*(rowLength-1) && cells[index + rowLength].innerHTML === '&nbsp;') {
    direction = 'bottom';      
  }
  item.style['z-index'] = 1;
  const top = device === 'computer' ? event.pageY : event.targetTouches[0].pageY;
  const left = device === 'computer' ? event.pageX : event.targetTouches[0].pageX;
  const width = item.getBoundingClientRect().width;
  const height = item.getBoundingClientRect().height;

  function moveAt(pageX, pageY) {
    if (direction === 'left') {
      item.style.left = pageX - left <= 0 ? pageX - left + 'px' : '0px';
    } else if (direction === 'right') {
      item.style.left = pageX - left >= 0 ? pageX - left + 'px' : '0px';
    } else if (direction === 'bottom') {
      item.style.top = pageY - top >= 0 ? pageY - top + 'px' : '0px';
    } else if (direction === 'top') {
      item.style.top = pageY - top <= 0 ? pageY - top + 'px' : '0px';
    }
    let leftNow = item.style.left.slice(0, item.style.left.length - 2);
    let topNow = item.style.top.slice(0, item.style.top.length - 2) 
    if (leftNow >= width || leftNow <= -width || topNow >= height || topNow <= -height) {
      document.removeEventListener(middle, onMouseMove);
      item.onmouseup = null;
      item.style.left = 0;
      item.style.top = 0;
      item.style['z-index'] = 0;
      if (direction === 'left') direction = -1; 
      else if (direction === 'right') direction = 1;
      else if (direction === 'top') direction = -rowLength; 
      else if (direction === 'bottom') direction = rowLength;
      cells[index + direction].innerHTML = item.innerHTML;
      item.innerHTML = '&nbsp;';
    }
  }
  
  function onMouseMove(event) {
    let pageX = device === 'computer' ? event.pageX : event.targetTouches[0].pageX;
    let pageY = device === 'computer' ? event.pageY : event.targetTouches[0].pageY;
    moveAt(pageX, pageY);
    isMove = true;
  }

  document.addEventListener(middle, onMouseMove);

  document.addEventListener(end, function() {
    document.removeEventListener(middle, onMouseMove);
    item.onmouseup = null;
    item.style.left = 0;
    item.style.top = 0;
    item.style['z-index'] = 0;
  });
};

cells.forEach((item, index)=>{
  item.addEventListener('mousedown', (evt)=>{
    drag(evt, item,index, 'computer');
  });
  item.addEventListener('touchstart', (evt)=>{
    drag(evt, item,index, 'phone');
  });
  item.addEventListener('click', (evt)=>{

    if (isMove) {
      isMove = false;
      return;
    }
    if ((index+1) % rowLength !== 1 && cells[index - 1].innerHTML === '&nbsp;') {
      item.style.animation = 'toLeft 0.5s';
      setTimeout(()=>{
        cells[index - 1].innerHTML = item.innerHTML;
        item.innerHTML = '&nbsp;';
        item.style.animation = '';
      }, 440);
    } else if ((index+1) % rowLength !== 0 && cells[index + 1].innerHTML === '&nbsp;') {
      item.style.animation = 'toRight 0.5s';
      setTimeout(()=>{
        cells[index + 1].innerHTML = item.innerHTML;
        item.innerHTML = '&nbsp;';
        item.style.animation = '';
      }, 440);
    } else if ((index+1) > rowLength && cells[index - rowLength].innerHTML === '&nbsp;') {
      item.style.animation = 'toTop 0.5s';
      setTimeout(()=>{
        cells[index - rowLength].innerHTML = item.innerHTML;
        item.innerHTML = '&nbsp;';
        item.style.animation = '';
      }, 440);
    } else if ((index+1) <= rowLength*(rowLength-1) && cells[index + rowLength].innerHTML === '&nbsp;') {
      item.style.animation = 'toDown 0.5s';
      setTimeout(()=>{
        cells[index + rowLength].innerHTML = item.innerHTML;
        item.innerHTML = '&nbsp;';
        item.style.animation = '';
      }, 440);
    }   
  });

  
});