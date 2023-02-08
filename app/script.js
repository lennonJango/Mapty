"use strict";

//Area para testes;

//let map, mapEvent;

// navigator.geolocation.getCurrentPosition(function (e) {
//   const { latitude } = e.coords;
//   const { longitude } = e.coords;
//   console.log(` https://www.google.com/maps/@-${latitude},${longitude},15z`);

//   const coords = [latitude, longitude];
//   // Mapa antigo
//   // var map = L.map("map").setView(coords, 13);

//   // L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//   //   attribution:
//   //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   // }).addTo(map);

//   // L.marker(coords)
//   //   .addTo(map)
//   //   .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
//   //   .openPopup();

//   //Novo mapa

//   map = L.map("map").setView(coords, 14);

//   var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 18,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   }).addTo(map);

//   //Marcador que marca a minha localização atual através do navigator.geolocation
//   L.marker(coords)
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         autoClose: false,
//         minWidth: 100,
//         closeOnClick: false,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Sua localização actual")
//     .openPopup()
//     .closePopup();

//   L.geoJson(coords).addTo(map);

//   map.on("click", function (mapE) {
//     mapEvent = mapE;
//     form.classList.remove("hidden");
//     inputDistance.focus();

//     //
//   }),
//     function () {
//       alert("we cant find your location");
//     };
// });

// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   //Limpado os inputs
//   limparInputs();

//   // Mostrado o marcador na tela
//   const { lat, lng } = mapEvent.latlng;
//   console.log(mapEvent);

//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         autoClose: false,
//         minWidth: 100,
//         closeOnClick: false,
//         className: "running-popup",
//       })
//     )
//     .openPopup()
//     .setPopupContent("Sua corrida");
//   L.geoJson([lat, lng]).addTo(map);
// });

//Limpar todos inputs
// const limparInputs = function () {
//   inputDistance.value =
//     inputCadence.value =
//     inputDuration.value =
//     inputElevation.value =
//       "";
// };

// //Mudar de corrida a pe para ciclismo
// inputType.addEventListener("change", function (e) {
// e.preventDefault();

// inputElevation.closest(".form__row").classList.toggle("form__row--hidden");

// inputCadence.closest(".form__row").classList.toggle("form__row--hidden");

// });
