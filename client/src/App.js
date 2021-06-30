import React, { useState, useEffect } from 'react';
import Dropdown from './components/Dropdown/dropdown';
import TrackListContainer from './components/TrackListContainer/trackListContainer';
import TrackInfo from './components/TrackInfo/trackinfo';
import axios from 'axios';
import './App.css';
//const { REACT_APP_CLIENT_SEC, REACT_APP_CLIENT_ID } = process.env;

function App() {
  const clientSecret = '';
  const clientId = '';

  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({
    selectedGenre: '',
    listOfGenresFromAPI: [],
  });
  const [playlist, setPlaylist] = useState({
    selectedPlaylist: '',
    listOfPlaylistFromAPI: [],
  });
  const [tracks, setTracks] = useState({
    selectedTrack: '',
    listOfTracksFromAPI: [],
  });

  const [trackDetail, setTrackDetail] = useState(null);
  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
      },
      data: 'grant_type=client_credentials',
      method: 'POST',
    }).then((tokenResponse) => {
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token },
      }).then((genreResponse) => {
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreResponse.data.categories.items,
        });
      });
    });
  }, [genres.selectedGenre, clientId, clientSecret]);

  const genreChanged = (val) => {
    setGenres({
      selectedGenre: val,
      listOfGenresFromAPI: genres.listOfGenresFromAPI,
    });

    axios(
      `https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      }
    ).then((playlistResponse) => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items,
      });
    });

    console.log(val);
  };

  const playlistChanged = (val) => {
    console.log(val);
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI,
    });
  };

  const buttonClicked = (e) => {
    e.preventDefault();

    axios(
      `https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    ).then((tracksResponse) => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items,
      });
    });
  };

  // useEffect(() => {
  //   //get initial token in order to access endpoints
  //   axios('https://accounts.spotify.com/api/token', {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
  //     },
  //     data: 'grant_type=client_credentials',
  //     method: 'POST',
  //   }).then((tokenResponse) => {
  //     console.log(tokenResponse.data.access_token);
  //     setToken(tokenResponse.data.access_token);
  //     //get genres
  //     axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
  //       method: 'GET',
  //       headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token },
  //     }).then((genreResponse) => {
  //       setGenres({
  //         selectedGenre: genres.selectedGenre,
  //         listOfGenresFromAPI: genreResponse.data.categories.items,
  //       });
  //     });
  //   });
  // }, [genres.selectedGenre, clientId, clientSecret]);

  // const genreChanged = (val) => {
  //   setGenres({
  //     selectedGenre: val,
  //     listOfGenresFromAPI: genres.listOfGenresFromAPI,
  //   });

  //   //get playlists
  //   axios(
  //     `https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
  //     {
  //       method: 'GET',
  //       headers: { Authorization: 'Bearer ' + token },
  //     }
  //   ).then((playlistResponse) => {
  //     setPlaylist({
  //       selectedPlaylist: playlist.selectedPlaylist,
  //       listOfPlaylistFromAPI: playlistResponse.data.playlists.items,
  //     });
  //   });
  // };

  // const playlistChanged = (val) => {
  //   setPlaylist({
  //     selectedPlayList: val,
  //     listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI,
  //   });
  // };

  // const buttonClicked = (e) => {
  //   e.preventDefault();

  //   axios(
  //     `https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //       },
  //     }
  //   ).then((tracksResponse) => {
  //     setTracks({
  //       selectedTrack: tracks.selectedTrack,
  //       listOfTracksFromAPI: tracksResponse.data.items,
  //     });
  //   });
  // };

  const listboxClicked = (val) => {
    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackInfo = currentTracks.filter((t) => t.track.id === val);

    setTrackDetail(trackInfo[0].track);
  };

  return (
    <div className='App'>
      <form onSubmit={buttonClicked}>
        <Dropdown
          options={genres.listOfGenresFromAPI}
          selectedValue={genres.selectedGenre}
          changed={genreChanged}
        />
        <Dropdown
          options={playlist.listOfPlaylistFromAPI}
          selectedValue={playlist.selectedPlaylist}
          changed={playlistChanged}
        />
        <button type='submit'>Search</button>
        <TrackListContainer
          items={tracks.listOfTracksFromAPI}
          clicked={listboxClicked}
        />
        {trackDetail && <TrackInfo {...trackDetail} />}
      </form>
    </div>
  );
}

export default App;
