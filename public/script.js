/**
 * @file script.js Главный файл скрипта, содержащий логику для получения и отображения популярных треков и артистов.
 */
/**
 * Получает список популярных треков с Last.fm.
 *
 * @async
 * @function getPopularTracks
 * @returns {Promise<Array<object>>} Promise, разрешающийся массивом объектов треков. Возвращает пустой массив в случае ошибки.
 */
async function getPopularTracks() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=2467e45594a2085cd6fbcdb081b93c5f&format=json`;

  try {
    console.log("Отправляем запрос к API...");
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Получен ответ от API:", response);
    const data = await response.json();
    console.log("Данные API в формате JSON:", data);

    if (!data.tracks || !data.tracks.track) {
      console.error("Неправильный формат данных API. Ожидалось data.tracks.track");
      return []; // Возвращаем пустой массив в случае ошибки
    }

    return data.tracks.track; // Возвращаем массив треков
  } catch (error) {
    console.error("Ошибка при получении популярных треков:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}
/**
 * Получает список популярных артистов с Last.fm.
 *
 * @async
 * @function getPopularArtists
 * @returns {Promise<Array<object>>} Promise, разрешающийся массивом объектов артистов. Возвращает пустой массив в случае ошибки.
 */
async function getPopularArtists() {
  const url = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=2467e45594a2085cd6fbcdb081b93c5f&format=json`;

  try {
    console.log("Отправляем запрос к API...");
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Получен ответ от API:", response);
    const data = await response.json();
    console.log("Данные API в формате JSON:", data);

    if (!data.artists || !data.artists.artist) {
      console.error("Неправильный формат данных API. Ожидалось data.artists.artist");
      return []; // Возвращаем пустой массив в случае ошибки
    }

    return data.artists.artist; // Возвращаем массив артис
  } catch (error) {
    console.error("Ошибка при получении популярных артистов:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

/**
 * Отображает список треков на странице.
 *
 * @function displayTracks
 * @param {Array<object>} tracks Массив объектов треков для отображения.
 * @returns {void}
 */
function displayTracks(tracks) {
    const trackListElement = document.querySelector(".track-list"); // Ищем элемент с классом "track-list"

    // Проверяем, что элемент найден
    if (!trackListElement) {
        console.error("Элемент с классом 'track-list' не найден в HTML.");
        return;
    }

    trackListElement.innerHTML = ""; // Очищаем предыдущий список

    if (tracks.length === 0) {
        trackListElement.textContent = "Нет популярных треков.";
        return;
    }

    tracks.forEach(track => {
        const trackItem = document.createElement("div");
        trackItem.classList.add("track-item"); // Добавляем класс для стилизации

        const trackImage = document.createElement("img");
        const imageUrl = track.image[0]?.['#text'] || "f.jpg";
        trackImage.src = imageUrl;

        // Создаем обертку для информации о треке
        const trackInfo = document.createElement("div");
        trackInfo.classList.add("track-info");

        const trackName = document.createElement("h3");
        trackName.textContent = track.name;

        const artistName = document.createElement("p");
        artistName.textContent = `Исполнитель: ${track.artist.name}`;

        const listeners = document.createElement("p");
        listeners.textContent = `Слушателей: ${track.listeners}`;

        // Добавляем информацию о треке в обертку
        trackInfo.appendChild(trackName);
        trackInfo.appendChild(artistName);
        trackInfo.appendChild(listeners);

        // Добавляем изображение и обертку в элемент трека
        trackItem.appendChild(trackImage);
        trackItem.appendChild(trackInfo);

        trackListElement.appendChild(trackItem);
    });
}
/**
 * Отображает список артистов на странице.
 *
 * @function displayArtists
 * @param {Array<object>} artists Массив объектов артистов для отображения.
 * @returns {void}
 */
function displayArtists(artists) {
  const artistGridElement = document.querySelector(".artists-grid");

  if (!artistGridElement) {
    console.error("Элемент с классом 'artists-grid' не найден в HTML.");
    return;
  }

  artistGridElement.innerHTML = "";

  if (artists.length === 0) {
    artistGridElement.textContent = "Нет популярных артистов.";
    return;
  }

  artists.forEach(artist => {
    const artistCard = document.createElement("div");
    artistCard.classList.add("artist-card");

    const artistImage = document.createElement("img");
    const imageUrl = artist.image[0]?.['#text'] || "f.jpg";
    artistImage.src = imageUrl;

    const artistName = document.createElement("h3");
    artistName.textContent = artist.name;

    const listeners = document.createElement("p");
    listeners.textContent = `Слушателей: ${artist.listeners}`;

    artistCard.appendChild(artistImage);
    artistCard.appendChild(artistName);
    artistCard.appendChild(listeners);

    artistGridElement.appendChild(artistCard);
  });
}

/**
 обработчик события
 */
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
/**
 * Инициализирует приложение, получая и отображая треки и артистов.
 *
 * @async
 * @function init
 * @returns {void}
 */
async function init() {
  const tracks = await getPopularTracks();
  displayTracks(tracks);
  const artists = await getPopularArtists();
  displayArtists(artists);
}

init();