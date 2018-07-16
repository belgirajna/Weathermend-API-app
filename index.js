// URL endpoints for APIs
const OPENWEATHERMAP_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const TICKETMASTER_SEARCH_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

let weatherObject;
let userCity;
let userTemp;


// API GET functions
function getDataFromWeatherApi(city,callback) {
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


// API callback functions 
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


// functions that render HTML block or single lines
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
  userTemp = result.main.temp;
  return `
  <div class="single-day-detail" >
    <p>${getDate(result.dt_txt)} ${timeConverter(getHours(result.dt_txt))}</p>
  </div>
  `;
}

function renderTicketmasterResult(result) {
  console.log('renderTickermasterResult is working');
  console.log(result.url);
  return `
  <a href=${result.url}>
  <div class='column-fourth' class='result-events'><p>${result.name}</p>
  </div>
  </div></a>`
  ;
}

function renderTempExpression(temp) {
  if (temp <= 16) {
    return "Brrrrr!! It's absolutely freezing out! Here's what we recommend for you.";
  } else if (temp > 16 && temp <= 36) {
    return "You should definitely pack up, it's pretty chilly outside. Here's what we recommend for you.";
  } else if (temp > 36 && temp <= 55) {
    return " The temperature outside is getting nice and cool. Here's what we recommend for you.";
  } else if (temp > 55 && temp <= 75) {
    return "Enjoy the excellent warm weather outside! Here's what we recommend for you.";
  } else if (temp > 75 && temp <= 85) {
    return "It's hot.... but not too hot. Here's what we recommend for you.";
  } else if (temp > 85 && temp <= 96) {
    return "Make sure you have some sunscreen because it's hot! Here's what we recommend for you.";
  } else if (temp > 96) {
    return "OH BOY, it's blazing outside!!! Stay hydrated! Here's what we recommend for you.";
  };
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
  if (time == "09:00:00") {
    return "in the morning"
  } else if (time == "15:00:00") {
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

// main function of the app 
function filterEventsforChosenDate(temp) {
  // display all events on a single day
  // 
}


// event handler functions 
function chooseDate() {
console.log('chooseDate is working');
$('.js-weather-results').on('click','.single-day-detail',function() {
  $('.js-current-weather-result').hide();
  $('.js-weather-results').html(this);
  console.log(this);
  getDataFromTicketmasterApi(userCity, displayTicketmaster);
});
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val('');
    userCity = query;
    $('.intro-message').hide();
    getDataFromWeatherApi(query, displayOpenWeatherMap);
    // getDataFromTicketmasterApi(query, displayTicketmaster);
  });
  console.log('watchSubmit is working');
}


// main function
function handleWeathermendApp() {
  watchSubmit();
  chooseDate();
}

$(handleWeathermendApp);