import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Fab, Box, CircularProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import PlaylistFormModal from '../components/PlaylistFormModal';
import { getPlaylists, createPlaylist, deletePlaylist } from '../api/playlistApi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material';

interface Playlist {
    _id: string;
    name: string;
}

const Home: React.FC = () => {
    const token = useSelector((state: RootState) => state.auth.token) as string;
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

    const navigate = useNavigate();

    console.log({
        playlists
    });


    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const data = await getPlaylists(token);
            setPlaylists(data);
        } catch (err: any) {
            setError('Failed to load playlists');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPlaylists();
        // eslint-disable-next-line
    }, []);

    const handleCreate = async (name: string) => {
        try {
            await createPlaylist(name, token);
            setOpenModal(false);
            fetchPlaylists();
        } catch {
            setError('Failed to create playlist');
        }
    };

    const handleDeleteClick = (id: string) => {
        setPlaylistToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!playlistToDelete) return;
        try {
            await deletePlaylist(playlistToDelete, token);
            setDeleteDialogOpen(false);
            setPlaylistToDelete(null);
            fetchPlaylists();
        } catch {
            setDeleteDialogOpen(false);
            setPlaylistToDelete(null);
            setError('Failed to delete playlist');
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ minHeight: '70vh', py: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Your Playlists
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {playlists?.length === 0 ? (
                            <Box display="flex" flexDirection="column" alignItems="center" width="100%" mt={4}>
                                <img
                                    src="https://undraw.co/api/illustrations/undraw_music_re_a2jk.svg"
                                    alt="No Playlists"
                                    style={{ width: '220px', maxWidth: '90%', marginBottom: 16 }}
                                />
                                <Typography variant="h6" align="center" gutterBottom>
                                    No playlists found.
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                                    Click the <MusicOffIcon sx={{ verticalAlign: 'middle' }} /> button below to create your first playlist!
                                </Typography>
                            </Box>
                        ) : (
                             <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 3, 
                            justifyContent: 'center' 
                        }}>
                            {playlists?.map((playlist: any) => (
                                <Box 
                                    key={playlist._id} 
                                    sx={{ 
                                        width: { 
                                            xs: '100%', 
                                            sm: 'calc(50% - 24px)', 
                                            md: 'calc(33.333% - 24px)' 
                                        } 
                                    }}
                                >
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': { boxShadow: 6, bgcolor: 'primary.light' },
                                        }}
                                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                                    >
                                        <CardContent>
                                            <Box display="flex" alignItems="center" gap={1} justifyContent="space-between">
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <QueueMusicIcon color="primary" />
                                                    <Typography variant="h6" noWrap>
                                                        {playlist.name}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    size="small"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(playlist._id);
                                                    }}
                                                >
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                        )}

                    </>
                )}
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ position: 'fixed', bottom: 32, right: 32 }}
                    onClick={() => setOpenModal(true)}
                >
                    <AddIcon />
                </Fab>
                <PlaylistFormModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onSubmit={handleCreate}
                />
                {error && (
                    <Box mt={2}>
                        <Typography color="error" align="center">{error}</Typography>
                    </Box>
                )}
            </Container>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Are you sure you want to delete this playlist?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </>
    );
};

export default Home;
