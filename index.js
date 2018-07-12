// URL endpoints for APIs
const OPENWEATHERMAP_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const TICKETMASTER_SEARCH_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

let weatherObject;
let userCity;

// API GET functions
function getDataFromWeatherApi(city,callback) {
  // console.log(userCity);
  query = {
    apikey: '91308079cdcfca1bf0b4e6b74e0d6a7d',
    q: `${city}`,
    units: 'imperial'
  }
  $.getJSON(OPENWEATHERMAP_SEARCH_URL, query, callback);
}

function getDataFromTicketmasterApi(city,callback) {
  query = {
    apikey: 'ku9Z9ArGjW4QZRSdJoirA3mpsNKHLh6G',
    city: `${city}`,
    size: 30
  }
  $.getJSON(TICKETMASTER_SEARCH_URL, query, callback);
}


// callback functions 
function displayOpenWeatherMap(data) {
  console.log('displayOpenWeatherMap is working');
  $('.js-current-weather-result').html(renderWeatherResult(data));
  const results = (getThreeAndNineTime(data)).map((item) => renderDatesandHour(item));
  $('.js-search-form').hide();
  $('.city-result').html((`${userCity}`).toUpperCase());
  $('.js-weather-results').html(results);
}

function displayTicketmaster(data) {
  console.log('displayTicketmaster is working');
  console.log(data);
  const results = data._embedded.events.map((item) => renderTicketmasterResult(item));
  $('.js-events-results').html(results);
}


// functions that render HTML to be appended
function renderWeatherResult(result) {
  console.log('renderWeatherResult is working');
  return `
  <div>
  <p>The current weather is ${result.list[0].main.temp}°F</p>
  <div>Choose a date and time below<div>
  </div>`
  ;
}

function renderDatesandHour(result) {
  console.log('renderDatesandHour is working');
  return `
  <div class="single-event-detail" >
    <p>${result.main.temp}°F on ${getDate(result.dt_txt)} ${timeConverter(getHours(result.dt_txt))}</p>
  </div>
  `;
}

function renderTicketmasterResult(result) {
  console.log('renderTickermasterResult is working');
  return `
  <div class='column-fourth' class='result-events'>
  <p>${result.name}</p>
  </div>`
  ;
}


//other functions
function getThreeAndNineTime(result) {
  console.log('getThreeAndNineTime is working');
  const dates = result.list.filter(weatherItem => { 
    return getHours(weatherItem.dt_txt)=="09:00:00" || getHours(weatherItem.dt_txt)=="15:00:00" || getHours(weatherItem.dt_txt)=="21:00:00";
  });
  return dates;
}

function timeConverter(time) {
  if (time === "09:00:00") {
    return "in the morning"
  } else if (time === "15:00:00") {
    return "in the afternoon"
  } else {
    return "at night"
  }
}



function getDate(str) {
  return str.split(' ')[0];
}

function getHours(str) {
  return str.split(' ')[1];
}


function displayDayEvents() {
  // display all events on a single day
  // 
}

function filterEventsByWeather() {
  // 
   
}







// event handler functions 
function clickEvent() {
// will have JQuery selector on the single events
//
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val('');
    console.log(query);
    userCity = query;
    console.log(userCity);
    getDataFromWeatherApi(query, displayOpenWeatherMap);
    // getDataFromTicketmasterApi(query, displayTicketmaster)
  });
  console.log('watchSubmit is working');
}

$(watchSubmit);