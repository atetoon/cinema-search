const TMDB_API_KEY = "adaeda3e12534f74dc41f7ed870d35a2";
const OMDB_API_KEY = "e3120137&t";

// base url

const TMDB_BASE = "https://api.themoviedb.org/3";
const OMDB_BASE = "https://www.omdbapi.com/";


async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Request failed.");
    }

    return await response.json();
}
// TMDB GENRES

async function getGenres() {

    const url = `${TMDB_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}`;

    const data = await fetchJSON(url);

    return data.genres;
}

// genres fetch

function populateGenres(genres) {

    const select = document.getElementById("genreSelect");

    select.innerHTML = "";

    genres.forEach(genre => {

        const option = document.createElement("option");

        option.value = genre.id;
        option.textContent = genre.name;

        select.appendChild(option);

    });

}

// TMDB MOVIE MATCH (id + backdrop) BY TITLE/YEAR

async function getTMDBMatch(title, year = "") {

    const url =
        `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;

    const data = await fetchJSON(url);

    if (!data.results.length)
        return null;

    return data.results[0];
}

// random movie getter using TMDB

async function getRandomMovieByGenre(genreID, decade = "") {

    const page = Math.floor(Math.random() * 5) + 1;

    let dateFilter = "";
    if (decade) {
        dateFilter = `&primary_release_date.gte=${decade}-01-01&primary_release_date.lte=${+decade + 9}-12-31`;
    }

    const url =
        `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreID}&page=${page}&sort_by=popularity.desc&vote_count.gte=100${dateFilter}`;

    const data = await fetchJSON(url);

    if (!data.results.length) {
        throw new Error("No movies found.");
    }

    const randomIndex =
        Math.floor(Math.random() * data.results.length);

    return data.results[randomIndex];

}

// TMDB movie details

async function getTMDBMovie(movieID) {

    const url =
        `${TMDB_BASE}/movie/${movieID}?api_key=${TMDB_API_KEY}`;

    return await fetchJSON(url);

}

// GET iMDB id

async function getIMDbID(movieID) {

    const movie =
        await getTMDBMovie(movieID);

    return movie.imdb_id;

}

// trailer

async function getTrailerKey(tmdbId) {

    const url =
        `${TMDB_BASE}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`;

    const data = await fetchJSON(url);
    const vids = data.results.filter(v => v.site === "YouTube");

    if (!vids.length) return null;

    const ranked = [
        ...vids.filter(v => v.type === "Trailer" && v.official),
        ...vids.filter(v => v.type === "Trailer" && !v.official),
        ...vids.filter(v => v.type === "Teaser"),
        ...vids
    ];

    return ranked[0].key;
}

// where to watch

async function getWatchProviders(tmdbId) {

    const url =
        `${TMDB_BASE}/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`;

    const data = await fetchJSON(url);
    const results = data.results || {};

    return results["IN"] || results["US"] || null;

}

// oMDB search

async function searchMovie(title) {

    const url =
        `${OMDB_BASE}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;

    const movie =
        await fetchJSON(url);

    if (movie.Response === "False") {
        throw new Error(movie.Error);
    }

    return movie;

}

// oMDB BY IMDB ID

async function getMovieByIMDb(imdbID) {

    const url =
        `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${imdbID}`;

    const movie =
        await fetchJSON(url);

    if (movie.Response === "False") {
        throw new Error(movie.Error);
    }

    return movie;

}

// LOADING

function showLoading() {

    document
        .querySelector(".loading-screen")
        .classList.remove("hidden");

}

function hideLoading() {

    document
        .querySelector(".loading-screen")
        .classList.add("hidden");

}

// SCREEN SWITCHING

function showMoviePage() {

    document
        .querySelector(".landing-container")
        .classList.add("hidden");

    document
        .querySelector(".movie-container")
        .classList.remove("hidden");

}

function showLandingPage() {

    document
        .querySelector(".movie-container")
        .classList.add("hidden");

    document
        .querySelector(".landing-container")
        .classList.remove("hidden");

}


// ERROR

function showError(message) {

    alert(message);

}
