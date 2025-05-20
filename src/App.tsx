import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { searchArtists, searchAlbums, searchTracks, getTopArtists, getTopTracks } from './services/lastfm';
import ArtistCard from './components/ArtistCard';
import AlbumList from './components/AlbumList';
import TrackList from './components/TrackList';
import SearchBar from './components/SearchBar';
import { Album} from './types/Album';
import { Artist} from './types/Artist';
import { Track } from './types/Track';

function Home() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);   // Explicitly type as Track[]
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const artists = await getTopArtists();
        setTopArtists(artists);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };
    const fetchTopTracks = async () => { // Функция для получения топ треков
      try {
        const tracks = await getTopTracks();
        setTopTracks(tracks);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    fetchTopArtists();
    fetchTopTracks();
  }, []);

  return (
    <div>
      <h2>Popular Artists</h2>
      <div className="artist-list">
        {topArtists.map((artist) => (
          <ArtistCard key={artist.mbid || artist.name} artist={artist} />
        ))}
      </div>
      <h2>Popular Tracks</h2>
      <TrackList tracks={topTracks} /> 
    </div>
  );
}

function SearchResults() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState<Artist[]>([]); // Explicitly type as Artist[]
  const [albums, setAlbums] = useState<Album[]>([]);   // Explicitly type as Album[]
  const [tracks, setTracks] = useState<Track[]>([]);   // Explicitly type as Track[]
  const navigate = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || ''; // Get search term from URL

    setSearchTerm(query); // Update searchTerm state

    const fetchData = async () => {
      if (query) {
        const artistResults = await searchArtists(query);
        setArtists(artistResults);

        const albumResults = await searchAlbums(query);
        setAlbums(albumResults);

        const trackResults = await searchTracks(query);
        setTracks(trackResults);
      } else {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
      }
    };
    fetchData();
  }, [window.location.search]); // Dependency on window.location.search to re-run on URL change
  const handleSearch = (searchTerm: string) => {
    // Обновление страницы с новым поисковым запросом
    window.location.href = `/search?q=${searchTerm}`;
  };
  return (
    <div>
      <SearchBar onSearch= {handleSearch}
        // {(term) => {
        //   // Programmatically navigate to the search results page
        //   navigate.push(`/search?q=${term}`);
        // }}
      />
      <h2>Search Results for "{searchTerm}"</h2>
      <div className="search-results-container">
        <h3>Artists</h3>
        <div className="artist-list">
          {artists.map((artist) => (
            <ArtistCard key={artist.mbid || artist.name} artist={artist} />
          ))}
        </div>
        <h3>Albums</h3>
        <AlbumList albums={albums} />
        <h3>Tracks</h3>
        <TrackList tracks={tracks} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/search">
            <SearchResults />
          </Route>
          <Route path="*">
            <div>404 Not Found</div>
          </Route>
        </Switch>
        <footer>
          <p>&copy; 2024 Music Search App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;