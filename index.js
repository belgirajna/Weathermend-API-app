// URL endpoints for APIs
const OPENWEATHERMAP_SEARCH_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const TICKETMASTER_SEARCH_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';


function getDataFromWeatherApi(city,callback) {
  query = {
    apikey: '91308079cdcfca1bf0b4e6b74e0d6a7d',
    q: `${city}`,
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
  // renderResult(data);
  console.log('displayOpenWeatherMap is working');
  $('.js-weather-results').html(renderWeatherResult(data));
}

function displayTicketmaster(data) {
  // renderResult(data);
  console.log('displayTicketmaster is working');
  $('.js-events-results').html(renderTicketmasterResult(data));
}


// functions that create HTML to be appended
function renderWeatherResult(result) {
  console.log('renderWeatherResult is working');
  console.log(result);
  return `
  <div>
  <p>${result.list[0].main.temp}</p>
  </div>`
  ;
}

function renderTicketmasterResult(result) {
  console.log('renderTickermasterResult is working');
  console.log(result);
  return `
  <div>
  <p>${result._embedded.events[0].name}</p>
  </div>`
  ;
}


// main function 
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val('')
    getDataFromWeatherApi(query, displayOpenWeatherMap);
    getDataFromTicketmasterApi(query, displayTicketmaster)
  });
  console.log('watchSubmit is working');
}

$(watchSubmit);