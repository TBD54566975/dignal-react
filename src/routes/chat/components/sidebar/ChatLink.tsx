import { NavLink } from 'react-router-dom';
import { RoutePaths } from '@/routes';
import { IChat } from '@routes/chat/types';

function ChatLink({ chat }: { chat: IChat }) {
  return (
    <NavLink to={RoutePaths.CHAT + '/' + chat.id} end className="message-row">
      <div
        className={`notification ${!chat.seen ? 'notification-active' : ''}`}
      >
        <span className="sr-only">{chat.seen ? '' : 'Unread'}</span>
      </div>
      <div className="avatar-container">
        <div className="avatar">
          <img src={chat.picture} alt="" />
        </div>
      </div>
      <div className="contents">
        <div className="message">
          <h2>{chat.name}</h2>
          {/* <p>{chat.message}</p> */}
        </div>
        <div className="meta">
          {/* <p className={!chat.seen ? 'text-highlight' : ''}>{chat.timestamp}</p> */}
          {chat.isAuthor && <p className="text-xxs">Sent</p>}
        </div>
      </div>
    </NavLink>
  );
}

export default ChatLink;
