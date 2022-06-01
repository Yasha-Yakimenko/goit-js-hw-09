const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const bodyElem = document.querySelector('body');

stopBtn.disabled = true;

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;  
    timerId = setInterval(colorSwitcher, 1000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(timerId);
    startBtn.disabled = false;
    stopBtn.disabled = true;
});
 
function colorSwitcher() {
    bodyElem.style.backgroundColor = getRandomHexColor();
  }

  function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }