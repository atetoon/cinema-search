let searchBar = document.querySelector(".searchBar");
let searchBtn = document.querySelector("#searchBtn");
let backBtn = document.querySelector("#backBtn");
let landingContainer = document.querySelector(".landing-container");
let movieContainer = document.querySelector(".movie-container");
let posterStyle = document.querySelector("#poster-style");
let suggestion = document.querySelectorAll(".suggestion");
let leftPoster = document.querySelector(".left-poster");
let ratings = document.querySelector("#ratings");
let genre = document.querySelector("#genre");
let title = document.querySelector("#title");
let miniDetails = document.querySelector("#mini-details");
let description = document.querySelector("#description");

let img = document.createElement("img");

let movieName;
let movie;

function searchHandler(){
    movieName = searchBar.value;
    fetchMovie(movieName);
}

searchBtn.addEventListener("click", ()=>{
    searchHandler();
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
    });
});

async function fetchMovie(movieName){
    let result = await fetch(`https://www.omdbapi.com/?apikey=e3120137&t=${movieName}`);
    movie = await result.json();
    renderMovie(movie);
}

function renderMovie(movie){
    hideLanding();
    movieDetails();
}


function hideLanding(){
    landingContainer.classList.add("hidden");
    movieContainer.classList.remove("hidden");
}


function showLanding(){
    landingContainer.classList.remove("hidden");
    movieContainer.classList.add("hidden");
    posterStyle.style.backgroundImage = "";
}

backBtn.addEventListener("click", ()=>{
    showLanding();
});

function movieDetails(){
    posterStyle.style.backgroundImage = `url(${movie.Poster})`;

    leftPosterFunc();
    img.src = `${movie.Poster}`
    img.alt = `${movie.Title} Poster`
    leftPoster.appendChild(img);

    ratings.innerText = `★ ${movie.imdbRating} /10 (${movie.imdbVotes})`;

    genre.innerText = `${movie.Genre}`;
    title.innerText = `${movie.Title}`;
    miniDetails.innerText = `${movie.Year} · ${movie.Runtime} · ${movie.Rated} · ${movie.Language}`;
    description.innerText = `${movie.Plot}`;
}



