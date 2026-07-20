import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted Nunito (the site's original face), 400–900 via variable font.
import '@fontsource-variable/nunito';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
