"use strict";

// Elementos selecionados
const form = document.querySelector(".form");
const containerWorkOuts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// The class App contains the necessary elements what we gonna use for our application.
class App {
  #mapEvent;
  #map;
  #workOut = [];
  #mapZoomLevel = 14;
  // this is a constructor for our application
  constructor() {
    // Obtém a localização do usuário
    this._getPosition();
    //Obter os dados do workout do armazenamento local
    this._getLocalStorage();
    // Apaga os dados do workout se o numero de workouts for maior que 4
    this._reset();
    // Eventos
    form.addEventListener("submit", this._newNetwork.bind(this));
    inputType.addEventListener("change", this._toggleElevationField.bind(this));
    containerWorkOuts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    //Codigo que recebe a localização actual do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("We can not find your location");
        }
      );
    }
  }

  _loadMap(position) {
    //Codigo que le o mapa usando a API leaflet
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    //Novo mapa

    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    //Marcador que marca a minha localização atual através do navigator.geolocation
    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          autoClose: false,
          minWidth: 100,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Sua localização actual")
      .openPopup()
      .closePopup();

    L.geoJson(coords).addTo(this.#map);
    this.#map.on("click", this._showForm.bind(this));
    //Marcadores do mapa
    this.#workOut.forEach((work) => {
      this._renderWorkoutMaker(work);
    });
  }

  _setLocalStorage() {
    localStorage.setItem("workout", JSON.stringify(this.#workOut));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workout"));

    if (!data) return;
    this.#workOut = data;
    this.#workOut.forEach((work) => {
      this._renderWorkout(work);
    });
  }
  _newNetwork(e) {
    e.preventDefault();

    //Pegar os dados do formulário
    const { lat, lng } = this.#mapEvent.latlng;
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    let workOut;
    // Verificar se os dados são validos
    // Este método verificá se os inputs são validos
    const validarInputs = (...inputs) =>
      inputs.every((e) => Number.isFinite(e));

    const conditionInput = (...input) =>
      input.every((e) => Number.isFinite(e) > 0);
    //Se a atividade for correr , criar Object running
    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validarInputs(duration, distance, cadence) ||
        !conditionInput(duration, distance, cadence)
      ) {
        return alert(
          "Os dados tem que ser um numero e um numero maior que zero"
        );
      }

      workOut = new Running([lat, lng], distance, duration, cadence);
    }

    // Se a atividade for andar de bicicleta , criar Object cycle
    if (type === "cycling") {
      const elevationGain = +inputElevation.value;
      if (
        !validarInputs(duration, distance, elevationGain) ||
        !conditionInput(duration, distance)
      ) {
        return alert("Os dados tem que ser um numero e maior que zero");
      }
      workOut = new Cycling([lat, lng], distance, duration, elevationGain);
    }

    //Adicionar o novo object para um array
    this.#workOut.push(workOut);
    console.log(this.#workOut);
    //Limpado os inputs

    // Mostrado o marcador na tela
    this._renderWorkoutMaker(workOut);
    console.log(this.#mapEvent);

    // Colocado renderWorkout
    this._renderWorkout(workOut);

    // Limpa os inputs e faz desaparecer a form da nossa app
    this._hideForm();

    // Armazena a corrida feita no localStorage
    this._setLocalStorage();
  }
  _renderWorkout(workOut) {
    let html = `<li class="workout workout--${workOut.type}" data-id= "${
      workOut.id
    }">
    <h2 class="workout__title">${workOut.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workOut.type == "running" ? "🏃‍♂️" : " 🚴‍♀️"
      }</span>
      <span class="workout__value">${workOut.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workOut.duration}</span>
      <span class="workout__unit">min</span>
    </div> `;

    if (workOut.type === "running") {
      html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workOut.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
     </div>
     <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workOut.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`;
      form.insertAdjacentHTML("afterend", html);
    }

    if (workOut.type == "cycling") {
      html += `
       <div class="workout__details">
       <span class="workout__icon">⚡️</span>
       <span class="workout__value">${workOut.speed.toFixed(1)}</span>
       <span class="workout__unit">km/h</span>
      </div>
     <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workOut.elevationGain}</span>
      <span class="workout__unit">m</span>
      </div>
    </li> 
      `;

      form.insertAdjacentHTML("afterend", html);
    }
  }
  _renderWorkoutMaker(workOut) {
    L.marker(workOut.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          autoClose: false,
          minWidth: 100,
          closeOnClick: false,
          className: `${workOut.type}-popup`,
        })
      )
      .openPopup()
      .setPopupContent(
        `${workOut.type == "running" ? " 🏃‍♂️ " : " 🚴‍♀️ "}${workOut.description}`
      );
    L.geoJson(workOut.coords).addTo(this.#map);
  }
  // Método que mostram a form da nossa app
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }
  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";
    form.classList.add("hidden");
    form.getElementsByClassName.display = "none";
    setTimeout(() => (form.style.display = "grid"), 1000);
  }
  _toggleElevationField(e) {
    //Mudar de corrida a pe para ciclismo
    e.preventDefault();

    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");

    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _moveToPopup(e) {
    // Este método tem a funcionalidade de quando clicamos numa das nossas corridas ele dececionar a corrida para o mapa
    const workOutEl = e.target.closest(".workout");

    if (!workOutEl) return;
    const workOut = this.#workOut.find(
      (work) => work.id == workOutEl.dataset.id
    );

    this.#map.setView(workOut.coords, this.#mapZoomLevel, {
      Animation: true,
      pan: {
        duration: 1,
      },
    });
  }
  _reset() {
    if (this.#workOut.length >= 4) {
      localStorage.removeItem("workout");
      location.reload();
    }
  }
}

class WorkOut {
  id = (Date.now() + "").slice(-10);
  date = new Date();

  constructor(coords, distance, duration) {
    this.distance = distance;
    this.coords = coords; //Para as coordenadas nos iremos precisar de um array [latitude,longitude]
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const mouth = [ "Janeiro", "Fevereiro", "March","Abril", "Maio", "Junho",  "Julho", "Agosto",  "Setembro","Outubro","Novembro", "Dezembro",];
    this.dataDescription = this.date.getUTCDate();

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} no dia ${this.dataDescription} de ${mouth[this.date.getMonth()]}`;

    return this.description;
  }
}

class Running extends WorkOut {
  // nome;
  cadence;
  type = "running";

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    // Os métodos mais importantes precisam de iniciar com o nosso constructor
    this.calcPace();
    //Método da class workOut que da acesso a descrição da data do treino
    this._setDescription();
  }

  // Calcula o tanto de minutos percorridos numa caminhada
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends WorkOut {
  //name;
  speed;
  type = "cycling";

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // Os métodos mais importantes precisam de iniciar com o nosso constructor
    this.calcSpeed();
    //Método da class workOut que da acesso a descrição da data do treino
    this._setDescription();
  }

  //Calcula o tanto de kmh percorridos
  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

const app = new App();
