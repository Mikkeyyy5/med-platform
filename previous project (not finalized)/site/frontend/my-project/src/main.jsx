import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { StrictMode } from 'react';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
<StrictMode>
  <App />
</StrictMode>,
);
