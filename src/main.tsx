import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './features/auth/auth.css';

createRoot(document.getElementById('root')!).render(<App />);
