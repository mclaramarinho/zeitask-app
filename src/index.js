import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/index.css';
import '../src/styles/backgrounds.css';
import '../src/styles/bootstrapReset.css';
import '../src/styles/fonts.css';
import '../src/styles/fontTemplate.css';
import '../src/styles/lists.css';
import '../src/styles/responsivity.css';
import '../src/styles/sizing.css';
import '../src/styles/cursor.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={routes}/>
  </React.StrictMode>
);