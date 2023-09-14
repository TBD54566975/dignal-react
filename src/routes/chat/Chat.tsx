import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

function Chat() {
  const [isLoading, setIsLoading] = useState(true);

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
