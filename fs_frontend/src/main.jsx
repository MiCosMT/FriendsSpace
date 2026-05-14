// Punto de entrada principal de React en el navegador que inicializa y monta la aplicación en el DOM
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';

createRoot(document.getElementById('root')).render(
    <App />
)
