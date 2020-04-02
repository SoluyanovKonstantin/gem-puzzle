const rowLength = 4;
const cells = document.querySelectorAll('.cell');
let isMove = false;

cells.forEach((item, index)=>{
  item.addEventListener('mousedown', (evt)=>{
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
    console.log(direction);
    item.style['z-index'] = 1;
    const top = evt.pageY;
    const left = evt.pageX;
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
      if (item.style.left >= )
    }
    
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      isMove = true;
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    document.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      item.onmouseup = null;
      item.style.left = 0;
      item.style.top = 0;
      item.style['z-index'] = 0;
    };
  })
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