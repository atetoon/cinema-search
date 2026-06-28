let searchBar = document.querySelector(".searchBar");
let searchBtn = document.querySelector("#searchBtn");
let genreSelect = document.querySelector("#genreSelect");
let randomBtn = document.querySelector("#randomBtn");
let backBtn = document.querySelector("#backBtn");
let landingContainer = document.querySelector(".landing-container");
let movieContainer = document.querySelector(".movie-container");
let posterStyle = document.querySelector("#poster-style");
let suggestion = document.querySelectorAll(".suggestion");
let leftPoster = document.querySelector(".left-poster");
let ratingSpan = document.querySelector("#ratingSpan");
let votingSpan = document.querySelector("#votingSpan");
let genre = document.querySelector("#genre");
let movieTitle = document.querySelector("#title");
let miniDetails = document.querySelector("#mini-details");
let description = document.querySelector("#description");
let director = document.querySelector("#director");
let released = document.querySelector("#released");
let country = document.querySelector("#country");
let language = document.querySelector("#language");
let writer = document.querySelector("#writer");
let actors = document.querySelector("#actors");
let awards = document.querySelector("#awards");
let boxOffice = document.querySelector("#box-office");
let searchSection = document.querySelector(".search-section");
let loadingScreen = document.querySelector(".loading-screen");

let img = document.createElement("img");

let movieName;
let movie;

function searchHandler(){
    document.activeElement.blur();
    movieName = searchBar.value;
    if(movieName !== "")
        fetchMovie(movieName);
}

async function loadGenres() {
    try {
        const genres = await getGenres();
        populateGenres(genres);
    } catch (error) {
        console.error(error);
        showError("Unable to load genres.");
    }
}

loadGenres();

searchBtn.addEventListener("click", ()=>{
    searchHandler();
});

randomBtn.addEventListener("click", () => {
    randomMovieHandler();
});

searchBar.addEventListener("keydown", (e)=>{
    if(e.key == "Enter"){
       searchHandler();
    }
});

suggestion.forEach(span =>{
    span.addEventListener("click", ()=>{
        searchBar.value = span.innerText;
        searchHandler();
        errorMsgDeletion();
    });
});

async function fetchMovie(movieName) {
    try {
        errorMsgDeletion();
        showLoading();
        movie = await searchMovie(movieName);
        movie.backdrop = await getBackdrop(movie.Title, movie.Year);
        hideLoading();
        renderMovie(movie);
    } catch (error) {
        hideLoading();
        errorMsgFunc();
        showLanding();
    }
}

async function randomMovieHandler() {
    try {
        document.activeElement.blur();
        showLoading();
        const genreID = genreSelect.value;
        const randomMovie = await getRandomMovieByGenre(genreID);
        const imdbID = await getIMDbID(randomMovie.id);
        movie = await getMovieByIMDb(imdbID);
        movie.backdrop = randomMovie.backdrop_path;
        hideLoading();
        renderMovie(movie);
    }
    catch(error){
        hideLoading();
        showError(error.message);
    }
}

function renderMovie(movie){
    showMoviePage();
    leftPoster.innerHTML = "";
    movieDetails(movie);
}



function showLanding(){
    landingContainer.classList.remove("hidden");
    movieContainer.classList.add("hidden");
    posterStyle.style.backgroundImage = "";
    leftPoster.innerHTML = "";
    searchBar.value = "";
}

backBtn.addEventListener("click", ()=>{
    showLanding();
});

function movieDetails(movie){
    if(movie.backdrop){
        posterStyle.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop})`;
    } else{ posterStyle.style.backgroundImage = `url(${movie.Poster})`;
        }

    img.src = `${movie.Poster}`
    img.alt = `${movie.Title} Poster`
    leftPoster.appendChild(img);

    ratingSpan.innerText = `${movie.imdbRating}`;
    votingSpan.innerText = `(${movie.imdbVotes})`;


    genre.innerText = `${movie.Genre}`;
    movieTitle.innerText = `${movie.Title}`;
    miniDetails.innerText = `${movie.Year} · ${movie.Runtime} · ${movie.Rated} · ${movie.Language}`;
    description.innerText = `${movie.Plot}`;

    director.innerText = `${movie.Director}`;
    released.innerText = `${movie.Released}`;
    country.innerText = `${movie.Country}`;
    language.innerText = `${movie.Language}`;
    writer.innerText = `${movie.Writer}`;
    actors.innerText = `${movie.Actors}`;
    awards.innerText = `${movie.Awards}`;
    boxOffice.innerText = `${movie.BoxOffice}`;
}

function errorMsgFunc(){
    if(document.querySelector(".errorMsg"))return;
    let errorMsg = document.createElement("p");
    errorMsg.classList.add("errorMsg");
    errorMsg.innerText = `${searchBar.value} not found. Double-check the title and try again.`;
    searchSection.after(errorMsg);
}


searchBar.addEventListener("focus", ()=>{
    errorMsgDeletion();
});

function errorMsgDeletion(){
    let errorMsg = document.querySelector(".errorMsg");

    if(errorMsg)
        errorMsg.remove();
}


