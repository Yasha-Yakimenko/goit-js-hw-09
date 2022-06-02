import flatpickr from 'flatpickr';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'flatpickr/dist/flatpickr.min.css';

const dataTimeInputEl = document.querySelector('#datetime-picker');
const dataStartBtnEl = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let finishTimeCount = 0;
let countDown = null;
let difference = 0;

updateCountValue();

flatpickr(dataTimeInputEl, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    finishTimeCount = selectedDates[0].getTime();

    dataStartBtnEl.disabled = false;
    if (finishTimeCount < Date.now()) {
      dataStartBtnEl.setAttribute('disabled', true);
      Notify.failure('Please choose a date in the future');
    }
  },
});

dataStartBtnEl.addEventListener('click', onStartCouter);

function onStartCouter() {
  countDown = setInterval(updateCountValue, 1000);
  dataStartBtnEl.setAttribute('disabled', true);
  Notify.success('The countdown has begun!');
}

function updateCountValue() {
  const nowTime = new Date().getTime();
  difference = finishTimeCount - nowTime;

  if (difference < 0) {
    dataStartBtnEl.setAttribute('disabled', true);
    clearInterval(countDown);
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(difference);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
