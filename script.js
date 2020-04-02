const rowLength = 4;
const cells = document.querySelectorAll('.cell');
let isMove = false;

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
  item.addEventListener('mousedown', (evt)=>{drag(evt, item,index, 'computer')})
  item.addEventListener('touchstart', (evt)=>{drag(evt, item,index, 'phone')})
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