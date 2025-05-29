import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/playlists`;

export const getPlaylists = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const createPlaylist = async (name: string, token: string) => {
  const res = await axios.post(API_URL, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const updatePlaylist = async (id: string, name: string, token: string) => {
  const res = await axios.put(`${API_URL}/${id}`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const deletePlaylist = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const getPlaylistById = async (id: string, token: string) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const addSongToPlaylist = async (playlistId: string, song: any, token: string) => {
  const res = await axios.post(`${API_URL}/${playlistId}/songs`, song, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string, token: string) => {
  const res = await axios.delete(`${API_URL}/${playlistId}/songs/${songId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};