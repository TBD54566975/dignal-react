import Sidebar from './Sidebar';
import { Outlet as ChatOutlet, useParams } from 'react-router-dom';

function Chat() {
  const params = useParams();
  console.log('render - chat');

  return (
    <div className="chat-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="chat-window">
        {params.chatId ? (
          <ChatOutlet />
        ) : (
          <div className="layout">
            <div className="row text-center justify-center m-auto row-px">
              No chat selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
