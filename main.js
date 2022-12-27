import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((e) => {
      console.error(e);
      alert("Error getting weather.");
    });
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);

  document.body.classList.remove("blurred");
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

function renderCurrentWeather(current) {
  document.querySelector("[data-current-temp]").textContent =
    current.currentTemp;
  document.querySelector("[data-current-high]").textContent = current.highTemp;
  document.querySelector("[data-current-icon]").src = getIconUrl(
    current.iconCode
  );
  document.querySelector("[data-current-fl-high]").textContent =
    current.highFeelsLike;
  document.querySelector("[data-current-wind]").textContent = current.windSpeed;
  document.querySelector("[data-current-low]").textContent = current.lowTemp;
  document.querySelector("[data-current-fl-low]").textContent =
    current.lowFeelsLike;
  document.querySelector("[data-current-precip]").textContent = current.precip;
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat("en-AU", { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), {
      parent: element,
    });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}
