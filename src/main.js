import * as bootstrap from 'bootstrap';

const apiKey = "f9834d4be2b0f414292cfcbaafb78093";


const form = document.querySelector("form");
const input = document.querySelector("input[type='text']");
const movieCards = document.getElementById("movie-cards");
const pagination = document.getElementById("pagination");
const watchBtn = document.getElementById("watch-btn");
const queueBtn = document.getElementById("queue-btn");


let currentPage = 1;


form.addEventListener("submit", (event) => {
 event.preventDefault();
 searchMovies(input.value);
});


function searchMovies(query) {
 fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${currentPage}`)
   .then(response => response.json())
   .then(data => {
     displayMovies(data.results);
     displayPagination(data.total_pages);
   })
   .catch(error => console.error(error));
}


function displayMovies(movies) {
 movieCards.innerHTML = "";
 movies.forEach(movie => {
   const movieCard = document.createElement("div");
   movieCard.classList.add("movie-card");
   movieCard.innerHTML = `
     <img class="poster" src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
     <h2 class="title">${movie.title}</h2>
     <p class="info">${movie.release_date.substring(0, 4)} | ${movie.vote_average}/10</p>
   `;
   movieCards.appendChild(movieCard);
   movieCard.addEventListener("click", () => {
     displayMovieDetails(movie);
   });
 });
}


function displayPagination(numPages) {
 pagination.innerHTML = "";
 for (let i = 1; i <= numPages; i++) {
   const pageNumber = document.createElement("div");
   pageNumber.classList.add("page-number");
   pageNumber.textContent = i;
   if (i === currentPage) {
     pageNumber.classList.add("active");
   }
   pageNumber.addEventListener("click", () => {
     currentPage = i;
     searchMovies(input.value);
   });
   pagination.appendChild(pageNumber);
 }
}


function createModalContent(movie) {
  const modalContent = `
    <img class="modal-poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h2 class="modal-title">${movie.title}</h2>
    <p class="modal-info">Vote Count: ${movie.vote_count} | Popularity: ${movie.popularity} | Original Title: ${movie.original_title} | Genre: ${getGenres(movie.genre_ids)}</p>
    <p class="modal-about">${movie.overview}</p>
    <div class="modal-buttons">
      <button class="watch-btn">Watch</button>
      <button class="queue-btn">Queue</button>
    </div>
  `;
  return modalContent;
}

function createMovieModal(movie) {
  const modalContent = createModalContent(movie);
  const movieModal = document.createElement("div");
  movieModal.classList.add("movie-modal");
  movieModal.innerHTML = modalContent;
  document.body.appendChild(movieModal);
  const myModal = new bootstrap(".movie-modal", { closeBtn: true });
  // const watchButton = movieModal.querySelector(".watch-btn");
  // const queueButton = movieModal.querySelector(".queue-btn");
  // watchButton.addEventListener("click", () => {
  //   saveMovie(movie, "watched");
  // });
  // queueButton.addEventListener("click", () => {
  //   saveMovie(movie, "queue");
  // });
  myModal.show();
}

function displayMovieDetails(movie) {
  createMovieModal(movie);
}

function getGenres(genreIds) {
 const genres = {
   28: "Action",
   12: "Adventure",
   16: "Animation",
   35: "Comedy",
   80: "Crime",
   99: "Documentary",
   18: "Drama",
   10751: "Family",
   14: "Fantasy",
   36: "History",
   27: "Horror",
   10402: "Music",
   9648: "Mystery",
   10749: "Romance",
   878: "Science Fiction",
   10770: "TV Movie",
   53: "Thriller",
   10752: "War",
   37: "Western"
 };
 const genreNames = genreIds.map(id => genres[id]);
 return genreNames.join(", ");
}


function saveMovie(movie, list) {
 let savedMovies = JSON.parse(localStorage.getItem(list)) || [];
 savedMovies.push(movie);
 localStorage.setItem(list, JSON.stringify(savedMovies));
 alert(`${movie.title} has been added to your ${list} list!`);
}