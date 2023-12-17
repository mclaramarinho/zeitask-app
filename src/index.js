import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/index.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={routes}/>
  </React.StrictMode>
);