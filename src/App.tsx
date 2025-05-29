import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CssBaseline, 
  createTheme, 
  ThemeProvider, 
  IconButton, 
  AppBar, 
  Toolbar,
  Paper,
  Modal,
  Backdrop,
  Fade as MuiFade,
  Button
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import RecordsTable from './components/RecordsTable';
import RecordForm from './components/RecordForm';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: {
        fontWeight: 600,
      }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: darkMode ? '0px 4px 20px rgba(0, 0, 0, 0.3)' : '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 600,
          }
        }
      },
      MuiModal: {
        styleOverrides: {
          root: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }
        }
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
          }
        }
      }
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Стили для модального окна
  const modalStyle = {
    position: 'relative',
    zIndex: 1400,
    width: '90%',
    maxWidth: 800,
    maxHeight: '90vh',
    overflow: 'auto',
    p: 0,
    outline: 'none',
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0} color="default">
        <Toolbar>
          <GroupIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Управление записями
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={handleOpenModal}
            sx={{ mr: 2 }}
          >
            Добавить запись
          </Button>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Модальное окно с формой */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          }
        }}
        sx={{ 
          zIndex: 1300,
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: -1,
          }
        }}
      >
        <MuiFade in={openModal}>
          <Box sx={modalStyle}>
            <RecordForm onSuccess={handleCloseModal} />
          </Box>
        </MuiFade>
      </Modal>
      
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Paper sx={{ overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ p: 2, pb: 0 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Список записей
              </Typography>
            </Box>
            <RecordsTable />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
