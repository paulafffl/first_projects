// Foursquare API Info
const clientId = 'OHDZY41B4OFBA4EYZHFLF3EEL1BCJRTO1RE5GJRYP0BJHDL5';
const clientSecret = 'TDMD0JJ2I14LSV31V4J51SCLUJVVWBIWFBFNS34V4IMHN50M';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const urlPhotosPrefix = 'https://api.foursquare.com/v2/venues/';

// OpenWeather Info
const openWeatherKey = 'bc46105a9626b8b41639f2e08feffb0a';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url + city + '&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180401';
  try {
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(venues);
      return venues;
    }
  } catch (error) {
    console.log(error);
  }
}

// Add AJAX functions here:
const getPhotoUrl = async (venue) => {
  const city = $input.val();
  const urlToFetch = urlPhotosPrefix + venue.id + '/photos' + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20180401';
  try {
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      const photo = jsonResponse.response.photos.items[0];
      const photoUrl = photo.prefix + '200' + photo.suffix;
      return photoUrl;
    }
  } catch (error) {
    console.log(error);
  }
}

const getForecast = async () => {
  const urlToFetch = weatherUrl + '?&q=' + $input.val() + "&APPID=" + openWeatherKey;
  try {
    const response = await fetch(urlToFetch);
    if(response.ok){
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse;
    }
  } catch(error) {
    console.log(error);
  }
}

// Render functions
const renderVenues = (venues) => {
  let arrayAuxIndex = [];
  for (let i = 0; i < 10; i++) {
   arrayAuxIndex.push(i);
  }
  $venueDivs.forEach(($venue, index) => {
    // Add your code here:
    let randomIndex = Math.floor(Math.random() * arrayAuxIndex.length);
    const venue = venues[arrayAuxIndex[randomIndex]];
    arrayAuxIndex.splice(randomIndex,1);
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
    getPhotoUrl(venue).then(photoUrl => {
      let venueContent =  createVenueHTML(venue.name,venue.location,venueImgSrc,photoUrl); 
      $venue.append(venueContent);
    });
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
  const weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)