import { useState } from 'react';
import { chat } from '../ChatWindow';

function ChatDetail({
  currentChat,
  chatId,
}: {
  currentChat: chat;
  chatId: string;
}) {
  const [inThread, setInThread] = useState(false);
  function toggleThreadView() {
    setInThread(!inThread);
  }

  return (
    <>
      <div className="container text-center">
        <div className="row-px chat-header">
          <div className="avatar">
            <img src={currentChat.who.picture} alt="" />
          </div>
          <div className="chat-name">
            <h2>
              {currentChat.who.name} Chat ID: {chatId}
            </h2>
          </div>
        </div>
        <div className="history-window visually-hide-scrollbar">
          <div className="chat-window">
            {currentChat.messages.map((chat, index) => {
              return (
                <p
                  key={index}
                  onDoubleClick={toggleThreadView}
                  onTouchStart={toggleThreadView}
                  id={index === currentChat.messages.length - 1 ? 'latest' : ''}
                  className={`${chat.from === 'self' ? 'sent' : ''} ${
                    chat.from === 'friend' ? 'received' : ''
                  }`}
                >
                  {chat.message}
                </p>
              );
            })}
          </div>
          {inThread && (
            <div className="thread-window visually-hide-scrollbar">
              {currentChat.messages.map((chat, index) => {
                return (
                  <p
                    key={index}
                    onDoubleClick={toggleThreadView}
                    onTouchStart={toggleThreadView}
                    id={
                      index === currentChat.messages.length - 1 ? 'latest' : ''
                    }
                    className={`${chat.from === 'self' ? 'sent' : ''} ${
                      chat.from === 'friend' ? 'received' : ''
                    }`}
                  >
                    {chat.message}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <div className="row-px message-input">
          <input
            type="text"
            className="chat-input"
            placeholder="Enter message"
          />
        </div>
      </div>
    </>
  );
}

export default ChatDetail;
