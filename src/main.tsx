import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './routes/router'
import { store } from './store'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './styles/theme'
import { SessionObserver } from './components/SessionObserver'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <SessionObserver />
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={4000} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
