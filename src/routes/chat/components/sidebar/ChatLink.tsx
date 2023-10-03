import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routes';
import { IChatRecord } from '@routes/chat/types';
import Close from '@assets/icons/x-close.svg';
import { MouseEvent } from 'react';
import { deleteMessagesFromDwn, hideSidebar } from '../../utils';
import { queryFromDwnMessageReplies } from '../../dwn';

function ChatLink({ chat }: { chat: IChatRecord }) {
  const navRoute = RoutePaths.CHAT + '/' + chat.record.id;
  const navigate = useNavigate();
  const match = useMatch(navRoute);

  async function deleteChat(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // delete all chats in a context, but preserve the root context
    // so other participant can reignite chat context if needed
    const records = await queryFromDwnMessageReplies(chat.record.contextId);
    if (records && records.length > 0) {
      deleteMessagesFromDwn(records).then(() => {
        navigate(RoutePaths.CHAT, { replace: true });
      });
    }
  }

  return (
    <>
      <NavLink to={navRoute} onClick={hideSidebar} end className="message-row">
        <div className="avatar-container">
          <div className="avatar">
            <img src={chat.picture} alt="" />
          </div>
        </div>
        <div className="contents">
          <div className="message">
            <h2>{chat.name}</h2>
          </div>
        </div>
      </NavLink>
      {match && (
        <button className="icon-button highlight-button" onClick={deleteChat}>
          <img width="16" src={Close} alt="" /> Delete
        </button>
      )}
    </>
  );
}

export default ChatLink;
