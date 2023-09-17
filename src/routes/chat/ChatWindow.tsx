import { useEffect, useRef, useState } from 'react';
import Fox from '../../assets/sample-pictures/fox.png';

function ChatWindow() {
  const [inThread, setInThread] = useState(false);
  const latestMessage = useRef<HTMLElement>(null);
  useEffect(() => {
    latestMessage.current?.scrollIntoView();
  }, []);

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
            <h2>{currentChat.who.name}</h2>
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

export default ChatWindow;

const currentChat = {
  who: {
    name: 'Dignal Welcome Chat',
    picture: Fox,
  },
  messages: [
    {
      message: 'First message inbound',
      timestamp: '2023-08-09T01:13:54.402Z',
      from: 'friend',
      delivered: true,
      seen: true,
    },
    {
      message: 'Next message outbound that goes onto a second line',
      timestamp: '2023-08-09T01:14:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Next message inbound that also goes onto a second line',
      timestamp: '2023-08-09T01:15:54.402Z',
      from: 'friend',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:33:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:34:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:35:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:36:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:37:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:38:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message outbound',
      timestamp: '2023-08-11T05:39:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message inbound',
      timestamp: '2023-08-11T05:40:54.402Z',
      from: 'friend',
      delivered: true,
      seen: true,
    },
    {
      message: 'Last message inbound',
      timestamp: '2023-08-11T05:41:54.402Z',
      from: 'friend',
      delivered: true,
      seen: true,
    },
    {},
  ],
  id: '123', //recordId of the thread
};
