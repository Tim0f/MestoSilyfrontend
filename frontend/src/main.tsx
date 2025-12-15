import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { injectTailwindStyles } from './utils/tailwind'


// Инъекция стилей из конфигурации Tailwind
injectTailwindStyles()

// Импорт только утилит Tailwind для классов в компонентах
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

