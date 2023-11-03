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
  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [chats, setChats] = useChatContext();

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
                        <img src={chat.icon} alt={chat.icon_alt} />
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
          onClick={() => modalRef.current?.showModal()}
        >
          Start a new chat
        </button>
        <Modal
          objectRef={modalRef}
          title="Start a new..."
          dismissLabel="Cancel"
          listItems={[
            <a
              onClick={async () => {
                const newPrivateChat =
                  await createPrivateOrGroupChat('private');
                if (newPrivateChat) {
                  const newPrivateChatListEntry =
                    await transformChatContextToChatListEntry(newPrivateChat);
                  setChats(prev => {
                    return {
                      ...prev,
                      [newPrivateChat.contextId]: newPrivateChatListEntry,
                    };
                  });
                  navigate(RoutePaths.CHAT + '/' + newPrivateChat.contextId);
                  sendRecordToParticipants(
                    newPrivateChat,
                    newPrivateChatListEntry.participants,
                  );
                }
              }}
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
              onClick={async () => {
                const newGroupChat = await createPrivateOrGroupChat('group');
                if (newGroupChat) {
                  const newGroupChatListEntry =
                    await transformChatContextToChatListEntry(newGroupChat);
                  setChats(prev => {
                    return {
                      ...prev,
                      [newGroupChat.contextId]: newGroupChatListEntry,
                    };
                  });
                  navigate(RoutePaths.CHAT + '/' + newGroupChat.contextId);
                  sendRecordToParticipants(
                    newGroupChat,
                    newGroupChatListEntry.participants,
                  );
                }
              }}
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
