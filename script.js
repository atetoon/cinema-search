let searchBar = document.querySelector(".searchBar");
let autocompleteList = document.querySelector("#autocompleteList");
let searchBtn = document.querySelector("#searchBtn");
let genreSelect = document.querySelector("#genreSelect");
let decadeSelect = document.querySelector("#decadeSelect");
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
let trailerBtn = document.querySelector("#trailerBtn");
let trailerModal = document.querySelector("#trailerModal");
let trailerFrame = document.querySelector("#trailerFrame");
let closeTrailerBtn = document.querySelector("#closeTrailerBtn");
let watchSection = document.querySelector("#watchSection");
let watchGrid = document.querySelector("#watchGrid");

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

let activeIndex = -1;

searchBar.addEventListener("keydown", (e)=>{
    const items = autocompleteList.querySelectorAll(".autocomplete-item");

    if(!items.length || autocompleteList.classList.contains("hidden")){
        if(e.key == "Enter"){
            searchHandler();
        }
        return;
    }

    if(e.key == "ArrowDown"){
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        highlightItem(items);
    } else if(e.key == "ArrowUp"){
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        highlightItem(items);
    } else if(e.key == "Enter"){
        e.preventDefault();
        if(activeIndex > -1){
            items[activeIndex].click();
        } else {
            searchHandler();
            hideAutocomplete();
        }
    } else if(e.key == "Escape"){
        hideAutocomplete();
    }
});

function highlightItem(items){
    items.forEach(item => item.classList.remove("active"));
    if(activeIndex > -1){
        items[activeIndex].classList.add("active");
        items[activeIndex].scrollIntoView({ block: "nearest" });
    }
}

let debounceTimer;
searchBar.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchBar.value.trim();

    if(query.length < 2){
        hideAutocomplete();
        return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

async function fetchSuggestions(query){
    try{
        const results = await getMovieSuggestions(query);
        renderAutocomplete(results);
    } catch(error){
        hideAutocomplete();
    }
}

function renderAutocomplete(results){
    autocompleteList.innerHTML = "";
    activeIndex = -1;

    if(!results.length){
        hideAutocomplete();
        return;
    }

    results.forEach(movie => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        const year = movie.release_date ? movie.release_date.slice(0,4) : "";
        item.innerText = year ? `${movie.title} (${year})` : movie.title;

        item.addEventListener("click", () => {
            hideAutocomplete();
            selectSuggestion(movie);
        });

        autocompleteList.appendChild(item);
    });

    autocompleteList.classList.remove("hidden");
}

async function selectSuggestion(tmdbMovie){
    try {
        document.activeElement.blur();
        errorMsgDeletion();
        searchBar.value = tmdbMovie.title;
        showLoading();
        const start = Date.now();

        const imdbID = await getIMDbID(tmdbMovie.id);
        movie = await getMovieByIMDb(imdbID);
        movie.tmdbId = tmdbMovie.id;
        movie.backdrop = tmdbMovie.backdrop_path;

        const elapsed = Date.now() - start;
        if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));

        hideLoading();
        renderMovie(movie);
    } catch (error) {
        hideLoading();
        errorMsgFunc();
        showLanding();
    }
}

function hideAutocomplete(){
    autocompleteList.classList.add("hidden");
    autocompleteList.innerHTML = "";
    activeIndex = -1;
}

document.addEventListener("click", (e) => {
    if(!searchBar.contains(e.target) && !autocompleteList.contains(e.target)){
        hideAutocomplete();
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
        const start = Date.now();

        movie = await searchMovie(movieName);

        const match = await getTMDBMatch(movie.Title, movie.Year);
        movie.tmdbId = match ? match.id : null;
        movie.backdrop = match ? match.backdrop_path : null;

        const elapsed = Date.now() - start;
        if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));

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
        const start = Date.now();

        const genreID = genreSelect.value;
        const decade = decadeSelect.value;
        const randomMovie = await getRandomMovieByGenre(genreID, decade);
        const imdbID = await getIMDbID(randomMovie.id);
        movie = await getMovieByIMDb(imdbID);
        movie.tmdbId = randomMovie.id;
        movie.backdrop = randomMovie.backdrop_path;

        const elapsed = Date.now() - start;
        if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));

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
    loadTrailer(movie);
    loadWatchProviders(movie);
}

async function loadTrailer(movie) {
    trailerBtn.classList.add("hidden");
    if (!movie.tmdbId) return;

    try {
        const key = await getTrailerKey(movie.tmdbId);
        if (key) {
            trailerBtn.dataset.key = key;
            trailerBtn.classList.remove("hidden");
        }
    } catch (e) { console.error(e); }
}

trailerBtn.addEventListener("click", () => {
    trailerFrame.src = `https://www.youtube.com/embed/${trailerBtn.dataset.key}?autoplay=1`;
    trailerModal.classList.remove("hidden");
});

closeTrailerBtn.addEventListener("click", () => {
    trailerModal.classList.add("hidden");
    trailerFrame.src = "";
});

async function loadWatchProviders(movie) {
    watchGrid.innerHTML = "";
    watchSection.classList.add("hidden");

    if (!movie.tmdbId) return;

    try {
        const providers = await getWatchProviders(movie.tmdbId);
        if (!providers) return;

        const all = [
            ...(providers.flatrate || []),
            ...(providers.rent || []),
            ...(providers.buy || [])
        ];

        const seen = new Set();
        const unique = all.filter(p => {
            if (seen.has(p.provider_id)) return false;
            seen.add(p.provider_id);
            return true;
        });

        if (!unique.length) return;

        renderWatchProviders(unique, providers.link);
        watchSection.classList.remove("hidden");
    } catch (e) { console.error(e); }
}

function renderWatchProviders(providers, link) {
    const icon = `
        <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    `;

    providers.forEach(p => {
        const item = document.createElement(link ? "a" : "div");
        if (link) {
            item.href = link;
            item.target = "_blank";
            item.rel = "noopener";
        }
        item.classList.add("watch-provider");
        item.innerHTML = `${icon}<span>${p.provider_name}</span>`;
        watchGrid.appendChild(item);
    });
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
