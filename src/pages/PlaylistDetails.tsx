import React, { useEffect, useState } from 'react';
import {
    Container, Typography, IconButton, Box, CircularProgress, List, ListItem,
    ListItemText, Paper, TextField, Button, ListItemSecondaryAction, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist } from '../api/playlistApi';
import { searchSpotifyTracks } from '../api/spotifyApi';
import PlaylistFormModal from '../components/PlaylistFormModal';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Song {
    _id?: string; // MongoDB ID (if already in playlist)
    spotifyId: string;
    title: string;
    artist: string;
    album: string;
    albumArt?: string;
    duration?: number;
    previewUrl?: string;
}

interface Playlist {
    _id: string;
    name: string;
    songs: Song[];
}

const PlaylistDetails: React.FC = () => {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.auth.token) as string;
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });
    const navigate = useNavigate();

    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const data = await getPlaylistById(id as string, token);
            setPlaylist(data);
        } catch {
            setPlaylist(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPlaylist();
        // eslint-disable-next-line
    }, [id]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        setSearchLoading(true);
        try {
            const results = await searchSpotifyTracks(search.trim());
            // RapidAPI Spotify23 structure: results[i].data has track info
            const mapped = results.map((item: any) => ({
                spotifyId: item.data.id,
                title: item.data.name,
                artist: item.data.artists.items.map((a: any) => a.profile.name).join(', '),
                album: item.data.albumOfTrack.name,
                albumArt: item.data.albumOfTrack.coverArt.sources[0]?.url,
                duration: item.data.duration.totalMilliseconds,
                previewUrl: item.data.previewUrl,
            }));
            setSearchResults(mapped);
        } catch {
            setSnackbar({ open: true, message: "Spotify search failed" });
        }
        setSearchLoading(false);
    };

    const handleAddSong = async (song: Song) => {
        try {
            await addSongToPlaylist(id as string, song, token);
            setSnackbar({ open: true, message: "Song added to playlist" });
            setSearchResults([]);
            setSearch('');
            fetchPlaylist();
        } catch {
            setSnackbar({ open: true, message: "Failed to add song" });
        }
    };

    const handleRemoveSong = async (songId: string) => {
        try {
            await removeSongFromPlaylist(id as string, songId, token);
            setSnackbar({ open: true, message: "Song removed from playlist" });
            fetchPlaylist();
        } catch {
            setSnackbar({ open: true, message: "Failed to remove song" });
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ minHeight: '70vh', py: 4 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <IconButton onClick={() => navigate('/home')}>
                        <ArrowBackIcon />
                    </IconButton>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : playlist ? (
                        <>
                            <Typography variant="h5" sx={{ flexGrow: 1 }}>
                                {playlist.name}
                            </Typography>
                            <IconButton onClick={() => setEditModalOpen(true)}>
                                <EditIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Typography variant="h6" color="error">
                            Playlist not found
                        </Typography>
                    )}
                </Box>

                {/* --- Search Box --- */}
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                    <form onSubmit={handleSearch}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Search Spotify for songs"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                fullWidth
                                size="small"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={searchLoading}
                                startIcon={<SearchIcon />}
                            >
                                Search
                            </Button>
                        </Box>
                    </form>
                    {/* Search Results */}
                    {searchLoading && (
                        <Box display="flex" justifyContent="center" mt={2}><CircularProgress size={24} /></Box>
                    )}
                    {!searchLoading && searchResults.length > 0 && (
                        <List>
                            {searchResults.map((song, idx) => (
                                <ListItem
                                    key={song.spotifyId + idx}
                                    alignItems="flex-start"
                                    sx={{ borderBottom: '1px solid #eee' }}
                                    secondaryAction={
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleAddSong(song)}
                                        >
                                            Add
                                        </Button>
                                    }
                                >
                                    {song.albumArt && (
                                        <img
                                            src={song.albumArt}
                                            alt={song.album}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                objectFit: 'cover',
                                                marginRight: 16,
                                                borderRadius: 4,
                                            }}
                                        />
                                    )}
                                    <ListItemText
                                        primary={`${song.title} - ${song.artist}`}
                                        secondary={song.album}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>

                {/* --- Song List --- */}
                {playlist && (
                    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Songs in this playlist:
                        </Typography>
                        <List>
                            {playlist.songs && playlist.songs.length > 0 ? (
                                playlist.songs.map(song => (
                                    <ListItem key={song._id || song.spotifyId} alignItems="flex-start" sx={{ borderBottom: '1px solid #eee' }}>
                                        <Box display="flex" alignItems="center" width="100%">
                                            {song.albumArt && (
                                                <img src={song.albumArt} alt={song.album} style={{ width: 48, height: 48, objectFit: 'cover', marginRight: 16, borderRadius: 4 }} />
                                            )}
                                            <ListItemText
                                                primary={`${song.title} - ${song.artist}`}
                                                secondary={song.album}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveSong(song._id!)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </Box>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                    No songs in this playlist yet.
                                </Typography>
                            )}
                        </List>
                    </Paper>
                )}

                <PlaylistFormModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSubmit={() => addSongToPlaylist(id as string, { name: playlist?.name }, token)}
                    initialName={playlist?.name}
                    isEdit
                />
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ open: false, message: '' })}
                    message={snackbar.message}
                />
            </Container>
            <Footer />
        </>
    );
};

export default PlaylistDetails;
