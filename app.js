const selectGenre = document.getElementById("genres");
let genre;
const startYear = document.getElementById("start-year").value || 2000;
const endYear = document.getElementById("start-year").value || 2022;
const btn = document.querySelector(".btn-submit");
const inputsDiv = document.querySelector(".inputs");
const container = document.querySelector(".container");
const movieDiv = document.querySelector(".movie-div");
const movies = [];
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "923d006a52msh5a31f2d37441848p14843djsnbd98e20d5b0c",
    "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
  },
};

// Load generes
getAvailableGenres();
// Get choosen genre
selectGenre.addEventListener("change", function (event) {
  genre = event.target.value;
});

btn.addEventListener("click", function () {
  let url = `https://moviesdatabase.p.rapidapi.com/titles?endYear=${endYear}&startYear=${startYear}&genre=${genre}`;
  inputsDiv.style.display = "none";
  btn.style.display = "none";
  addSpinner();

  getData(url)
    .catch((e) =>
      inputsDiv.appendChild(
        document.createTextNode("Something went wrong please try again")
      )
    )
    .then(function () {
      const random = Math.floor(Math.random() * movies.length);
      const movie = movies[random];
      addMovieDetails(movie);
    });
});

// Get available genres
function getAvailableGenres() {
  fetch("https://moviesdatabase.p.rapidapi.com/titles/utils/genres", options)
    .then((response) => response.json())
    .then((response) => {
      response.results.slice(1).forEach((element) => {
        const genre = document.createElement("option");
        genre.textContent = element;
        genre.className = "option";
        genre.value = element;
        selectGenre.appendChild(genre);
      });
    });
}
// Get Movies list
function getData(url) {
  const promise = fetch(url, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      let urlBase = "https://moviesdatabase.p.rapidapi.com/";

      if (response.page == 11) return response;

      response.results.forEach((r) => {
        movies.push(r);
      });

      if (response.next) {
        return getData(`${urlBase}${response.next}`);
      }
    });

  return promise;
}
// Append movies to the page
function addMovieDetails(movie) {
  removeSpinner();

  const movieName = document.createElement("h2");
  movieName.className = "movie-name";
  movieName.textContent = `${movie["titleText"]["text"]} ${movie["releaseYear"]["year"]}`;
  movieDiv.appendChild(movieName);

  if (movie["primaryImage"]) {
    const movieImg = document.createElement("img");
    movieImg.className = "movie-img";
    movieImg.src = movie["primaryImage"]["url"];
    movieDiv.appendChild(movieImg);
  }
  const movieURL = document.createElement("a");
  movieURL.className = "movie-url";
  movieURL.textContent = "IMDB";
  movieURL.href = `https://www.imdb.com/title/${movie["id"]}`;

  movieDiv.appendChild(movieURL);
  const reload = document.createElement("a");
  reload.href = "#"; // To do
  reload.textContent = "reload";
  movieDiv.appendChild(reload);
}

function addSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "loading";
  container.appendChild(spinner);
}

function removeSpinner() {
  const spinner = document.getElementById("loading");
  spinner.remove();
}
