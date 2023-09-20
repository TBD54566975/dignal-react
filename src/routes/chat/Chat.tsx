import ChatWindow from './components/chat-window/ChatWindow';
import Sidebar from './components/sidebar/Sidebar';

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
