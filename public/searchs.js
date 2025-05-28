/**
 * @file searchs.js Скрипт для страницы поиска, содержащий логику для обработки поисковых запросов и отображения результатов.
 */
/**
 * @constant {string} API_KEY Ключ API Last.fm.  Замените на свой API Key.
 */
const API_KEY = "2467e45594a2085cd6fbcdb081b93c5f"; // Замените на свой API Key

/**
 * Получает значение параметра поискового запроса из URL.
 *
 * @function getSearchTerm
 * @returns {string|null} Значение параметра 'q' из URL или null, если параметр отсутствует.
 */
// Функция для получения параметра из URL
function getSearchTerm() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
}
/**
 * Ищет артистов на Last.fm на основе предоставленного поискового запроса.
 *
 * @async
 * @function searchArtists
 * @param {string} searchTerm Поисковый запрос для поиска артистов.
 * @returns {Promise<Array<object>>} Promise, разрешающийся массивом объектов артистов. Возвращает пустой массив в случае ошибки.
 */
// Функция для поиска артистов
async function searchArtists(searchTerm) {
    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.results || !data.results.artistmatches || !data.results.artistmatches.artist) {
            console.warn("Не найдено результатов поиска артистов.");
            return [];
        }

        return data.results.artistmatches.artist;
    } catch (error) {
        console.error("Ошибка при поиске артистов:", error);
        return [];
    }
}
/**
 * Ищет альбомы на Last.fm на основе предоставленного поискового запроса.
 *
 * @async
 * @function searchAlbums
 * @param {string} searchTerm Поисковый запрос для поиска альбомов.
 * @returns {Promise<Array<object>>} Promise, разрешающийся массивом объектов альбомов. Возвращает пустой массив в случае ошибки.
 */
// Функция для поиска альбомов
async function searchAlbums(searchTerm) {
    const url = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.results || !data.results.albummatches || !data.results.albummatches.album) {
            console.warn("Не найдено результатов поиска альбомов.");
            return [];
        }

        return data.results.albummatches.album;
    } catch (error) {
        console.error("Ошибка при поиске альбомов:", error);
        return [];
    }
}
/**
 * Ищет треки на Last.fm на основе предоставленного поискового запроса.
 *
 * @async
 * @function searchTracks
 * @param {string} searchTerm Поисковый запрос для поиска треков.
 * @returns {Promise<Array<object>>} Promise, разрешающийся массивом объектов треков. Возвращает пустой массив в случае ошибки.
 */
// Функция для поиска треков
async function searchTracks(searchTerm) {
    const url = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.results || !data.results.trackmatches || !data.results.trackmatches.track) {
            console.warn("Не найдено результатов поиска треков.");
            return [];
        }

        return data.results.trackmatches.track;
    } catch (error) {
        console.error("Ошибка при поиске треков:", error);
        return [];
    }
}
/**
 * Отображает список артистов на странице.
 *
 * @function displayArtists
 * @param {Array<object>} artists Массив объектов артистов для отображения.
 * @returns {void}
 */
// Функция для отображения артистов
function displayArtists(artists) {
    const artistListElement = document.querySelector(".artist-list");
    artistListElement.innerHTML = "";

    if (artists.length === 0) {
        artistListElement.textContent = "Нет результатов.";
        return;
    }

    artists.forEach(artist => {
        const artistItem = document.createElement("div");
        artistItem.classList.add("artist-item");

        const artistImage = document.createElement("img");
        const imageUrl = artist.image[0]?.['#text'] || "f.jpg"; 
        artistImage.src = imageUrl;

        const artistInfo = document.createElement("div");
        artistInfo.classList.add("artist-info");

        const artistName = document.createElement("h4");
        artistName.textContent = artist.name;

        const listeners = document.createElement("p");
        listeners.textContent = `${artist.listeners} listeners`;

        artistInfo.appendChild(artistName);
        artistInfo.appendChild(listeners);

        artistItem.appendChild(artistImage);
        artistItem.appendChild(artistInfo);

        artistListElement.appendChild(artistItem);
    });
}
/**
 * Отображает список альбомов на странице.
 *
 * @function displayAlbums
 * @param {Array<object>} albums Массив объектов альбомов для отображения.
 * @returns {void}
 */
// Функция для отображения альбомов
function displayAlbums(albums) {
    const albumListElement = document.querySelector(".album-list");
    albumListElement.innerHTML = "";

    if (albums.length === 0) {
        albumListElement.textContent = "Нет результатов.";
        return;
    }

    albums.forEach(album => {
        const albumItem = document.createElement("div");
        albumItem.classList.add("album-item");

        const albumImage = document.createElement("img");
        const imageUrl = album.image[1]?.['#text'] || "f.jpg";
        albumImage.src = imageUrl;

        const albumInfo = document.createElement("div");
        albumInfo.classList.add("album-info");

        const albumName = document.createElement("h4");
        albumName.textContent = album.name;

        const artistName = document.createElement("p");
        artistName.textContent = album.artist;


        albumInfo.appendChild(albumName);
        albumInfo.appendChild(artistName);

        albumItem.appendChild(albumImage);
        albumItem.appendChild(albumInfo);

        albumListElement.appendChild(albumItem);
    });
}
/**
 * Отображает список треков на странице.
 *
 * @function displayTracks
 * @param {Array<object>} tracks Массив объектов треков для отображения.
 * @returns {void}
 */
// Функция для отображения треков
function displayTracks(tracks) {
    const trackListElement = document.querySelector(".track-list");
    trackListElement.innerHTML = "";

    if (tracks.length === 0) {
        trackListElement.textContent = "Нет результатов.";
        return;
    }

    tracks.forEach(track => {
        const trackItem = document.createElement("div");
        trackItem.classList.add("track-item");

        const trackImage = document.createElement("img");
        const imageUrl = track.image[0]?.['#text'] || "f.jpg";
        trackImage.src = imageUrl;

        const trackInfo = document.createElement("div");
        trackInfo.classList.add("track-info");

        const trackName = document.createElement("h4");
        trackName.textContent = track.name;

        const artistName = document.createElement("p");
        artistName.textContent = track.artist;


        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artistName);

        trackItem.appendChild(trackImage);
        trackItem.appendChild(trackInfo);

        trackListElement.appendChild(trackItem);
    });
}
/**
 * Выполняет поиск на Last.fm и отображает результаты на странице.
 *
 * @async
 * @function performSearch
 * @param {string} searchTerm Поисковый запрос для выполнения поиска.
 * @returns {void}
 */
// Функция для выполнения поиска и отображения результатов
async function performSearch(searchTerm) {
    document.querySelector(".search-results h2").textContent = `Search Results for "${searchTerm}"`;

    const artists = await searchArtists(searchTerm);
    displayArtists(artists);

    const albums = await searchAlbums(searchTerm);
    displayAlbums(albums);

    const tracks = await searchTracks(searchTerm);
    displayTracks(tracks);
}
// Обработчик события
document.addEventListener('DOMContentLoaded', function() {  // Убедимся, что DOM загружен
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (searchForm && searchInput) { // Проверяем, что элементы существуют
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем стандартную отправку формы

            const searchTerm = searchInput.value;
            if (searchTerm) {
                const searchUrl = `search.html?q=${encodeURIComponent(searchTerm)}`; // Создаем URL поиска

                window.location.href = searchUrl; // Перенаправляем на страницу поиска
            }
        });
    } else {
        console.error("Форма поиска или поле ввода не найдены!");
    }
});

// Обработчик события DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const searchTerm = getSearchTerm();

    if (searchTerm) {
        performSearch(searchTerm);
    }
});