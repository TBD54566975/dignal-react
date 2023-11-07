import { Header } from '@/components/Header';
import { useRef } from 'react';
import RightChevron from '@assets/buttons/right-chevron.svg';
import ListModal from '@/components/ListModal';
import { Link, useNavigate } from 'react-router-dom';
import { formatTime } from '@/util/helpers';
import {
  lastMessageIsALog,
  sendRecordToParticipants,
  transformChatContextToChatListEntry,
} from '@/util/chat';
import { createPrivateOrGroupChat } from '@/util/chat';
import { RoutePaths } from '@/util/routes';
import { useChatContext } from '@/util/contexts';

export default function Chats() {
  const newChatModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [chats, setChats] = useChatContext();

  async function handleCreateNewChat(type: 'private' | 'group') {
    const newChat = await createPrivateOrGroupChat(type);
    if (newChat) {
      const newChatListEntry =
        await transformChatContextToChatListEntry(newChat);
      setChats &&
        setChats(prev => {
          return {
            [newChat.contextId]: newChatListEntry,
            ...prev,
          };
        });
      navigate(RoutePaths.CHAT + '/' + newChat.contextId);
      sendRecordToParticipants(
        newChat,
        newChatListEntry && newChatListEntry.participants,
      );
    }
  }

  return (
    <div className="content header-treatment">
      <Header title={'Chats'} />
      <main>
        <div className="scroll-area">
          <ul className="scroll-content visually-hide-scrollbar">
            {Object.values(chats).map(chat => {
              return (
                chat && (
                  <li key={chat.contextId}>
                    <Link to={chat.contextId} className="display-link">
                      <span className="display-link-detail">
                        <div className="chatRecordIcon">
                          <img width={48} src={chat.icon} alt={chat.iconAlt} />
                        </div>
                        <span>
                          <h2>{chat.name}</h2>
                          <p
                            className={
                              lastMessageIsALog(chat) ? 'text-italic' : ''
                            }
                          >
                            {chat.latest}
                          </p>
                        </span>
                      </span>
                      <time dateTime={chat.timestamp}>
                        {formatTime(chat.timestamp)}
                      </time>
                    </Link>
                  </li>
                )
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

        <ListModal
          listModalRef={newChatModalRef}
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
