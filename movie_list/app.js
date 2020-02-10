// Blake | Zenen | Trevor
let answer = prompt("I have added this as part of my terminal git lab")
// Selectors
const movieShortList = document.querySelector('#movieShortList');
const movieHistoryTable = document.querySelector('#movieHistoryTable');
const movieHistoryTableBody = document.querySelector('#movieHistoryTableBody');
const addMovieForm = document.querySelector('#addMovieForm');
const addMovieButton = document.querySelector('#addMovieButton');
const clearMovieShortListButton = document.querySelector('#clearMovieShortListButton');
const filterMovieHistoryListForm = document.querySelector('#filterMovieHistoryListForm');
const autoCompleteOption = document.querySelector('#autoCompleteOption');


// Storage for movie lists
const LOCAL_STORE_LIST_KEY = 'LocalStore';
let movieHistoryListStore = JSON.parse(localStorage.getItem(LOCAL_STORE_LIST_KEY)) || [];
let movieHistoryShortListStore = [];
let movieDatabaseData = [];


// Fetch data from the movie database .json file
const movieDatabase = async search_movieDatabase => {
    const movieDatabaseResponse = await fetch('movie_database.json');
    movieDatabaseData = await movieDatabaseResponse.json()
};


// Add Movie Button function
addMovieButton.addEventListener('submit', e => {
    e.preventDefault();
    let movieNameFromForm = addMovieForm.value;
    if (movieNameFromForm == null || movieNameFromForm === '') return;
    movieNameFromForm = movieNameFromForm.trim();

    //construct a new movie item
    const movieNameListItem = createMovieShortListItem(movieNameFromForm);
    addMovieButton.value = null;
    movieHistoryShortListStore.push(movieNameListItem);

    // check if we already have this title in our history list and increment timesWatched if found
    if (addMovieCheckHistoryList(movieNameFromForm)){
        return;
    }

    // if the title name is the same as something in the database, push the database fields in and add 1 to the timesWatched
    if (addMovieCheckDatabaseData(movieNameFromForm)){
        return;
    }

    movieHistoryListStore.push(movieNameListItem);
    saveAndRender();
});

// Check if our movie is in our history list already and increment times_watched if found
function addMovieCheckHistoryList(movieName) {
    for (let movie of movieHistoryListStore) {
        if (movieName === movie.title) {
            localStorage.setItem(LOCAL_STORE_LIST_KEY, JSON.stringify(movie.times_watched += 1));
            saveAndRender();
            return true;
        }
    }

    return false;
}

// Check if our movie is in our movie database, and if found pass the data in to populate all the fields, increment times_watched
function addMovieCheckDatabaseData(movieName) {
    for (let movie of movieDatabaseData) {
        if (movieName === movie.title) {
            movieHistoryListStore.push(movie);
            localStorage.setItem(LOCAL_STORE_LIST_KEY, JSON.stringify(movie.times_watched = 1));
            saveAndRender();
            return true;
        }
    }
    return false;
}

// Clear Add Movie Form
function clearAddMovieForm() {
    document.querySelector("#addMovieForm").value = ''
}


// Clear Movies Short List Button function
clearMovieShortListButton.addEventListener('submit', e => {
    e.preventDefault();
    addMovieButton.value = null;
    movieHistoryShortListStore = [];
    renderMovieShortListContainer();
});


// Listener for filter search  ***** not yet implemented
filterMovieHistoryListForm.addEventListener('input', () =>
    searchHistory(filterMovieHistoryListForm.value));


// Search history for matches ***** not yet implemented
const searchHistory = async searchTitles => {
    let matches = movieHistoryListStore.filter(movie => {
        const regex = new RegExp('^${searchTitles}', 'gi');
        return title.match(regex);
    });
};


// Autocomplete for titles options
const autoCompletePanel = document.querySelector('.autoCompleteBox');

addMovieForm.addEventListener('keyup', function() {

    // filters from addMovieForm input, if less than 3 characters only find titles that start with input
    let input = addMovieForm.value.toLowerCase();
    autoCompletePanel.innerHTML = '';
    let suggestions = movieDatabaseData.filter(function(movie) {
        if (input.length <= 3){
            return movie.title.toLowerCase().startsWith(input);
        } else {
            return movie.title.toLowerCase().startsWith(input) + movie.title.toLowerCase().includes(input);
        }
    });

    // generates list options from database
    suggestions.forEach(function (suggested) {
        const option = document.createElement('option');
        option.value = suggested.title;
        option.innerHTML = suggested.title;
        autoCompletePanel.appendChild(option);
    });

    // Makes panel visible
    autoCompletePanel.style.visibility ='visible';

    if (input === '') {
        autoCompletePanel.innerHTML = '';
        autoCompletePanel.style.visibility ='hidden';
    }
});


// Repopulate New Movie form with selection from auto suggest
function getSelectedMovie(){
    addMovieForm.value = autoCompleteOption.value
}


// Create a history table row
function renderMovieHistoryTable() {
    clearElement(movieHistoryTableBody);

    let movieHistoryTableHtml = '';

    for(let movie of movieHistoryListStore) {
        if (movie.html_link.length !== 0) {
            movieHistoryTableHtml += '<tr><td>' + movie.title + '</td><td>' + movie.times_watched + '</td><td>' + movie.genre1 + ' ' + movie.genre2 + '</td><td>' + movie.director_name + '</td><td>' + movie.title_year + '</td><td>' + movie.imdb_score + '</td><td><a href="' + movie.html_link + '">Link</a></td></tr>';
        } else {
            movieHistoryTableHtml += '<tr><td>' + movie.title + '</td><td>' + movie.times_watched + '</td><td>' + movie.genre1 + ' ' + movie.genre2 + '</td><td>' + movie.director_name + '</td><td>' + movie.title_year + '</td><td>' + movie.imdb_score + '</td></tr>';
        }
    }
    movieHistoryTableBody.innerHTML = movieHistoryTableHtml;
}


// Dictionary add function
function createMovieShortListItem(title) {
    return {
        "director_name": "",
        "duration": "",
        "actor_2_name": "",
        "gross": "",
        "genre1": "",
        "genre2": "",
        "genre3": "",
        "genre4": "",
        "actor_1_name": "",
        "title": title,
        "html_link": "",
        "num_user_for_reviews": "",
        "country": "",
        "rating": "",
        "budget": "",
        "title_year": "",
        "imdb_score": "",
        "times_watched": 1
    }
}


// Commit list of movies to local storage, JSON
function localStorageSave() {
    localStorage.setItem(LOCAL_STORE_LIST_KEY, JSON.stringify(movieHistoryListStore));
}


// Clears out and then renders the movie short list container
function renderMovieShortListContainer() {
    clearElement(movieShortList);
    movieHistoryShortListStore.forEach(movieHistoryShortListStore => {
        const listElement = document.createElement('li');
        listElement.dataset.listid = movieHistoryShortListStore.title;
        listElement.classList.add("list-group");
        listElement.innerText = movieHistoryShortListStore.title;
        movieShortList.appendChild(listElement);
    })
}


// Clears an element that is called
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


// Saves and Renders lists
function saveAndRender(){
    localStorageSave();
    renderMovieShortListContainer();
    renderMovieHistoryTable();
    clearAddMovieForm();
    autoCompletePanel.style.visibility ='hidden';
}


// Initial Rendering
window.onload = () => {
    movieDatabase();
    renderMovieShortListContainer();
    renderMovieHistoryTable();

};


movieDatabase();
renderMovieShortListContainer();
renderMovieHistoryTable();
autoCompletePanel.style.visibility = 'hidden';
