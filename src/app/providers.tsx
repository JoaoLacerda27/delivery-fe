import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from './router';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2167AE',
    },
    secondary: {
      main: '#91BFE3',
    },
  },
});

export const AppProviders = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
};

