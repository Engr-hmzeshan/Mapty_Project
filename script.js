"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
// Project Planning and devolpment
//---Plan the Project--//
// 1) User Stories
// We sum-up all intensions of user about project(Applications funcationality)
// a. i want to see my running workout in different location with time steps/min etc to evaluate the routene
// b. i want to see my cycling workout in different location with time speed etc to evaluate the routene
// c. See Workout list in glance(on-click see that specific workout)
// d. i want to use these info even after i logout from app
// e. See my workout on maps

// 2) Features
// Extract the desired output from user stories
// a.(sol) Format of inputs for steps, time, distance etc
// a.(sol) map to display the workout
// a.(sol) current location(geolocation) to get the current location
// b.(sol) Format of inputs for steps, time, distance etc for cycling rest are same
// c.(sol) display all workout in a list
// d.(sol) Store info in browser APi to watch this later
// e. Display all data on maps
// 3) Flow chart
// Make a flow chart of how our code and features worked to gather
// 4) Architecture(Most Important)
// Organize the code to make it readable and stable
//---Devolpment--//

// Implementation of our plan
// 1. Geolocation(current position)
let mapEvent, map;
navigator.geolocation.getCurrentPosition(
  function (position) {
    // i) Getting coordinates of current location
    // Destructuring objects
    const {
      coords: { latitude, longitude },
      timestamp,
    } = position;
    // Just for fun
    // const now = new Date(timestamp);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    console.log(latitude, longitude, new Date(timestamp));
    // ii) Link it with map using Leaflet API
    // L is a name space  as intel API and map inside '' is an html doc having id with same name
    const coordinates = [latitude, longitude];
    map = L.map("map").setView(coordinates, 13);
    console.log(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    // This method is inherited in map object
    map.on("click", function (mapEv) {
      // console.log(mapEvent);
      mapEvent = mapEv;
      form.classList.remove("hidden");
      inputDistance.focus();
    });
  },
  function () {
    alert("Could not get your location");
  }
);

// iv) Render input form when user click
// When we click on enter button / submit then the marker is showed
form.addEventListener("submit", function (e) {
  // Prevent page from loading when hit enter
  e.preventDefault();
  const { lat, lng } = mapEvent.latlng;
  // iii) Marker add
  // We can customise our marker icon
  let myIcon = L.icon({
    iconUrl: "icon.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });
  L.marker([lat, lng], {
    title: "Location",
    // icon: myIcon,
  })
    .addTo(map) // Add marker to map
    .bindPopup(
      // create and bind popup with map
      L.popup({
        // create a new popup object to add options
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});
