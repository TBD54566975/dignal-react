import { RouteObject } from 'react-router-dom';
import ErrorPage from './error.tsx';
import App from './routes/App.tsx';
import Chat from './routes/chat/Chat.tsx';
import ChatWindow from './routes/chat/ChatWindow.tsx';
import Onboarding from './routes/onboarding/Onboarding.tsx';
import Create from './routes/onboarding/create/Create.tsx';

export const enum RoutePaths {
  ROOT = '/',
  ONBOARDING = '/onboarding',
  CREATE_PROFILE = `${RoutePaths.ONBOARDING}/create`,
  CHAT = '/chat',
}

export const routes: RouteObject[] = [
  {
    path: RoutePaths.ROOT,
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: `${RoutePaths.CHAT}`,
        element: <Chat />,
        children: [
          {
            path: `${RoutePaths.CHAT}/:chatId`,
            element: <ChatWindow />,
          },
        ],
      },
      {
        path: RoutePaths.ONBOARDING,
        element: <Onboarding />,
      },
      {
        path: RoutePaths.CREATE_PROFILE,
        element: <Create />,
      },
    ],
  },
];