import { RouteObject } from 'react-router-dom';
import ErrorPage from '../error.tsx';
import App from '@routes/App.tsx';
import Profiles from '@/routes/profiles/Profiles.tsx';
import Chats from '@/routes/chat/Chats.tsx';
import ChatId from '@/routes/chat/ChatId.tsx';

export const enum RoutePaths {
  ROOT = '/',
  CHAT = '/chat',
  INVITE = '/invite',
  PROFILES = '/profiles',
  IMPORT = '/profiles/import',
  REQUESTS = '/#requests',
  // CONTACTS = '/contacts', // not yet mocked
}

export const routes: RouteObject[] = [
  {
    path: RoutePaths.ROOT,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: RoutePaths.CHAT,
        children: [
          {
            path: `${RoutePaths.CHAT}`,
            element: <Chats />,
          },
          {
            path: `${RoutePaths.CHAT}/:contextId`,
            element: <ChatId />,
          },
        ],
      },
      {
        path: `${RoutePaths.INVITE}/:contextId`,
        element: <div>Invite detail</div>,
      },
      {
        path: RoutePaths.PROFILES,
        children: [
          {
            path: `${RoutePaths.PROFILES}`,
            element: <Profiles />,
          },
          {
            path: `${RoutePaths.PROFILES}/:contextId`,
            element: <div>Profile detail page</div>,
          },
          {
            path: `${RoutePaths.IMPORT}`,
            element: <div>Profile import page</div>,
          },
        ],
      },
      {
        path: RoutePaths.REQUESTS,
        element: <div>Requests view</div>,
      },
    ],
  },
];
