import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import * as serviceWorkerRegistration from '@/serviceWorkerRegistration';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/util/routes';

export const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense>
    <RouterProvider router={router} />
  </React.Suspense>,
);

serviceWorkerRegistration.unregister();
