// Описан в документации
import flatpickr from 'flatpickr';
// Дополнительный импорт стилей
import 'flatpickr/dist/flatpickr.min.css';
// импор библиотеки уведомлений
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// инициализация узлов
const dataTimeInputEl = document.querySelector('#datetime-picker');
const dataStartBtnEl = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// переменная для записи выбранной даты в миллисекундах
let finishTimeCount = 0;
// записываем отсчитываемое время
let countDown = null;
// записываем разницу между текущим и отсчитываем (наши показания секундомера)
let difference = 0;

updateCountValue();

flatpickr(dataTimeInputEl, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    //   приводим выбранную дату в миллисекунды и записываем в переменную
    finishTimeCount = selectedDates[0].getTime();

    dataStartBtnEl.disabled = false;
    //   если выбраная дата уже прошла, то кнопка старт не активна, выводим предупреждение
    if (finishTimeCount < Date.now()) {
      dataStartBtnEl.setAttribute('disabled', true);
      Notify.failure('Please choose a date in the future');
    }
  },
});

// добавляем слушателя на кнопку старт и запускаем функцию отсчета
dataStartBtnEl.addEventListener('click', onStartCouter);

// для запуска и записи отсчитываемого времени
function onStartCouter() {
  countDown = setInterval(updateCountValue, 1000);
  dataStartBtnEl.setAttribute('disabled', true);
  Notify.success('The countdown has begun!');
}

// рассчитываем разницу во времени и выводим на странцу
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

// функция конвертации даты
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

//Принимает число, приводит к строке и добавляет в начало 0 если число меньше 2-х знаков
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}