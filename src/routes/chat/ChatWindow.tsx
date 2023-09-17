import { useEffect, useRef, useState } from 'react';
import Fox from '../../assets/sample-pictures/fox.png';
import { useParams } from 'react-router-dom';
import { queryRecords } from '../../util/web5';
import ChatDetail from './components/ChatDetail';

function ChatWindow() {
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    setIsLoading(true);
    async function getChatItem() {
      const { records } = await queryRecords({
        message: { filter: { dataFormat: 'application/json' } },
      });
      const recordData = await records![0].data.json();
      console.log(params.chatId, recordData);
      setIsLoading(false);
    }
    void getChatItem();
    latestMessage.current?.scrollIntoView();
  }, [params.chatId]);

  const latestMessage = useRef<HTMLElement>(null);

  console.log('render - chat window');

  return (
    <>
      {isLoading ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            loading...
          </div>
        </div>
      ) : (
        <ChatDetail currentChat={currentChat} chatId={params.chatId ?? ''} />
      )}
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

export type chat = typeof currentChat;
