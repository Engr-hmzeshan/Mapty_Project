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

// 1. The first thing that needs to be stored and used is data(i.e time distance, pace, steps/min, elev gain)
// 2. We made a parent class to store the common properties and methods and a child classes to store relevent specific class
// 3.
// Implementing the structure/architechure of the app for organizing the code
// . All events should be seperate, common method or properties given to parents, and new additional properties given to child class
//-----FIRST Version-----/////////
/*
// let mapEvent, map;
// class App {
//   // Make private properties inside class
//   #mapEvent;
//   #map;
//   constructor() {
//     // When the code is running and a new object/instance create then constructor function immediately called
//     this._getPosition();
//     // iv) Render input form when user click
//     // When we click on enter button / submit then the marker is showed
//     form.addEventListener("submit", this._showForm.bind(this));

//     inputType.addEventListener("change", this._toggleElevationField.bind(this));
//   }
//   // i) Getting coordinates of current location
//   _getPosition() {
//     navigator.geolocation.getCurrentPosition(
//       this._loadMap.bind(this), // here this is a regular function call and not the method so we have to set manually the this keyword
//       function () {
//         alert("Could not get your location");
//       }
//     );
//   }
//   _loadMap(position) {
//     // console.log("position", position);
//     const {
//       coords: { latitude, longitude },
//       // Destructuring position objects
//       timestamp,
//     } = position;
//     console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
//     console.log(latitude, longitude, new Date(timestamp));
//     // ii) Link it with map using Leaflet API
//     // L is a name space  as intel API and map inside '' is an html doc having id with same name
//     const coordinates = [latitude, longitude];
//     this.#map = L.map("map").setView(coordinates, 13);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.#map);
//     // This method is inherited in map object
//     this.#map.on("click", function (mapEv) {
//       // console.log(mapEvent);
//     });
//   }
//   _showForm(e) {
//     // Prevent page from loading when hit enter
//     e.preventDefault();
//     const { lat, lng } = this.#mapEvent.latlng;
//     // iii) Marker add
//     // We can customise our marker icon
//     let myIcon = L.icon({
//       iconUrl: "icon.png",
//       iconSize: [38, 95],
//       iconAnchor: [22, 94],
//       popupAnchor: [-3, -76],
//     });
//     L.marker([lat, lng], {
//       title: "Location",
//       // icon: myIcon,
//     })
//       .addTo(this.#map) // Add marker to map
//       .bindPopup(
//         // create and bind popup with map
//         L.popup({
//           // create a new popup object to add options
//           maxWidth: 250,
//           minWidth: 100,
//           autoClose: false,
//           closeOnClick: false,
//           className: "running-popup",
//         })
//       )
//       .setPopupContent("Workout")
//       .openPopup();
//   }
//   _toggleElevationField() {
//     // Select the closest parent and add toggle class
//     inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
//     inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
//   }
//   _newWorkout() {}
// }
// const app = new App();
// // app._getPosition();
 
*/
///-----Second Version(Updated Class App---//
// Class Functionality
class App {
  #map;
  #mapEvent;
  // Page Reload Evet first call on constructor
  constructor() {
    // Get current position
    this.getPosition();

    // click on map should call at the begining so placed it in constructor
    // The this keyword in event handler is attached to dump element on which handler is attached
    // But we need the App object itself so we use bind method
    form.addEventListener("submit", this.newWorkout.bind(this));

    // Toggle event load
    // Here we do not need the this bind method cause no this keyword used in function body
    inputType.addEventListener("change", this.toggleElevationField);
  }
  // Get Position Coords
  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Here bind method return a function with same body and point the this keyword to that fn
        // Without the bind method it is just a regular call function in strict mode it is point to undefined
        this.loadMap.bind(this),
        function () {
          alert("Could not get your location");
        }
      );
    }
  }
  // Render Map using coords
  loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 17);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords).addTo(map).bindPopup("Location").openPopup();

    this.#map.on("click", this.showForm.bind(this));
  }
  // Click on Map
  showForm(mapEv) {
    this.#mapEvent = mapEv;
    // L.marker([lat, lng]).addTo(map).bindPopup("Marker").openPopup();
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  // Input field toggle
  toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }
  // Submit form
  newWorkout(e) {
    e.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
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
  }
}
const newPosition = new App();
console.log(newPosition);
// Get location
// newPosition.getPosition();
