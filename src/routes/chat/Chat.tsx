import ChatWindow from './components/chat-window/ChatWindow';
import Sidebar from './components/sidebar/Sidebar';

function Chat() {
  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Chat;
