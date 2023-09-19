import ChatWindow from './ChatWindow';
import Sidebar from './Sidebar';

function Chat() {
  return (
    <div className="chat-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="chat-window">
        <ChatWindow />
      </div>
    </div>
  );
}

export default Chat;
