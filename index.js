// URL endpoints for APIs
const OPENWEATHERMAP_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const TICKETMASTER_SEARCH_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

// Global variables 
let weatherObject;
let userCity;
let userTemp;
let chosenTemp;
let chosenDate;


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
    size: 40
  }
  $.getJSON(TICKETMASTER_SEARCH_URL, query, callback);
}


// API callback functions 
function displayOpenWeatherMap(data) {
  console.log('displayOpenWeatherMap is working');
  $('.js-current-weather-result').html(renderWeatherResult(data));
  const results = (getThreeAndNineTime(data)).map((item) => renderDatesandHour(item));
  $('.js-search-form').hide();
  $('.city-result').html((`${userCity.toUpperCase()} <a class="different-city-text" href="index.html"><div>or try a different city</div></a>`));
  $('.js-weather-results').html(results);
}


function displayTicketmaster(data) {
  console.log('displayTicketmaster is working');
  const filterEvents = filterEventsforChosenDate(chosenDate,data._embedded.events);
  if (filterEvents.length > 0) {
    const results = filterEvents.map((item) => renderTicketmasterResult(item));
    $('.js-events-results').html(results);
  } else {
    const noEvent =`
    <div>
    <p>Sorry, we couldn't find any events that match that criteria</p>
    </div>`;
    $('.js-events-results').html(noEvent);
  }
}


// functions that render HTML 
function renderWeatherResult(result) {
  console.log('renderWeatherResult is working');
  return `
  <div class="current-temp">
  The current weather is ${result.list[0].main.temp}°F. Choose a date and time below.
  </div>
  <div>`
  ;
}


function renderDatesandHour(result) {
  console.log('renderDatesandHour is working');
  userTemp = result.main.temp;
  console.log(result);
  return `
  <div class="single-day-detail" data-temp="${userTemp}" data-date="${getDate(result.dt_txt)}"><span class="single-day-date">${getDate(result.dt_txt)}</span> ${timeConverter(getHours(result.dt_txt))}
  </div>
  `;
}


function renderTicketmasterResult(result) {
  console.log('renderTickermasterResult is working');
  console.log(result);
    return `
    <a href=${result.url} target='_blank'>
    <div class='event-result' class='column-fourth'> ${result.name}
    <img class="event-result-image" src="${result.images[0].url}">
    </div></a>`;
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


// must pass entire events object
function filterEventsforChosenDate(date,events) {
  console.log('filterEventsforChosenDate is working')
  return events.filter((event) => {
    // console.log(event.dates.start.localDate, date);
    return date == event.dates.start.localDate;
  })
}


// event handler functions 
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val('');
    userCity = query;
    $('.intro-message').hide();
    $('.intro-image').hide();
    getDataFromWeatherApi(query, displayOpenWeatherMap);
  });
  console.log('watchSubmit is working');
}


function chooseDate() {
console.log('chooseDate is working');
$('.js-weather-results').on('click','.single-day-detail',function() {
  $('.js-current-weather-result').hide();
  $('.js-weather-results').html(this);
  chosenTemp = $(this).data("temp");
  chosenDate = $(this).data("date");
  $('.js-weather-message').html(renderTempExpression(chosenTemp));
  getDataFromTicketmasterApi(userCity, displayTicketmaster);
});
}


// main function
function handleWeathermendApp() {
  watchSubmit();
  chooseDate();
}

$(handleWeathermendApp);



