import { RoutePaths } from '@/routes';
import { Outlet as ChatOutlet, useLocation, useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';

function ChatWindow() {
  const params = useParams();
  const location = useLocation();

  return (
    <div className="chat-window">
      {params.chatId || location.pathname === RoutePaths.NEW_CHAT ? (
        <ChatOutlet context={params.chatId} />
      ) : (
        <>
          <ChatHeader profile={false} />
          <div className="layout">
            <div className="row text-center justify-center m-auto row-px">
              No chat selected
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
