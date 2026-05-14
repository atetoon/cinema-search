let searchBar = document.querySelector(".searchBar");
let searchBtn = document.querySelector("#searchBtn");
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
    movieName = searchBar.value;
    if(movieName !== "")
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
        errorMsgDeletion();
    });
});

async function fetchMovie(movieName){
    hideLanding();
    loadingScreen.classList.remove("hidden");
    let result = await fetch(`https://www.omdbapi.com/?apikey=e3120137&t=${movieName}&plot=full`);
    movie = await result.json();
    loadingScreen.classList.add("hidden");
    if(movie.Response==="True")
        renderMovie(movie);
    else{
        errorMsgFunc();
        showLanding();
    }
}

function renderMovie(movie){
    movieDetails();
}


function hideLanding(){
    console.log("hideLanding called", landingContainer, movieContainer);
    landingContainer.classList.add("hidden");
    movieContainer.classList.remove("hidden");
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

function movieDetails(){
    posterStyle.style.backgroundImage = `url(${movie.Poster})`;

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

window.addEventListener("scroll", ()=>{
    let scrollAmount = window.scrollY;

    posterStyle.style.transform = `scale(${1 + scrollAmount * 0.001})`;
});