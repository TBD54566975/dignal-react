import { Header } from '@/components/Header';
import { useRef } from 'react';
import RightChevron from '@assets/buttons/right-chevron.svg';
import Modal from '@/components/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { formatTime } from '@/util/helpers';
import {
  sendRecordToParticipants,
  transformChatContextToChatListEntry,
  useChatContext,
} from '@/util/chat';
import { createPrivateOrGroupChat } from '@/util/chat';
import { RoutePaths } from '@/util/routes';

export default function Chats() {
  const newChatModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [chats, setChats] = useChatContext();

  async function handleCreateNewChat(type: 'private' | 'group') {
    const newChat = await createPrivateOrGroupChat(type);
    if (newChat) {
      const newChatListEntry =
        await transformChatContextToChatListEntry(newChat);
      setChats(prev => {
        return {
          [newChat.contextId]: newChatListEntry,
          ...prev,
        };
      });
      navigate(RoutePaths.CHAT + '/' + newChat.contextId);
      sendRecordToParticipants(newChat, newChatListEntry.participants);
    }
  }

  return (
    <div className="content header-treatment">
      <Header title={'Chat'} />
      <main>
        <div className="scroll-area">
          <ul className="scroll-content visually-hide-scrollbar">
            {chats &&
              Object.values(chats).map(chat => {
                return (
                  <li key={chat.contextId}>
                    <Link to={chat.contextId} className="display-link">
                      <span className="display-link-detail">
                        <img src={chat.icon} alt={chat.iconAlt} />
                        <span>
                          <h2>{chat.name}</h2>
                          <p>{chat.latest}</p>
                        </span>
                      </span>
                      <time dateTime={chat.timestamp}>
                        {formatTime(chat.timestamp)}
                      </time>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <button
          className="btn expanded"
          onClick={() => newChatModalRef.current?.showModal()}
        >
          Start a new chat
        </button>

        <Modal
          objectRef={newChatModalRef}
          title="Start a new..."
          dismissLabel="Cancel"
          listItems={[
            <a
              onClick={async () => await handleCreateNewChat('private')}
              title="Create and go to a new private chat"
              className="display-link"
            >
              <span>
                <h3>1:1 chat</h3>
                <p>Start a chat with one other person</p>
              </span>
              <img src={RightChevron} alt="" />
            </a>,
            <a
              onClick={async () => await handleCreateNewChat('private')}
              title="Create and go to a new group chat"
              className="display-link"
            >
              <span>
                <h3>Group chat</h3>
                <p>Chat with a group of people</p>
              </span>
              <img src={RightChevron} alt="" />
            </a>,
          ]}
        />
      </main>
    </div>
  );
}
