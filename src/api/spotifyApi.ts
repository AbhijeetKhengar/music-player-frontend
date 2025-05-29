import axios from 'axios';

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY as string;

export const searchSpotifyTracks = async (query: string) => {
  const response = await axios.get('https://spotify23.p.rapidapi.com/search/', {
    params: { q: query, type: 'tracks', limit: '10' },
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
    },
  });
  // The structure may vary depending on the API you choose
  return response.data.tracks.items;
};
