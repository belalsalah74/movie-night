const selectGenre = document.getElementById("genres");
let genre;
const startYear = document.getElementById("start-year");
const endYear = document.getElementById("end-year");
const btn = document.querySelector(".btn-submit");
const inputsDiv = document.querySelector(".inputs");
const container = document.querySelector(".container");

const movies = [];
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "923d006a52msh5a31f2d37441848p14843djsnbd98e20d5b0c",
    "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
  },
};

endYear.value = new Date().getFullYear();
startYear.value = 2000;

// Load generes
getAvailableGenres();
// Get choosen genre
selectGenre.addEventListener("change", function (event) {
  genre = event.target.value;
});

btn.addEventListener("click", function () {
  if (genre) {
    let url = `https://moviesdatabase.p.rapidapi.com/titles?endYear=${endYear.value}&startYear=${startYear.value}&genre=${genre}`;
    inputsDiv.className = "inputs fade";

    setTimeout(() => {
      inputsDiv.remove();
      addSpinner();
    }, 300);

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
  } else {
    selectGenre.style.outline = "2px solid red";
  }
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
    .catch((e) => {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Something went wrong please try again";
      document.body.appendChild(errorMsg);
    })
    .then(function (response) {
      console.log(response);

      if (response.ok) {
        return response.json();
      } else {
        document.body.appendChild(
          document.createTextNode("Something went wrong please try again")
        );
      }
    })

    .then(function (response) {
      // console.log(response);

      let urlBase = "https://moviesdatabase.p.rapidapi.com/";

      response.results.forEach((r) => {
        movies.push(r);
      });
      while (response.page < 11) {
        if (response.next != "") {
          return getData(`${urlBase}${response.next}`);
        }
      }
      return response;
    });

  return promise;
}
// Append movies to the page
function addMovieDetails(movie) {
  const name = `${movie.titleText.text} (${movie.releaseYear.year})`;
  const img = movie.primaryImage ? movie.primaryImage.url : null;
  const url = `https://www.imdb.com/title/${movie.id}`;
  createMovieElement(name, url, img);
}

function createMovieElement(name, url, img = null) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "fade movie-div";
  removeSpinner();
  container.appendChild(movieDiv);
  movieDiv.classList.remove("fade");
  const movieName = document.createElement("h2");
  movieName.className = "movie-name";
  movieName.textContent = name;
  movieDiv.appendChild(movieName);

  if (img) {
    const movieImg = document.createElement("img");
    movieImg.className = "movie-img";
    movieImg.src = img;
    movieDiv.appendChild(movieImg);
  }
  const movieURL = document.createElement("a");
  movieURL.className = "movie-url";
  movieURL.innerHTML = `IMDB <img src="./arrow-up-right-from-square-solid.svg" class="arrow">`;
  movieURL.href = url;
  movieURL.target = "_blank";
  movieDiv.appendChild(movieURL);
  const reload = document.createElement("a");
  reload.className = "reload";
  reload.innerHTML = `Reload <img src="./rotate-right-solid.svg" alt="reload icon"> `;

  movieDiv.appendChild(reload);
  reload.onclick = () => {
    location.reload();
  };
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
