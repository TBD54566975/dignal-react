import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Fox from '../../../assets/sample-pictures/fox.png';
import { did, queryRecords, readRecord, writeRecord } from '../../../util/web5';
import { ChatProtocol } from '../../../util/protocols/chat.protocol';

function ChatDetail() {
  const chatId = useOutletContext<string>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function populateChats() {
    const { records } = await queryRecords({
      message: {
        filter: { contextId: chatId, protocolPath: 'message/reply' },
      },
    });
    const messages: {
      message: string;
      timestamp: string;
      from: string;
      delivered: boolean;
      seen: boolean;
      recordId: string;
    }[] = [];
    for (const record of records!) {
      messages.push({
        message: (await record.data.json()).text,
        timestamp: record.dateModified,
        from: did === record.author ? 'self' : 'friend',
        delivered: true,
        seen: true,
        recordId: record.id,
      });
    }
    setCurrentChats(curr => {
      return {
        ...curr,
        messages,
      };
    });
  }

  useEffect(() => {
    setIsLoading(true);
    async function getChatItem() {
      const { record } = await readRecord({
        message: { recordId: chatId },
      });
      if (record) {
        populateChats();
      } else {
        setIsError(true);
      }

      setIsLoading(false);
    }
    void getChatItem();
  }, [chatId]);

  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [currentChats, setCurrentChats] = useState(currentChat);
  useEffect(() => {
    latestMessageRef.current?.scrollIntoView();
  }, [currentChats?.messages.length]);

  async function sendChat(text: string) {
    await writeRecord({
      data: {
        text,
      },
      message: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message/reply',
        schema: ChatProtocol.types.message.schema,
        contextId: chatId,
        parentId: chatId,
      },
    });
    populateChats();
  }

  function sendMessage(e: KeyboardEvent<HTMLInputElement> & HTMLInputElement) {
    if (!e.currentTarget.value) return;
    const text = e.currentTarget.value;
    if (e.key === 'Enter') {
      sendChat(text);
      e.currentTarget.value = '';
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            loading...
          </div>
        </div>
      ) : isError ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            Error loading message
          </div>
        </div>
      ) : (
        <div className="container text-center">
          <div className="row-px chat-header">
            <div className="avatar">
              <img src={currentChats.who.picture} alt="" />
            </div>
            <div className="chat-name">
              <h2>
                {currentChats.who.name} Chat ID: {chatId}
              </h2>
            </div>
          </div>
          <div className="history-window visually-hide-scrollbar">
            <div className="chat-window">
              {currentChats.messages.map((chat, index) => {
                return (
                  <p
                    key={index}
                    ref={
                      index === currentChats.messages.length - 1
                        ? latestMessageRef
                        : null
                    }
                    data-record-id={chat.recordId}
                    id={
                      index === currentChats.messages.length - 1 ? 'latest' : ''
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
          </div>
          <div className="row-px message-input">
            <label htmlFor="messageInput" className="sr-only">
              Enter message
            </label>
            <input
              autoComplete="off"
              id="messageInput"
              name="message"
              type="text"
              className="chat-input"
              placeholder="Enter message"
              onKeyUp={sendMessage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatDetail;

const currentMessages = [
  {
    message: 'First message inbound',
    timestamp: '2023-08-09T01:13:54.402Z',
    from: 'friend',
    delivered: true,
    seen: true,
    recordId: '12222',
  },
  {
    message: 'Next message outbound that goes onto a second line',
    timestamp: '2023-08-09T01:14:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '122',
  },
  {
    message: 'Next message inbound that also goes onto a second line',
    timestamp: '2023-08-09T01:15:54.402Z',
    from: 'friend',
    delivered: true,
    seen: true,
    recordId: '111111111111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:33:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '1111111111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:34:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '11111111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:35:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '1111111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:36:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '111111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:37:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '11111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:38:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '1111',
  },
  {
    message: 'Last message outbound',
    timestamp: '2023-08-11T05:39:54.402Z',
    from: 'self',
    delivered: true,
    seen: true,
    recordId: '111',
  },
  {
    message: 'Last message inbound',
    timestamp: '2023-08-11T05:40:54.402Z',
    from: 'friend',
    delivered: true,
    seen: true,
    recordId: '11',
  },
  {
    message: 'Last message inbound',
    timestamp: '2023-08-11T05:41:54.402Z',
    from: 'friend',
    delivered: true,
    seen: true,
    recordId: '1',
  },
];
const currentChat = {
  who: {
    name: 'Dignal Welcome Chat',
    picture: Fox,
  },
  messages: [currentMessages[0]],
  id: '123',
};
