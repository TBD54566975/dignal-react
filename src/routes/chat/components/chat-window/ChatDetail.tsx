import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Fox from '@assets/sample-pictures/fox.png';
import { userDid, queryRecords, readRecord, writeRecord } from '@util/web5';
import { ChatProtocol } from '@util/protocols/chat.protocol';

async function populateChats(contextId: string) {
  const { records } = await queryRecords({
    message: {
      filter: { contextId, protocolPath: 'message/reply' },
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
  if (records) {
    for (const record of records) {
      const data = await record.data.json();
      messages.push({
        message: data.text,
        timestamp: record.dateModified,
        //TODO: change to `record.author`
        from: userDid === data.author ? 'self' : 'friend',
        delivered: true,
        seen: true,
        recordId: record.id,
      });
    }
  }
  // console.log('pop chats');
  return messages;
}

function ChatDetail() {
  const chatId = useOutletContext<string>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat>();

  useEffect(() => {
    setCurrentChat({
      name: 'Test',
      picture: Fox,
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const messages = await populateChats(chatId);
      setCurrentMessages(messages);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [chatId]);

  // console.log('render chatDetail');

  useEffect(() => {
    setIsLoading(true);
    async function getChatItem() {
      const messages = await populateChats(chatId);
      setCurrentMessages(messages);
      const { record } = await readRecord({
        message: { recordId: chatId },
      });
      if (record) {
        // console.log(record);
      } else {
        setIsError(true);
      }

      setIsLoading(false);
    }
    void getChatItem();
  }, [chatId]);

  async function sendChat(text: string) {
    //TODO: remove author from data once issue resolved
    const { record } = await writeRecord({
      data: {
        text,
        author: userDid,
      },
      message: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message/reply',
        schema: ChatProtocol.types.message.schema,
        contextId: chatId,
        parentId: chatId,
        published: true, // so they can query it from you
      },
    });
    if (record) {
      console.log(record);
      const { record: chatIdRecord } = await readRecord({
        message: {
          recordId: chatId,
        },
      });
      const { recipients } = await chatIdRecord.data.json();
      const targetRecipients = recipients.filter(
        (recipient: string) => recipient !== userDid,
      );
      for (const targetRecipient of targetRecipients) {
        const { status } = await record.send(targetRecipient);
        console.log(status);
      }
    }
    const messages = await populateChats(chatId);
    setCurrentMessages(messages);
  }

  function sendMessage(e: KeyboardEvent<HTMLInputElement> & HTMLInputElement) {
    if (!e.currentTarget.value) return;
    const text = e.currentTarget.value;
    if (e.key === 'Enter') {
      sendChat(text);
      e.currentTarget.value = '';
    }
  }

  const chatContainer = useRef<HTMLDivElement>(null);
  const chatElement = useRef<HTMLParagraphElement>(null);

  // useEffect(() => {
  //   if (chatContainer.current && chatElement.current) {
  //     console.log(chatElement.current.scrollHeight);
  //     chatElement.current.scrollIntoView();
  //     // chatContainer.current.scrollTo({ top: chatElement.current.scrollHeight });
  //   }
  // }, [currentMessages.length]);

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
              <img src={currentChat?.picture} alt="" />
            </div>
            <div className="chat-name">
              <h2>
                {currentChat?.name} - Chat ID: {chatId}
              </h2>
            </div>
          </div>
          <div className="history-window visually-hide-scrollbar">
            <div className="chat-window" ref={chatContainer}>
              {currentMessages.map((chat, index) => {
                return (
                  <p
                    key={index}
                    ref={chatElement}
                    data-record-id={chat.recordId}
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

type ChatMessage = {
  message: string;
  timestamp: string;
  from: string;
  delivered: boolean;
  seen: boolean;
  recordId: string;
};
type Chat = {
  name: string;
  picture: string;
};
// const currentMessages = [
//   {
//     message: 'First message inbound',
//     timestamp: '2023-08-09T01:13:54.402Z',
//     from: 'friend',
//     delivered: true,
//     seen: true,
//     recordId: '12222',
//   },
//   {
//     message: 'Next message outbound that goes onto a second line',
//     timestamp: '2023-08-09T01:14:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '122',
//   },
//   {
//     message: 'Next message inbound that also goes onto a second line',
//     timestamp: '2023-08-09T01:15:54.402Z',
//     from: 'friend',
//     delivered: true,
//     seen: true,
//     recordId: '111111111111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:33:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '1111111111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:34:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '11111111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:35:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '1111111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:36:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '111111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:37:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '11111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:38:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '1111',
//   },
//   {
//     message: 'Last message outbound',
//     timestamp: '2023-08-11T05:39:54.402Z',
//     from: 'self',
//     delivered: true,
//     seen: true,
//     recordId: '111',
//   },
//   {
//     message: 'Last message inbound',
//     timestamp: '2023-08-11T05:40:54.402Z',
//     from: 'friend',
//     delivered: true,
//     seen: true,
//     recordId: '11',
//   },
//   {
//     message: 'Last message inbound',
//     timestamp: '2023-08-11T05:41:54.402Z',
//     from: 'friend',
//     delivered: true,
//     seen: true,
//     recordId: '1',
//   },
// ];

// const currentChat = {
//   who: {
//     name: 'Dignal Welcome Chat',
//     picture: Fox,
//   },
//   messages: [currentMessages[0]],
//   id: '123',
// };
